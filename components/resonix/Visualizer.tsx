import { useEffect, useRef, useState } from 'react';
import { useResonixStore } from '../../stores/resonixStore';
import { audioEngine } from '../../services/audioEngine';

export default function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const { visualizerMode, setVisualizerMode, transport } = useResonixStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!transport.isPlaying || !canvasRef.current) return;

    try {
      // Get the analyser from the audio engine (it's already connected)
      const analyser = audioEngine.getAnalyser();

      if (analyser && !analyserRef.current) {
        analyserRef.current = analyser;
        // Update FFT size based on visualizer mode
        analyserRef.current.fftSize = visualizerMode === 'waveform' ? 2048 : 8192;
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Visualizer initialization error:', error);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [transport.isPlaying, visualizerMode]);

  useEffect(() => {
    if (!isInitialized || !canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!ctx || !canvas) return;

      animationRef.current = requestAnimationFrame(draw);

      ctx.fillStyle = 'rgba(17, 24, 39, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (visualizerMode === 'waveform') {
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(168, 85, 247)';
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      } else {
        // Spectrogram
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;

          const hue = (i / bufferLength) * 300 + 240;
          ctx.fillStyle = `hsl(${hue}, 80%, ${50 + (dataArray[i] / 255) * 30}%)`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      }
    };

    if (transport.isPlaying) {
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, visualizerMode, transport.isPlaying]);

  return (
    <div className="bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-900/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-300">Visualizer</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setVisualizerMode('waveform')}
            className={`px-4 py-2 rounded-lg transition-all ${
              visualizerMode === 'waveform'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30'
            }`}
          >
            Waveform
          </button>
          <button
            onClick={() => setVisualizerMode('spectrogram')}
            className={`px-4 py-2 rounded-lg transition-all ${
              visualizerMode === 'spectrogram'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30'
            }`}
          >
            Spectrum
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="w-full h-48 bg-gray-900/50 rounded-lg border border-purple-500/20"
      />

      {!transport.isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-purple-400/50 text-sm">
            Press Play to see visualization
          </div>
        </div>
      )}
    </div>
  );
}
