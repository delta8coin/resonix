import { useEffect } from 'react';
import { useResonixStore } from '../../stores/resonixStore';
import { audioEngine } from '../../services/audioEngine';

export default function Transport() {
  const {
    transport,
    tracks,
    masterVolume,
    masterEffects,
    setPlaying,
    setCurrentTime,
    setLoop,
    saveProject,
  } = useResonixStore();

  // Initialize audio engine
  useEffect(() => {
    audioEngine.init();
  }, []);

  // Update audio engine when tracks or effects change
  useEffect(() => {
    tracks.forEach((track) => {
      if (track.enabled) {
        const node = audioEngine.createTrackNode(track);
        if (node && transport.isPlaying) {
          audioEngine.startTrack(track.id);
        }
      } else {
        audioEngine.stopTrack(track.id);
        audioEngine.disposeTrackNode(track.id);
      }
    });
  }, [tracks, transport.isPlaying]);

  // Update track parameters
  useEffect(() => {
    tracks.forEach((track) => {
      audioEngine.updateTrackParams(track);
    });
  }, [tracks]);

  // Update master effects
  useEffect(() => {
    audioEngine.updateMasterEffects(masterEffects);
  }, [masterEffects]);

  // Update master volume
  useEffect(() => {
    audioEngine.updateMasterVolume(masterVolume);
  }, [masterVolume]);

  const handlePlay = async () => {
    await audioEngine.init();
    setPlaying(true);

    // Start all enabled tracks
    tracks.forEach((track) => {
      if (track.enabled) {
        audioEngine.startTrack(track.id);
      }
    });
  };

  const handlePause = () => {
    setPlaying(false);
    tracks.forEach((track) => {
      audioEngine.stopTrack(track.id);
    });
  };

  const handleStop = () => {
    setPlaying(false);
    setCurrentTime(0);
    tracks.forEach((track) => {
      audioEngine.stopTrack(track.id);
    });
  };

  const handleExport = async () => {
    try {
      const duration = transport.duration;
      const blob = await audioEngine.exportWAV(duration);

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resonix-export-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-6">
        {/* Transport Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStop}
            className="w-12 h-12 rounded-lg bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 transition-all duration-200 flex items-center justify-center group"
            title="Stop (S)"
          >
            <div className="w-4 h-4 bg-purple-400 group-hover:bg-purple-300 transition-colors" />
          </button>

          {!transport.isPlaying ? (
            <button
              onClick={handlePlay}
              className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-200 flex items-center justify-center shadow-lg shadow-purple-500/50 group"
              title="Play (Space)"
            >
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-200 flex items-center justify-center shadow-lg shadow-purple-500/50 group"
              title="Pause (Space)"
            >
              <div className="flex gap-1.5">
                <div className="w-1.5 h-5 bg-white" />
                <div className="w-1.5 h-5 bg-white" />
              </div>
            </button>
          )}

          <button
            onClick={() => setLoop(!transport.loop)}
            className={`w-12 h-12 rounded-lg border transition-all duration-200 flex items-center justify-center ${
              transport.loop
                ? 'bg-purple-600/40 border-purple-400'
                : 'bg-purple-600/20 border-purple-500/40 hover:bg-purple-600/30'
            }`}
            title="Loop (L)"
          >
            <svg
              className={`w-5 h-5 ${transport.loop ? 'text-purple-300' : 'text-purple-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Time Display */}
        <div className="flex items-center gap-4">
          <div className="text-purple-300 font-mono text-lg">
            {formatTime(transport.currentTime)}
          </div>
          <div className="text-purple-500/60">/</div>
          <div className="text-purple-400/80 font-mono">
            {formatTime(transport.duration)}
          </div>
        </div>

        {/* Export and Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => saveProject()}
            className="px-6 py-3 rounded-lg bg-teal-600/20 border border-teal-500/40 hover:bg-teal-600/30 text-teal-300 transition-all duration-200 font-medium"
            title="Save Project (Ctrl+S)"
          >
            💾 Save
          </button>

          <button
            onClick={handleExport}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all duration-200 font-medium shadow-lg shadow-cyan-500/30"
            title="Export WAV (Ctrl+E)"
          >
            ⬇️ Export WAV
          </button>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="mt-6">
        <input
          type="range"
          min={0}
          max={transport.duration}
          step={0.1}
          value={transport.currentTime}
          onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-purple-900/40 accent-purple-500"
          style={{
            background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${
              (transport.currentTime / transport.duration) * 100
            }%, rgb(88 28 135 / 0.4) ${
              (transport.currentTime / transport.duration) * 100
            }%, rgb(88 28 135 / 0.4) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
