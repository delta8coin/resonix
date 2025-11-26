import { useState } from 'react';
import { useResonixStore } from '../../stores/resonixStore';

export default function EffectsRack() {
  const { masterEffects, updateMasterEffects } = useResonixStore();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-teal-900/20 via-cyan-900/20 to-teal-900/20 border border-teal-500/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-teal-300 flex items-center gap-2">
          <span>🎛️</span>
          Master Effects
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 rounded-lg bg-teal-600/20 border border-teal-500/40 hover:bg-teal-600/30 text-teal-300 transition-all"
        >
          {expanded ? '▲ Collapse' : '▼ Expand'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-6">
          {/* Reverb */}
          <div className="p-4 bg-teal-900/20 border border-teal-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <label className="text-teal-300 font-medium">Reverb</label>
              <input
                type="checkbox"
                checked={masterEffects.reverb.enabled}
                onChange={(e) =>
                  updateMasterEffects({
                    reverb: { ...masterEffects.reverb, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded accent-teal-500"
              />
            </div>
            {masterEffects.reverb.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Decay</label>
                  <input
                    type="range"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={masterEffects.reverb.decay}
                    onChange={(e) =>
                      updateMasterEffects({
                        reverb: { ...masterEffects.reverb, decay: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {masterEffects.reverb.decay.toFixed(1)}s
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Wet</label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={masterEffects.reverb.wet}
                    onChange={(e) =>
                      updateMasterEffects({
                        reverb: { ...masterEffects.reverb, wet: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {Math.round(masterEffects.reverb.wet * 100)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delay */}
          <div className="p-4 bg-teal-900/20 border border-teal-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <label className="text-teal-300 font-medium">Delay</label>
              <input
                type="checkbox"
                checked={masterEffects.delay.enabled}
                onChange={(e) =>
                  updateMasterEffects({
                    delay: { ...masterEffects.delay, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded accent-teal-500"
              />
            </div>
            {masterEffects.delay.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Time</label>
                  <input
                    type="range"
                    min={0.01}
                    max={2}
                    step={0.01}
                    value={masterEffects.delay.time}
                    onChange={(e) =>
                      updateMasterEffects({
                        delay: { ...masterEffects.delay, time: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {masterEffects.delay.time.toFixed(2)}s
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Feedback</label>
                  <input
                    type="range"
                    min={0}
                    max={0.9}
                    step={0.01}
                    value={masterEffects.delay.feedback}
                    onChange={(e) =>
                      updateMasterEffects({
                        delay: { ...masterEffects.delay, feedback: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {Math.round(masterEffects.delay.feedback * 100)}%
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Wet</label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={masterEffects.delay.wet}
                    onChange={(e) =>
                      updateMasterEffects({
                        delay: { ...masterEffects.delay, wet: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {Math.round(masterEffects.delay.wet * 100)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EQ */}
          <div className="p-4 bg-teal-900/20 border border-teal-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <label className="text-teal-300 font-medium">3-Band EQ</label>
              <input
                type="checkbox"
                checked={masterEffects.eq.enabled}
                onChange={(e) =>
                  updateMasterEffects({
                    eq: { ...masterEffects.eq, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded accent-teal-500"
              />
            </div>
            {masterEffects.eq.enabled && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Low</label>
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={0.5}
                    value={masterEffects.eq.low}
                    onChange={(e) =>
                      updateMasterEffects({
                        eq: { ...masterEffects.eq, low: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {masterEffects.eq.low > 0 ? '+' : ''}
                    {masterEffects.eq.low.toFixed(1)} dB
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Mid</label>
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={0.5}
                    value={masterEffects.eq.mid}
                    onChange={(e) =>
                      updateMasterEffects({
                        eq: { ...masterEffects.eq, mid: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {masterEffects.eq.mid > 0 ? '+' : ''}
                    {masterEffects.eq.mid.toFixed(1)} dB
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">High</label>
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={0.5}
                    value={masterEffects.eq.high}
                    onChange={(e) =>
                      updateMasterEffects({
                        eq: { ...masterEffects.eq, high: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {masterEffects.eq.high > 0 ? '+' : ''}
                    {masterEffects.eq.high.toFixed(1)} dB
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Compressor */}
          <div className="p-4 bg-teal-900/20 border border-teal-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <label className="text-teal-300 font-medium">Compressor</label>
              <input
                type="checkbox"
                checked={masterEffects.compressor.enabled}
                onChange={(e) =>
                  updateMasterEffects({
                    compressor: { ...masterEffects.compressor, enabled: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded accent-teal-500"
              />
            </div>
            {masterEffects.compressor.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Threshold</label>
                  <input
                    type="range"
                    min={-60}
                    max={0}
                    step={1}
                    value={masterEffects.compressor.threshold}
                    onChange={(e) =>
                      updateMasterEffects({
                        compressor: {
                          ...masterEffects.compressor,
                          threshold: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {masterEffects.compressor.threshold} dB
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400 mb-1 block">Ratio</label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={masterEffects.compressor.ratio}
                    onChange={(e) =>
                      updateMasterEffects({
                        compressor: {
                          ...masterEffects.compressor,
                          ratio: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full h-2 rounded-lg appearance-none bg-teal-900/40 accent-teal-500"
                  />
                  <div className="text-xs text-teal-300 mt-1">
                    {masterEffects.compressor.ratio.toFixed(1)}:1
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
