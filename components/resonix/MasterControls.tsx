import { useResonixStore } from '../../stores/resonixStore';

export default function MasterControls() {
  const { masterVolume, setMasterVolume, exportProject } = useResonixStore();

  return (
    <div className="bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-cyan-300 font-semibold text-lg">🎚️ Master Volume</span>
            <span className="text-cyan-400 font-mono text-xl">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="w-full h-3 rounded-lg appearance-none bg-cyan-900/40 accent-cyan-500 cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(34 211 238) 0%, rgb(34 211 238) ${
                masterVolume * 100
              }%, rgb(22 78 99 / 0.4) ${masterVolume * 100}%, rgb(22 78 99 / 0.4) 100%)`,
            }}
          />
        </div>

        <button
          onClick={exportProject}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all duration-200 font-medium shadow-lg shadow-emerald-500/30 ml-6"
        >
          💾 Export Project
        </button>
      </div>
    </div>
  );
}
