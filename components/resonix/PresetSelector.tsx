import { useState } from 'react';
import { useResonixStore } from '../../stores/resonixStore';
import { RESONIX_PRESETS } from '../../data/resonixPresets';
import type { Preset } from '../../types/resonix';

export default function PresetSelector() {
  const { loadPreset } = useResonixStore();
  const [selectedCategory, setSelectedCategory] = useState<Preset['category'] | 'all'>('all');
  const [showPresets, setShowPresets] = useState(false);

  const categories: (Preset['category'] | 'all')[] = [
    'all',
    'focus',
    'sleep',
    'meditation',
    'energy',
    'healing',
  ];

  const filteredPresets =
    selectedCategory === 'all'
      ? RESONIX_PRESETS
      : RESONIX_PRESETS.filter((p) => p.category === selectedCategory);

  const handleLoadPreset = (preset: Preset) => {
    loadPreset(preset);
    setShowPresets(false);
  };

  return (
    <div className="bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-pink-900/20 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-pink-300 flex items-center gap-2">
          <span>✨</span>
          Brain-Wave Presets
        </h3>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition-all duration-200 font-medium shadow-lg shadow-pink-500/30"
        >
          {showPresets ? 'Close' : 'Browse Presets'}
        </button>
      </div>

      {showPresets && (
        <div className="mt-6">
          {/* Category Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  selectedCategory === cat
                    ? 'bg-pink-600 text-white'
                    : 'bg-pink-600/20 border border-pink-500/40 text-pink-300 hover:bg-pink-600/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Preset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-4 bg-purple-900/30 border border-pink-500/30 rounded-lg hover:border-pink-400/50 transition-all cursor-pointer group"
                onClick={() => handleLoadPreset(preset)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-semibold group-hover:text-pink-300 transition-colors">
                      {preset.name}
                    </h4>
                    <span className="text-xs text-pink-400 capitalize px-2 py-1 bg-pink-500/20 rounded mt-1 inline-block">
                      {preset.category}
                    </span>
                  </div>
                  <button className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded text-sm transition-all">
                    Load
                  </button>
                </div>
                <p className="text-sm text-purple-300/80 mb-3">{preset.description}</p>
                <div className="text-xs text-purple-400/60">
                  {preset.tracks.length} tracks
                  {preset.duration && ` • ${Math.floor(preset.duration / 60)} min`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
