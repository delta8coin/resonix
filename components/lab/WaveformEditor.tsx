import { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import MinimapPlugin from 'wavesurfer.js/dist/plugins/minimap.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.js';
import {
  retuneAudio,
  detectDominantFrequency,
  calculateFrequencyDeviation,
  exportAsWAV,
  frequencyToNote,
} from '../../utils/audioProcessing';

interface WaveformEditorProps {
  audioBuffer: AudioBuffer | null;
  fileName: string;
}

export default function WaveformEditor({ audioBuffer, fileName }: WaveformEditorProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const spectrogramRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsPluginRef = useRef<any>(null);
  const isInitializingRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSpectrogram, setShowSpectrogram] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || !audioBuffer) return;

    // Prevent multiple simultaneous initializations
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    // Create regions plugin
    const regionsPlugin = RegionsPlugin.create();
    regionsPluginRef.current = regionsPlugin;

    // Create timeline plugin
    const timelinePlugin = TimelinePlugin.create({
      container: '#timeline',
      height: 20,
    });

    // Create minimap plugin
    const minimapPlugin = MinimapPlugin.create({
      container: '#minimap',
      height: 50,
      waveColor: '#8B5CF6',
      progressColor: '#6D28D9',
    });

    // Create WaveSurfer instance
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#8B5CF6',
      progressColor: '#6D28D9',
      cursorColor: '#ffffff',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 200,
      normalize: true,
      plugins: [regionsPlugin, timelinePlugin, minimapPlugin],
    });

    wavesurferRef.current = ws;

    // Load audio buffer with error handling
    try {
      const blob = audioBufferToBlob(audioBuffer);
      ws.loadBlob(blob);
    } catch (error) {
      console.error('Failed to load audio buffer:', error);
      alert('Failed to load audio waveform. Please try refreshing the page.');
      return;
    }

    // Event listeners
    ws.on('ready', () => {
      setDuration(ws.getDuration());
      isInitializingRef.current = false;
    });

    ws.on('error', (error: any) => {
      console.error('WaveSurfer error:', error);
      isInitializingRef.current = false;
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));

    ws.on('timeupdate', (time) => {
      setCurrentTime(time);
    });

    // Region events
    regionsPlugin.on('region-created', (region: any) => {
      setSelectedRegion(region);
    });

    regionsPlugin.on('region-updated', (region: any) => {
      setSelectedRegion(region);
    });

    regionsPlugin.on('region-clicked', (region: any, e: MouseEvent) => {
      e.stopPropagation();
      setSelectedRegion(region);

      // Right-click for context menu
      if (e.button === 2) {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }
    });

    // Double-click to create region - with debouncing to prevent infinite loops
    let interactionTimeout: NodeJS.Timeout | null = null;
    ws.on('dblclick', () => {
      if (interactionTimeout) return;

      interactionTimeout = setTimeout(() => {
        interactionTimeout = null;
      }, 100);

      if (!regionsPlugin.getRegions().length) {
        const duration = ws.getDuration();
        regionsPlugin.addRegion({
          start: duration * 0.25,
          end: duration * 0.75,
          color: 'rgba(139, 92, 246, 0.3)',
          drag: true,
          resize: true,
        });
      }
    });

    // Clean up
    return () => {
      isInitializingRef.current = false;
      try {
        if (ws && typeof ws.destroy === 'function') {
          ws.destroy();
        }
      } catch (error) {
        console.error('Error destroying WaveSurfer:', error);
      }
      wavesurferRef.current = null;
    };
  }, [audioBuffer]);

  // Toggle spectrogram
  useEffect(() => {
    if (!wavesurferRef.current || !audioBuffer || !spectrogramRef.current) return;

    if (showSpectrogram) {
      try {
        const spectrogramPlugin = SpectrogramPlugin.create({
          container: spectrogramRef.current,
          labels: true,
          height: 150,
        });

        wavesurferRef.current.registerPlugin(spectrogramPlugin);

        return () => {
          try {
            spectrogramPlugin.destroy();
          } catch (error) {
            console.error('Error destroying spectrogram:', error);
          }
        };
      } catch (error) {
        console.error('Failed to create spectrogram:', error);
        setShowSpectrogram(false);
      }
    }
  }, [showSpectrogram, audioBuffer]);

  // Update zoom
  useEffect(() => {
    if (wavesurferRef.current && wavesurferRef.current.getDuration() > 0) {
      wavesurferRef.current.zoom(zoom);
    }
  }, [zoom]);

  // Play/pause toggle
  const togglePlayPause = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  }, []);

  // Stop playback
  const stop = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  // Analyze frequency
  const analyzeFrequency = useCallback(async () => {
    if (!audioBuffer || !selectedRegion) return;

    setIsProcessing(true);
    try {
      const start = selectedRegion.start;
      const duration = selectedRegion.end - selectedRegion.start;

      const result = detectDominantFrequency(audioBuffer, start, duration);
      const deviation432 = calculateFrequencyDeviation(result.frequency, 432);
      const deviation440 = calculateFrequencyDeviation(result.frequency, 440);
      const note = frequencyToNote(result.frequency);

      setAnalysisResult({
        frequency: result.frequency.toFixed(2),
        note,
        confidence: (result.confidence * 100).toFixed(0),
        deviation432: deviation432.cents.toFixed(0),
        deviation440: deviation440.cents.toFixed(0),
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [audioBuffer, selectedRegion]);

  // Retune audio
  const handleRetune = useCallback(async (targetHz: number) => {
    if (!audioBuffer || !wavesurferRef.current) return;

    setIsProcessing(true);
    setContextMenu(null);

    try {
      const retunedBuffer = await retuneAudio(audioBuffer, targetHz);

      // Ensure we have a valid buffer before converting
      if (!retunedBuffer || retunedBuffer.length === 0) {
        throw new Error('Retune produced invalid audio buffer');
      }

      const blob = audioBufferToBlob(retunedBuffer);

      // Load the new blob into WaveSurfer
      if (wavesurferRef.current) {
        wavesurferRef.current.loadBlob(blob);
      }
    } catch (error) {
      console.error('Retune failed:', error);
      alert('Failed to retune audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [audioBuffer]);

  // Export audio
  const handleExport = useCallback(() => {
    if (!audioBuffer) return;

    const exportName = fileName.replace(/\.[^/.]+$/, '') + '_processed.wav';
    exportAsWAV(audioBuffer, exportName);
  }, [audioBuffer, fileName]);

  // Close context menu
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    const handleContextMenu = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.context-menu')) {
        e.preventDefault();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!audioBuffer) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="glass p-4 rounded-lg flex items-center justify-between gap-4 flex-wrap">
        {/* Transport controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            disabled={isProcessing}
            className="p-3 rounded-full bg-netflix-red hover:bg-purple-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={stop}
            disabled={isProcessing}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Time display */}
          <div className="text-sm text-gray-400 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* View controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSpectrogram(!showSpectrogram)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showSpectrogram
                ? 'bg-netflix-red text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Spectrogram
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Zoom:</label>
            <input
              type="range"
              min="1"
              max="100"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24"
            />
          </div>

          <button
            onClick={handleExport}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export WAV
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div id="timeline" className="bg-gray-900/50 rounded-lg" />

      {/* Waveform */}
      <div className="glass rounded-lg p-4">
        <div ref={waveformRef} className="w-full" />
      </div>

      {/* Spectrogram */}
      {showSpectrogram && (
        <div className="glass rounded-lg p-4">
          <div ref={spectrogramRef} className="w-full" />
        </div>
      )}

      {/* Minimap */}
      <div id="minimap" className="glass rounded-lg p-2" />

      {/* Analysis Results */}
      {analysisResult && (
        <div className="glass p-4 rounded-lg animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-netflix-red" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Frequency Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-400">Dominant Frequency</div>
              <div className="text-2xl font-bold text-netflix-red">{analysisResult.frequency} Hz</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Note</div>
              <div className="text-2xl font-bold text-white">{analysisResult.note}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Confidence</div>
              <div className="text-2xl font-bold text-green-400">{analysisResult.confidence}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Deviation from 432 Hz</div>
              <div className="text-lg font-bold text-purple-400">{analysisResult.deviation432} cents</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Deviation from 440 Hz</div>
              <div className="text-lg font-bold text-blue-400">{analysisResult.deviation440} cents</div>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && selectedRegion && (
        <div
          className="context-menu fixed z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-2 min-w-[200px] animate-fade-in"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleRetune(432)}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-netflix-red transition-colors"
          >
            Retune to 432 Hz (Pure)
          </button>
          <button
            onClick={() => handleRetune(432)}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-netflix-red transition-colors"
          >
            Retune to 432 Hz (Pitch Only)
          </button>
          <button
            onClick={() => handleRetune(528)}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-netflix-red transition-colors"
          >
            Retune to 528 Hz
          </button>
          <button
            onClick={() => handleRetune(444)}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-netflix-red transition-colors"
          >
            Retune to 444 Hz
          </button>
          <div className="border-t border-gray-700 my-1" />
          <button
            onClick={analyzeFrequency}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-purple-600 transition-colors"
          >
            Analyze Frequency
          </button>
        </div>
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center animate-fade-in">
          <div className="bg-gray-900 p-8 rounded-xl border border-netflix-red shadow-2xl">
            <div className="flex items-center gap-4">
              <svg className="w-8 h-8 text-netflix-red animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <div>
                <div className="text-white font-bold">Processing Audio</div>
                <div className="text-sm text-gray-400">Applying frequency transformation...</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to convert AudioBuffer to Blob
function audioBufferToBlob(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numberOfChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  const channels = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
