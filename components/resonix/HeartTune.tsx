import { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import WaveSurfer from 'wavesurfer.js';

interface ConversionMode {
  type: 'pure' | 'pitchOnly';
  label: string;
  description: string;
}

const CONVERSION_RATIO = 432 / 440; // 0.9818181818...
const GOLDEN_RATIO = 1.618;

export default function HeartTune() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'pure' | 'pitchOnly'>('pure');
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [shareToLibrary, setShareToLibrary] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modes: ConversionMode[] = [
    {
      type: 'pure',
      label: 'Pure 432',
      description: 'Varispeed (pitch + tempo shift)',
    },
    {
      type: 'pitchOnly',
      label: '432 Pitch Only',
      description: 'Keep original BPM',
    },
  ];

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'rgb(168, 85, 247)',
        progressColor: 'rgb(236, 72, 153)',
        cursorColor: 'rgb(6, 182, 212)',
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 100,
        normalize: true,
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setConvertedBlob(null);
    setIsComplete(false);
    setShowEasterEgg(false);
    setDetectedFrequency(null);

    // Load waveform preview
    if (wavesurferRef.current) {
      const url = URL.createObjectURL(selectedFile);
      await wavesurferRef.current.load(url);
    }
  };

  const detectBaseFrequency = async (buffer: AudioBuffer): Promise<number> => {
    // Simple frequency detection using autocorrelation
    // This is a simplified approach - in reality, we'd analyze the fundamental frequency
    // For now, we'll assume it's at 440 Hz standard tuning
    // A more sophisticated implementation would use FFT analysis

    const channelData = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    // Analyze a small portion (first second)
    const analyzeLength = Math.min(sampleRate, channelData.length);
    const data = channelData.slice(0, analyzeLength);

    // Simple autocorrelation to find pitch
    let maxCorrelation = 0;
    let bestOffset = 0;

    const minPeriod = Math.floor(sampleRate / 1000); // 1000 Hz max
    const maxPeriod = Math.floor(sampleRate / 100);  // 100 Hz min

    for (let offset = minPeriod; offset < maxPeriod; offset++) {
      let correlation = 0;
      for (let i = 0; i < analyzeLength - offset; i++) {
        correlation += Math.abs(data[i] - data[i + offset]);
      }
      correlation = 1 - correlation / analyzeLength;

      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestOffset = offset;
      }
    }

    const frequency = sampleRate / bestOffset;

    // Round to nearest note frequency
    const A4 = 440;

    // Check if it's closer to 432 Hz or 440 Hz reference
    const cents440 = 1200 * Math.log2(frequency / A4);
    const cents432 = 1200 * Math.log2(frequency / (432));

    if (Math.abs(cents432) < Math.abs(cents440)) {
      return 432;
    }
    return 440;
  };

  const convertTo432Hz = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Initialize Tone.js
      await Tone.start();

      // Load the audio file
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);

      // Detect base frequency
      const baseFreq = await detectBaseFrequency(audioBuffer);
      setDetectedFrequency(baseFreq);

      // Check if already at 432 Hz
      if (Math.abs(baseFreq - 432) < 0.5) {
        setShowEasterEgg(true);
        setIsProcessing(false);
        return;
      }

      setProgress(25);

      // Create offline context for rendering
      const offlineContext = new Tone.OfflineContext(
        audioBuffer.numberOfChannels,
        audioBuffer.duration,
        audioBuffer.sampleRate
      );

      // Decode audio again in the offline context to avoid AudioContext mismatch
      const offlineAudioBuffer = await offlineContext.decodeAudioData(
        await file.arrayBuffer()
      );

      // Set the offline context as the current context temporarily
      const originalContext = Tone.getContext();
      Tone.setContext(offlineContext);

      let renderedBuffer: Tone.ToneAudioBuffer;
      try {
        // Create player in offline context
        const player = new Tone.Player(offlineAudioBuffer);

        if (mode === 'pure') {
          // Pure 432: Simple varispeed (pitch + tempo shift)
          player.playbackRate = CONVERSION_RATIO;
          player.connect(offlineContext.destination);
        } else {
          // Pitch Only: Use PitchShift to maintain tempo
          const pitchShift = new Tone.PitchShift({
            pitch: -0.32, // Approximately -31.77 cents (440 to 432 Hz)
          }).connect(offlineContext.destination);

          player.connect(pitchShift);
          player.playbackRate = 1; // Keep original tempo
        }

        setProgress(50);

        // Start playback and render
        player.start(0);

        renderedBuffer = await offlineContext.render();
      } finally {
        // Ensure we always restore the original context
        Tone.setContext(originalContext);
      }

      setProgress(75);

      // Convert ToneAudioBuffer to Web Audio API AudioBuffer
      // Create a new AudioBuffer with the rendered data
      const webAudioContext = Tone.getContext().rawContext as AudioContext;
      const audioBufferForWav = webAudioContext.createBuffer(
        renderedBuffer.numberOfChannels,
        renderedBuffer.length,
        renderedBuffer.sampleRate
      );

      // Copy channel data from ToneAudioBuffer to Web Audio API AudioBuffer
      for (let channel = 0; channel < renderedBuffer.numberOfChannels; channel++) {
        const channelData = renderedBuffer.toArray(channel);
        const float32Data = Array.isArray(channelData)
          ? new Float32Array(channelData[0])
          : new Float32Array(channelData);
        audioBufferForWav.copyToChannel(float32Data, channel);
      }

      // Convert to WAV blob
      const wavBlob = await bufferToWave(audioBufferForWav);

      setConvertedBlob(wavBlob);
      setProgress(100);
      setIsComplete(true);

      // Update waveform with converted audio
      if (wavesurferRef.current) {
        const url = URL.createObjectURL(wavBlob);
        await wavesurferRef.current.load(url);
      }

    } catch (error) {
      console.error('Conversion failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to convert audio: ${errorMessage}\n\nPlease try again or check the console for details.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert AudioBuffer to WAV Blob
  const bufferToWave = async (buffer: AudioBuffer): Promise<Blob> => {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels: Float32Array[] = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // RIFF identifier
    setUint32(0x46464952);
    // File length
    setUint32(length - 8);
    // RIFF type
    setUint32(0x45564157);
    // Format chunk identifier
    setUint32(0x20746d66);
    // Format chunk length
    setUint32(16);
    // Sample format (raw)
    setUint16(1);
    // Channel count
    setUint16(buffer.numberOfChannels);
    // Sample rate
    setUint32(buffer.sampleRate);
    // Byte rate
    setUint32(buffer.sampleRate * 2 * buffer.numberOfChannels);
    // Block align
    setUint16(buffer.numberOfChannels * 2);
    // Bits per sample
    setUint16(16);
    // Data chunk identifier
    setUint32(0x61746164);
    // Data chunk length
    setUint32(length - pos - 4);

    // Write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const handleDownload = async () => {
    if (!convertedBlob || !file) return;

    const originalName = file.name.replace(/\.[^/.]+$/, '');

    // Download the file
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalName}_432hz.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Upload to library if checkbox is checked
    if (shareToLibrary) {
      try {
        setIsUploading(true);

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(convertedBlob);

        reader.onloadend = async () => {
          const base64Audio = reader.result as string;

          const response = await fetch('/api/save-to-library', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: originalName,
              originalFrequency: detectedFrequency || 440,
              targetFrequency: 432,
              uploaderName: 'Anonymous', // Could be enhanced with user authentication
              audioData: base64Audio,
            }),
          });

          if (response.ok) {
            console.log('Successfully shared to library!');
            // Could show a success toast notification here
          } else {
            console.error('Failed to share to library');
          }

          setIsUploading(false);
        };
      } catch (error) {
        console.error('Error sharing to library:', error);
        setIsUploading(false);
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setConvertedBlob(null);
    setIsComplete(false);
    setShowEasterEgg(false);
    setProgress(0);
    setDetectedFrequency(null);

    if (wavesurferRef.current) {
      wavesurferRef.current.empty();
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-teal-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400">
            HeartTune
          </span>
        </h2>
        <p className="text-purple-300/80 text-sm sm:text-base">
          432 Hz Heart Frequency Converter
        </p>
      </div>

      {/* Easter Egg */}
      {showEasterEgg && (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40 rounded-xl text-center animate-pulse">
          <div className="text-4xl mb-2">❤️</div>
          <p className="text-pink-300 font-semibold">
            This soul was already tuned to the heart
          </p>
          <p className="text-pink-400/70 text-sm mt-1">
            No conversion needed - you're already vibrating at 432 Hz!
          </p>
        </div>
      )}

      {/* Dropzone */}
      {!file && (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-pink-400 bg-pink-500/10 scale-105'
              : 'border-purple-500/40 bg-purple-900/20 hover:border-purple-400 hover:bg-purple-500/10'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="space-y-4">
            <div className="text-6xl">🎵</div>
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-teal-300 mb-2">
                Drag any song to retune it to 432 Hz Heart Frequency
              </p>
              <p className="text-purple-400/70 text-sm">
                or click to browse your files
              </p>
            </div>
          </div>

          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
        </div>
      )}

      {/* File Selected */}
      {file && !showEasterEgg && (
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 font-semibold truncate flex-1">
                {file.name}
              </span>
              <button
                onClick={handleReset}
                className="ml-4 px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-sm transition-colors"
              >
                Change
              </button>
            </div>
            {detectedFrequency && (
              <p className="text-purple-400/70 text-xs">
                Detected base frequency: {detectedFrequency} Hz
              </p>
            )}
          </div>

          {/* Mode Selection */}
          <div className="space-y-3">
            <label className="text-purple-300 text-sm font-semibold">
              Conversion Mode:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modes.map((m) => (
                <button
                  key={m.type}
                  onClick={() => setMode(m.type)}
                  disabled={isProcessing}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    mode === m.type
                      ? 'border-pink-500 bg-pink-500/20 shadow-lg shadow-pink-500/20'
                      : 'border-purple-500/30 bg-purple-900/20 hover:border-purple-400 hover:bg-purple-500/10'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-purple-200 mb-1">
                      {m.label}
                      {mode === m.type && m.type === 'pure' && ' ✓'}
                    </div>
                    <div className="text-xs text-purple-400/70">
                      {m.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Waveform Preview */}
          <div className="bg-black/30 border border-purple-500/20 rounded-xl p-4">
            <div ref={waveformRef} className="w-full" />
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-300">
                <span>Converting to 432 Hz...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-purple-900/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 transition-all duration-300 animate-gradient-x"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Convert Button */}
          {!isProcessing && !isComplete && (
            <button
              onClick={convertTo432Hz}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 hover:from-purple-500 hover:via-pink-500 hover:to-teal-500 text-white font-bold text-lg transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              ✨ Convert to 432 Hz ✨
            </button>
          )}

          {/* Download Button */}
          {isComplete && convertedBlob && (
            <div className="space-y-4">
              <div className="bg-green-600/20 border border-green-500/40 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2 animate-pulse" style={{ animationDuration: `${60 / GOLDEN_RATIO}s` }}>
                  ❤️
                </div>
                <p className="text-green-300 font-semibold">
                  Conversion Complete!
                </p>
                <p className="text-green-400/70 text-sm mt-1">
                  Your song is now tuned to the heart frequency
                </p>
              </div>

              {/* Share to Library Checkbox */}
              <label className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-teal-900/40 border border-purple-500/30 rounded-xl cursor-pointer hover:border-purple-400/50 transition-all">
                <input
                  type="checkbox"
                  checked={shareToLibrary}
                  onChange={(e) => setShareToLibrary(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded bg-purple-900/50 border-purple-500/50 text-pink-500 focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-0 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-purple-200 font-medium text-sm">
                    ✨ Share this healing version with the community
                  </div>
                  <div className="text-purple-400/70 text-xs mt-1">
                    Add to the public Resonix Library so others can discover your 432 Hz conversion
                  </div>
                </div>
              </label>

              <button
                onClick={handleDownload}
                disabled={isUploading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 hover:from-green-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold text-lg transition-all duration-300 shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isUploading ? '⏳ Downloading & Sharing...' : '💾 Download 432 Hz Version'}
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 text-sm transition-colors"
              >
                Convert Another Track
              </button>
            </div>
          )}
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-6 pt-6 border-t border-purple-500/20 text-center">
        <p className="text-purple-400/60 text-xs leading-relaxed">
          432 Hz is known as the "heart frequency" - said to resonate with the natural vibration of the universe.
          Some believe it promotes healing, clarity, and emotional balance.
        </p>
      </div>

      {/* Add custom animation styles */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
