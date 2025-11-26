import { useState } from 'react';
import { useResonixStore } from '../../stores/resonixStore';
import type { Track as TrackType } from '../../types/resonix';
import TrackControls from './TrackControls';

interface TrackProps {
  track: TrackType;
}

export default function Track({ track }: TrackProps) {
  const { updateTrack, removeTrack, selectTrack, selectedTrackId } = useResonixStore();
  const [showControls, setShowControls] = useState(false);

  const isSelected = selectedTrackId === track.id;

  const getTrackIcon = () => {
    switch (track.type) {
      case 'oscillator':
        return '〜';
      case 'noise':
        return '⚡';
      case 'binaural':
        return '🎧';
      case 'isochronic':
        return '⏱️';
      case 'audio':
        return '🎵';
      default:
        return '🎚️';
    }
  };

  const getTrackTypeLabel = () => {
    switch (track.type) {
      case 'oscillator':
        return `${track.waveform?.toUpperCase()} ${track.frequency?.toFixed(2)}Hz`;
      case 'noise':
        return `${track.noiseType?.toUpperCase()} Noise`;
      case 'binaural':
        return `Binaural ${track.baseFrequency}Hz ±${track.leftOffset}Hz`;
      case 'isochronic':
        return `Isochronic ${track.carrierFrequency}Hz @ ${track.pulseFrequency}Hz`;
      case 'audio':
        return 'Audio File';
      default:
        return 'Unknown';
    }
  };

  return (
    <div
      className={`border rounded-lg transition-all duration-200 ${
        isSelected
          ? 'border-purple-400 bg-purple-900/30 shadow-lg shadow-purple-500/20'
          : 'border-purple-500/30 bg-purple-900/20 hover:border-purple-400/50'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-2xl">
            {getTrackIcon()}
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={track.name}
                onChange={(e) => updateTrack(track.id, { name: e.target.value })}
                onClick={() => selectTrack(track.id)}
                className="bg-transparent border-none text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded px-2 py-1 -ml-2"
              />
            </div>
            <div className="text-sm text-purple-300/80">{getTrackTypeLabel()}</div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Mute */}
            <button
              onClick={() => updateTrack(track.id, { mute: !track.mute })}
              className={`w-8 h-8 rounded border transition-all ${
                track.mute
                  ? 'bg-red-600/40 border-red-500'
                  : 'bg-purple-600/20 border-purple-500/40 hover:bg-purple-600/30'
              }`}
              title="Mute"
            >
              <span className="text-sm">{track.mute ? '🔇' : '🔊'}</span>
            </button>

            {/* Solo */}
            <button
              onClick={() => updateTrack(track.id, { solo: !track.solo })}
              className={`w-8 h-8 rounded border transition-all ${
                track.solo
                  ? 'bg-yellow-600/40 border-yellow-500'
                  : 'bg-purple-600/20 border-purple-500/40 hover:bg-purple-600/30'
              }`}
              title="Solo"
            >
              <span className="text-sm font-bold text-yellow-300">S</span>
            </button>

            {/* Enable/Disable */}
            <button
              onClick={() => updateTrack(track.id, { enabled: !track.enabled })}
              className={`w-8 h-8 rounded border transition-all ${
                track.enabled
                  ? 'bg-green-600/40 border-green-500'
                  : 'bg-gray-600/40 border-gray-500'
              }`}
              title="Enable/Disable"
            >
              <span className="text-sm">{track.enabled ? '✓' : '✗'}</span>
            </button>

            {/* Expand Controls */}
            <button
              onClick={() => setShowControls(!showControls)}
              className="w-8 h-8 rounded border bg-purple-600/20 border-purple-500/40 hover:bg-purple-600/30 transition-all"
              title="Show Controls"
            >
              <span className="text-sm">{showControls ? '▲' : '▼'}</span>
            </button>

            {/* Delete */}
            <button
              onClick={() => removeTrack(track.id)}
              className="w-8 h-8 rounded border bg-red-600/20 border-red-500/40 hover:bg-red-600/30 transition-all"
              title="Delete Track"
            >
              <span className="text-sm">🗑️</span>
            </button>
          </div>
        </div>

        {/* Volume and Pan */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-purple-400 mb-1 block">Volume</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={track.volume}
              onChange={(e) => updateTrack(track.id, { volume: parseFloat(e.target.value) })}
              className="w-full h-2 rounded-lg appearance-none bg-purple-900/40 accent-purple-500"
            />
            <div className="text-xs text-purple-300 mt-1">{Math.round(track.volume * 100)}%</div>
          </div>

          <div>
            <label className="text-xs text-purple-400 mb-1 block">Pan</label>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={track.pan}
              onChange={(e) => updateTrack(track.id, { pan: parseFloat(e.target.value) })}
              className="w-full h-2 rounded-lg appearance-none bg-purple-900/40 accent-purple-500"
            />
            <div className="text-xs text-purple-300 mt-1">
              {track.pan < -0.01 ? `L${Math.abs(Math.round(track.pan * 100))}` : track.pan > 0.01 ? `R${Math.round(track.pan * 100)}` : 'C'}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Controls */}
      {showControls && (
        <div className="border-t border-purple-500/30 p-4 bg-purple-900/10">
          <TrackControls track={track} />
        </div>
      )}
    </div>
  );
}
