import { useResonixStore } from '../../stores/resonixStore';
import type { Track } from '../../types/resonix';

interface TrackControlsProps {
  track: Track;
}

export default function TrackControls({ track }: TrackControlsProps) {
  const { updateTrack } = useResonixStore();

  const noteToFrequency = (note: string): number => {
    const notes: { [key: string]: number } = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    const octave = parseInt(note.slice(-1));
    const noteName = note.slice(0, -1);
    const semitone = notes[noteName];
    return 440 * Math.pow(2, (semitone - 9 + (octave - 4) * 12) / 12);
  };

  return (
    <div className="space-y-4">
      {/* Oscillator Controls */}
      {track.type === 'oscillator' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-purple-400 mb-2 block">Waveform</label>
              <select
                value={track.waveform}
                onChange={(e) => updateTrack(track.id, { waveform: e.target.value as any })}
                className="w-full bg-purple-900/40 border border-purple-500/40 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="sine">Sine</option>
                <option value="square">Square</option>
                <option value="sawtooth">Sawtooth</option>
                <option value="triangle">Triangle</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-purple-400 mb-2 block">Frequency (Hz)</label>
              <input
                type="number"
                value={track.frequency?.toFixed(3) || 440}
                onChange={(e) => updateTrack(track.id, { frequency: parseFloat(e.target.value) })}
                step={0.001}
                className="w-full bg-purple-900/40 border border-purple-500/40 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Quick Note Buttons */}
          <div>
            <label className="text-xs text-purple-400 mb-2 block">Quick Notes</label>
            <div className="grid grid-cols-6 gap-2">
              {['A4', 'C4', 'D4', 'E4', 'G4', 'A5'].map((note) => (
                <button
                  key={note}
                  onClick={() => updateTrack(track.id, { frequency: noteToFrequency(note) })}
                  className="px-3 py-2 bg-purple-600/30 border border-purple-500/40 rounded hover:bg-purple-600/40 text-sm text-purple-200 transition-all"
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Solfeggio Frequencies */}
          <div>
            <label className="text-xs text-purple-400 mb-2 block">Solfeggio Frequencies</label>
            <div className="grid grid-cols-6 gap-2">
              {[174, 285, 396, 417, 528, 639, 741, 852, 963].map((freq) => (
                <button
                  key={freq}
                  onClick={() => updateTrack(track.id, { frequency: freq })}
                  className="px-3 py-2 bg-teal-600/30 border border-teal-500/40 rounded hover:bg-teal-600/40 text-sm text-teal-200 transition-all"
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Noise Controls */}
      {track.type === 'noise' && (
        <div>
          <label className="text-xs text-purple-400 mb-2 block">Noise Type</label>
          <select
            value={track.noiseType}
            onChange={(e) => updateTrack(track.id, { noiseType: e.target.value as any })}
            className="w-full bg-purple-900/40 border border-purple-500/40 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="white">White Noise</option>
            <option value="pink">Pink Noise</option>
            <option value="brown">Brown Noise</option>
          </select>
        </div>
      )}

      {/* Binaural Controls */}
      {track.type === 'binaural' && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-purple-400 mb-2 block">Base Frequency (Hz)</label>
            <input
              type="number"
              value={track.baseFrequency || 200}
              onChange={(e) => updateTrack(track.id, { baseFrequency: parseFloat(e.target.value) })}
              step={0.1}
              className="w-full bg-purple-900/40 border border-purple-500/40 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs text-purple-400 mb-2 block">Left Offset (Hz)</label>
            <input
              type="number"
              value={track.leftOffset || 2}
              onChange={(e) => updateTrack(track.id, { leftOffset: parseFloat(e.target.value) })}
              step={0.1}
              className="w-full bg-purple-900/40 border border-purple-500/40 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs text-purple-400 mb-2 block">Right Offset (Hz)</label>
            <input
              type="number"
              value={track.rightOffset || 2}
              onChange={(e) => updateTrack(track.id, { rightOffset: parseFloat(e.target.value) })}
              step={0.1}
              className="w-full bg-purple-900/40 border border-purple-500/40 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {/* Isochronic Controls */}
      {track.type === 'isochronic' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-purple-400 mb-2 block">Carrier Frequency (Hz)</label>
            <input
              type="number"
              value={track.carrierFrequency || 200}
              onChange={(e) => updateTrack(track.id, { carrierFrequency: parseFloat(e.target.value) })}
              step={0.1}
              className="w-full bg-purple-900/40 border border-purple-500/40 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs text-purple-400 mb-2 block">Pulse Frequency (Hz)</label>
            <input
              type="number"
              value={track.pulseFrequency || 10}
              onChange={(e) => updateTrack(track.id, { pulseFrequency: parseFloat(e.target.value) })}
              step={0.1}
              min={0.5}
              max={100}
              className="w-full bg-purple-900/40 border border-purple-500/40 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {/* Brainwave Preset Buttons */}
      {(track.type === 'binaural' || track.type === 'isochronic') && (
        <div>
          <label className="text-xs text-purple-400 mb-2 block">Brainwave Presets</label>
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => {
                if (track.type === 'binaural') {
                  updateTrack(track.id, { leftOffset: -0.75, rightOffset: 0.75 });
                } else {
                  updateTrack(track.id, { pulseFrequency: 1.5 });
                }
              }}
              className="px-3 py-2 bg-indigo-600/30 border border-indigo-500/40 rounded hover:bg-indigo-600/40 text-xs text-indigo-200 transition-all"
              title="Delta (0.5-4 Hz) - Deep Sleep"
            >
              Delta<br/>1.5Hz
            </button>
            <button
              onClick={() => {
                if (track.type === 'binaural') {
                  updateTrack(track.id, { leftOffset: -3, rightOffset: 3 });
                } else {
                  updateTrack(track.id, { pulseFrequency: 6 });
                }
              }}
              className="px-3 py-2 bg-purple-600/30 border border-purple-500/40 rounded hover:bg-purple-600/40 text-xs text-purple-200 transition-all"
              title="Theta (4-8 Hz) - Meditation"
            >
              Theta<br/>6Hz
            </button>
            <button
              onClick={() => {
                if (track.type === 'binaural') {
                  updateTrack(track.id, { leftOffset: -5, rightOffset: 5 });
                } else {
                  updateTrack(track.id, { pulseFrequency: 10 });
                }
              }}
              className="px-3 py-2 bg-blue-600/30 border border-blue-500/40 rounded hover:bg-blue-600/40 text-xs text-blue-200 transition-all"
              title="Alpha (8-12 Hz) - Relaxation"
            >
              Alpha<br/>10Hz
            </button>
            <button
              onClick={() => {
                if (track.type === 'binaural') {
                  updateTrack(track.id, { leftOffset: -10, rightOffset: 10 });
                } else {
                  updateTrack(track.id, { pulseFrequency: 20 });
                }
              }}
              className="px-3 py-2 bg-green-600/30 border border-green-500/40 rounded hover:bg-green-600/40 text-xs text-green-200 transition-all"
              title="Beta (12-30 Hz) - Focus"
            >
              Beta<br/>20Hz
            </button>
            <button
              onClick={() => {
                if (track.type === 'binaural') {
                  updateTrack(track.id, { leftOffset: -20, rightOffset: 20 });
                } else {
                  updateTrack(track.id, { pulseFrequency: 40 });
                }
              }}
              className="px-3 py-2 bg-yellow-600/30 border border-yellow-500/40 rounded hover:bg-yellow-600/40 text-xs text-yellow-200 transition-all"
              title="Gamma (30-100 Hz) - Peak Performance"
            >
              Gamma<br/>40Hz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
