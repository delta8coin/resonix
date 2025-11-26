'use client';

import { useState } from 'react';

export default function PreviewPage() {
  const [minutes, setMinutes] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFrequencyTable, setShowFrequencyTable] = useState(false);

  const totalMinutes = minutes * 7;

  const chakraData = [
    { chakra: 'Root', note: 'C4', frequency: '256 Hz', sensation: 'Grounding, stability, physical presence' },
    { chakra: 'Sacral', note: 'D4', frequency: '288 Hz', sensation: 'Creativity, pleasure, emotional flow' },
    { chakra: 'Solar Plexus', note: 'E4', frequency: '320 Hz', sensation: 'Personal power, confidence, willpower' },
    { chakra: 'Heart', note: 'F4', frequency: '341.3 Hz', sensation: 'Love, compassion, connection' },
    { chakra: 'Throat', note: 'G4', frequency: '384 Hz', sensation: 'Expression, truth, communication' },
    { chakra: 'Third Eye', note: 'A4', frequency: '426.7 Hz', sensation: 'Intuition, insight, inner vision' },
    { chakra: 'Crown', note: 'B4', frequency: '480 Hz', sensation: 'Unity, enlightenment, divine connection' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx global>{`
        :root {
          --tesla-black: #000000;
          --tesla-dark: #0a0a0a;
          --tesla-gray: #1a1a1a;
          --tesla-light-gray: #2a2a2a;
          --tesla-white: #ffffff;
          --tesla-off-white: #f4f4f4;
          --tesla-red: #e82127;
          --text-primary: #ffffff;
          --text-secondary: #999999;
          --text-muted: #666666;
          --border: #2a2a2a;

          --chakra-root: #e82127;
          --chakra-sacral: #ff6b35;
          --chakra-solar: #ffd23f;
          --chakra-heart: #06ffa5;
          --chakra-throat: #3e6ae1;
          --chakra-third-eye: #8b5cf6;
          --chakra-crown: #d946ef;
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-8">
        {/* Header */}
        <header className="pt-12 pb-6 text-center animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4">
            Turn Any Bed Into A MedBed™
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Synthesize personalized 7-chakra frequency Healing journeys
          </p>
        </header>

        <main>
          {/* Config Panel */}
          <div className="bg-[var(--tesla-dark)] rounded-lg my-12 overflow-hidden border border-[var(--border)] animate-fade-in-up">
            {/* Preset Banner */}
            <div className="relative bg-gradient-to-br from-[var(--tesla-gray)] to-[var(--tesla-dark)] p-10 border-b border-[var(--border)] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--chakra-root)] via-[var(--chakra-solar)] via-[var(--chakra-heart)] via-[var(--chakra-throat)] to-[var(--chakra-crown)]" />
              <h2 className="text-3xl font-semibold mb-3 tracking-tight">
                ✨ ChakraNote Exact Frequency
              </h2>
              <p className="text-[var(--text-secondary)] font-medium mb-2 tracking-tight">
                Scientific Tuning (C4–B4 Scale) • 256–480 Hz
              </p>
              <p className="text-[var(--text-muted)] max-w-[800px] mb-4">
                Precision-mapped chakra frequencies to musical notes • Grand piano with gentle rain ambience • Best for meditation & healing
              </p>
              <button
                onClick={() => setShowFrequencyTable(!showFrequencyTable)}
                className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors underline"
              >
                {showFrequencyTable ? '✕ Hide' : '→ View'} Exact Frequency Mapping
              </button>
            </div>

            {/* Frequency Table */}
            {showFrequencyTable && (
              <div className="bg-black/60 p-8 border-b border-[var(--border)]">
                <h3 className="text-xl font-semibold mb-4 text-[var(--text-secondary)]">Exact Frequency Mapping</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Chakra</th>
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Note</th>
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Frequency</th>
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)] uppercase text-xs tracking-wider">Sensation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chakraData.map((row, i) => (
                        <tr key={i} className="border-b border-[var(--border)] hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-medium text-white">{row.chakra}</td>
                          <td className="py-3 px-4 font-mono font-bold text-[var(--text-primary)]">{row.note}</td>
                          <td className="py-3 px-4 font-mono text-[var(--text-primary)]">{row.frequency}</td>
                          <td className="py-3 px-4 text-[var(--text-secondary)] text-xs">{row.sensation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Chakra Preview Buttons */}
            <div className="grid grid-cols-7 gap-3 p-6 bg-[var(--tesla-dark)] border-b border-[var(--border)]">
              {chakraData.map((data, i) => (
                <button
                  key={data.chakra}
                  className="relative p-4 rounded border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  style={{
                    borderColor: [
                      'var(--chakra-root)',
                      'var(--chakra-sacral)',
                      'var(--chakra-solar)',
                      'var(--chakra-heart)',
                      'var(--chakra-throat)',
                      'var(--chakra-third-eye)',
                      'var(--chakra-crown)',
                    ][i],
                    backgroundColor: [
                      'var(--chakra-root)',
                      'var(--chakra-sacral)',
                      'var(--chakra-solar)',
                      'var(--chakra-heart)',
                      'var(--chakra-throat)',
                      'var(--chakra-third-eye)',
                      'var(--chakra-crown)',
                    ][i] + '22',
                  }}
                  onClick={() => console.log(`Playing ${data.chakra} - ${data.frequency}`)}
                >
                  <div className="text-xs font-bold mb-1 text-white">{data.chakra}</div>
                  <div className="text-xs opacity-75 text-white font-mono">{data.frequency}</div>
                  <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-50 transition-opacity"
                    style={{
                      backgroundColor: [
                        'var(--chakra-root)',
                        'var(--chakra-sacral)',
                        'var(--chakra-solar)',
                        'var(--chakra-heart)',
                        'var(--chakra-throat)',
                        'var(--chakra-third-eye)',
                        'var(--chakra-crown)',
                      ][i],
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Controls Section */}
            <div className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Tuning System */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Tuning System
                  </label>
                  <select className="w-full px-5 py-4 bg-[var(--tesla-gray)] border-2 border-[var(--border)] rounded text-white font-medium transition-all hover:border-[var(--text-muted)] hover:bg-[var(--tesla-light-gray)] focus:border-white focus:bg-[var(--tesla-light-gray)] focus:outline-none cursor-pointer">
                    <option value="scientific">Scientific (256-480 Hz)</option>
                    <option value="solfeggio">Solfeggio (396-963 Hz)</option>
                  </select>
                </div>

                {/* Instrument */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Instrument / Sound
                  </label>
                  <select className="w-full px-5 py-4 bg-[var(--tesla-gray)] border-2 border-[var(--border)] rounded text-white font-medium transition-all hover:border-[var(--text-muted)] hover:bg-[var(--tesla-light-gray)] focus:border-white focus:bg-[var(--tesla-light-gray)] focus:outline-none cursor-pointer">
                    <option value="piano">Grand Piano</option>
                    <option value="bowls">Tibetan Singing Bowls</option>
                    <option value="sine">Pure Sine Wave</option>
                    <option value="square">Square Wave</option>
                    <option value="binaural">Binaural Beats</option>
                  </select>
                </div>

                {/* Background Ambience */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Background Ambience
                  </label>
                  <select className="w-full px-5 py-4 bg-[var(--tesla-gray)] border-2 border-[var(--border)] rounded text-white font-medium transition-all hover:border-[var(--text-muted)] hover:bg-[var(--tesla-light-gray)] focus:border-white focus:bg-[var(--tesla-light-gray)] focus:outline-none cursor-pointer">
                    <option value="rain">Gentle Rain</option>
                    <option value="none">None</option>
                    <option value="ocean">Ocean Waves</option>
                    <option value="forest">Forest Sounds</option>
                  </select>
                </div>

                {/* Download Format */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Download Format
                  </label>
                  <select className="w-full px-5 py-4 bg-[var(--tesla-gray)] border-2 border-[var(--border)] rounded text-white font-medium transition-all hover:border-[var(--text-muted)] hover:bg-[var(--tesla-light-gray)] focus:border-white focus:bg-[var(--tesla-light-gray)] focus:outline-none cursor-pointer">
                    <option value="wav">WAV (Highest Quality)</option>
                    <option value="mp3">MP3 (Compressed)</option>
                    <option value="ogg">OGG (Open Source)</option>
                  </select>
                </div>
              </div>

              {/* Slider */}
              <div className="my-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                    Minutes per Chakra
                  </label>
                  <span className="text-2xl font-semibold tracking-tight">{minutes}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-full h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-4 py-5">
                <input
                  type="checkbox"
                  id="volumeSweep"
                  className="w-6 h-6 cursor-pointer accent-white"
                />
                <label htmlFor="volumeSweep" className="text-base font-medium cursor-pointer">
                  Volume Sweep: Quiet Root → Loud Crown
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 my-10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 px-8 py-5 font-semibold uppercase text-sm tracking-wide rounded transition-all ${
                    isPlaying
                      ? 'bg-[var(--tesla-red)] text-white hover:bg-[#c01d23]'
                      : 'bg-white text-black hover:bg-[var(--tesla-off-white)] hover:shadow-lg hover:-translate-y-px active:translate-y-0'
                  }`}
                >
                  {isPlaying ? '⏸ Stop Journey' : '▶ Begin Chakra Journey'}
                </button>
                <button
                  onClick={() => {
                    setIsDownloading(true);
                    setTimeout(() => setIsDownloading(false), 2000);
                  }}
                  className="flex-1 px-8 py-5 font-semibold uppercase text-sm tracking-wide rounded transition-all bg-transparent text-white border-2 border-white hover:bg-white hover:text-black"
                >
                  {isDownloading ? 'Preparing...' : '⬇ Download Song'}
                </button>
              </div>

              {/* Info Bar */}
              <div className="bg-[var(--tesla-gray)] p-6 rounded text-center mt-8">
                <p className="text-white font-medium mb-1">
                  ✨ Real-time browser playback • Smooth crossfades • Soft chime transitions
                </p>
                <p className="text-[var(--text-secondary)] text-sm">
                  {totalMinutes} minute journey through all 7 chakras
                </p>
              </div>
            </div>
          </div>

          {/* Audio Library */}
          <section className="my-16">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-semibold mb-2 tracking-tight">
                Pre-Made Healing Journeys
              </h2>
              <p className="text-lg text-[var(--text-secondary)]">
                Ready-to-play chakra activation audio • Perfect for immediate meditation
              </p>
            </div>

            <div className="bg-[var(--tesla-dark)] border border-[var(--border)] rounded-lg p-10 transition-all hover:border-[var(--text-muted)] hover:-translate-y-0.5 hover:shadow-2xl">
              <div className="flex justify-between items-start gap-4 mb-5 flex-wrap">
                <h3 className="text-3xl font-semibold tracking-tight">7-Minute Chakra Healing</h3>
                <span className="bg-[var(--tesla-gray)] px-5 py-2 rounded font-semibold text-lg border border-[var(--border)] whitespace-nowrap">
                  7:00
                </span>
              </div>
              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                Complete 7-chakra journey using scientific tuning (C4-B4 scale, 256-480 Hz) with grand piano. 1 minute per chakra with smooth crossfades, gentle chime transitions, and rain ambience.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Meditation', 'Healing', 'ChakraNote', 'Piano', 'Rain'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[var(--tesla-gray)] px-4 py-2 rounded text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider border border-[var(--border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
