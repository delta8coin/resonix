import { useState } from 'react';
import { useResonixStore } from '../../stores/resonixStore';
import type { TrackType } from '../../types/resonix';

export default function AddTrackButton() {
  const { addTrack } = useResonixStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleAddTrack = (type: TrackType) => {
    const baseTrack = {
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type,
      enabled: true,
      solo: false,
      mute: false,
      volume: 0.7,
      pan: 0,
    };

    switch (type) {
      case 'oscillator':
        addTrack({
          ...baseTrack,
          waveform: 'sine',
          frequency: 440,
        });
        break;
      case 'noise':
        addTrack({
          ...baseTrack,
          noiseType: 'pink',
        });
        break;
      case 'binaural':
        addTrack({
          ...baseTrack,
          baseFrequency: 200,
          leftOffset: -2,
          rightOffset: 2,
        });
        break;
      case 'isochronic':
        addTrack({
          ...baseTrack,
          carrierFrequency: 200,
          pulseFrequency: 10,
        });
        break;
      default:
        addTrack(baseTrack);
    }

    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-all duration-200 font-medium shadow-lg shadow-purple-500/30 flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        Add Track
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-purple-900 border border-purple-500/40 rounded-lg shadow-2xl shadow-purple-500/30 z-50 overflow-hidden">
            <div className="p-2 space-y-1">
              <button
                onClick={() => handleAddTrack('oscillator')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-700/50 transition-all text-white flex items-center gap-3"
              >
                <span className="text-2xl">〜</span>
                <div>
                  <div className="font-medium">Oscillator</div>
                  <div className="text-xs text-purple-300">Sine, square, saw, triangle waves</div>
                </div>
              </button>

              <button
                onClick={() => handleAddTrack('noise')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-700/50 transition-all text-white flex items-center gap-3"
              >
                <span className="text-2xl">⚡</span>
                <div>
                  <div className="font-medium">Noise Generator</div>
                  <div className="text-xs text-purple-300">White, pink, brown noise</div>
                </div>
              </button>

              <button
                onClick={() => handleAddTrack('binaural')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-700/50 transition-all text-white flex items-center gap-3"
              >
                <span className="text-2xl">🎧</span>
                <div>
                  <div className="font-medium">Binaural Beat</div>
                  <div className="text-xs text-purple-300">Different freq per ear</div>
                </div>
              </button>

              <button
                onClick={() => handleAddTrack('isochronic')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-700/50 transition-all text-white flex items-center gap-3"
              >
                <span className="text-2xl">⏱️</span>
                <div>
                  <div className="font-medium">Isochronic Tone</div>
                  <div className="text-xs text-purple-300">Pulsing amplitude modulation</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
