'use client';

import { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import {
  CHAKRAS,
  CHAKRANOTE_MAPPINGS,
  type TuningSystem,
  type InstrumentType,
  type BackgroundType,
} from '@/lib/resonixChakraSynth';

export default function PreviewPage() {
  const [tuning, setTuning] = useState<TuningSystem>('scientific');
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [minutes, setMinutes] = useState(5);
  const [volumeSweep, setVolumeSweep] = useState(true);
  const [background, setBackground] = useState<BackgroundType>('rain');
  const [downloadFormat, setDownloadFormat] = useState<'wav' | 'mp3' | 'ogg'>('wav');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFrequencyTable, setShowFrequencyTable] = useState(false);
  const [currentChakra, setCurrentChakra] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [previewChakra, setPreviewChakra] = useState<number | null>(null);
  const [isPreMadePlaying, setIsPreMadePlaying] = useState(false);

  const synthRef = useRef<Tone.PolySynth | Tone.FMSynth | Tone.Oscillator | null>(null);
  const preMadeAudioRef = useRef<HTMLAudioElement | null>(null);
  const binauralLeftRef = useRef<Tone.Oscillator | null>(null);
  const binauralRightRef = useRef<Tone.Oscillator | null>(null);
  const backgroundNoiseRef = useRef<Tone.Noise | null>(null);
  const backgroundFilterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const chorusRef = useRef<Tone.Chorus | null>(null);
  const mainGainRef = useRef<Tone.Gain | null>(null);
  const backgroundGainRef = useRef<Tone.Gain | null>(null);
  const chimeRef = useRef<Tone.MetalSynth | null>(null);
  const previewSynthRef = useRef<Tone.Oscillator | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalMinutes = minutes * 7;

  const chakraData = CHAKRANOTE_MAPPINGS;

  useEffect(() => {
    // Initialize effects once
    if (!reverbRef.current) {
      reverbRef.current = new Tone.Reverb({ decay: 3.5, wet: 0.3 }).toDestination();
      reverbRef.current.generate();
    }
    if (!chorusRef.current) {
      chorusRef.current = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.7, wet: 0.4 }).toDestination();
    }
    if (!mainGainRef.current) {
      mainGainRef.current = new Tone.Gain(0.7).toDestination();
    }
    if (!backgroundGainRef.current) {
      backgroundGainRef.current = new Tone.Gain(0.15).toDestination();
    }
    if (!chimeRef.current) {
      chimeRef.current = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.5, release: 1 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
        volume: -18,
      }).toDestination();
    }

    return () => {
      cleanupAll();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const cleanupSynth = () => {
    if (synthRef.current) {
      synthRef.current.dispose();
      synthRef.current = null;
    }
    if (binauralLeftRef.current) {
      binauralLeftRef.current.dispose();
      binauralLeftRef.current = null;
    }
    if (binauralRightRef.current) {
      binauralRightRef.current.dispose();
      binauralRightRef.current = null;
    }
  };

  const cleanupBackground = () => {
    if (backgroundNoiseRef.current) {
      backgroundNoiseRef.current.stop();
      backgroundNoiseRef.current.dispose();
      backgroundNoiseRef.current = null;
    }
    if (backgroundFilterRef.current) {
      backgroundFilterRef.current.dispose();
      backgroundFilterRef.current = null;
    }
  };

  const cleanupAll = () => {
    cleanupSynth();
    cleanupBackground();
    if (reverbRef.current) {
      reverbRef.current.dispose();
      reverbRef.current = null;
    }
    if (chorusRef.current) {
      chorusRef.current.dispose();
      chorusRef.current = null;
    }
    if (mainGainRef.current) {
      mainGainRef.current.dispose();
      mainGainRef.current = null;
    }
    if (backgroundGainRef.current) {
      backgroundGainRef.current.dispose();
      backgroundGainRef.current = null;
    }
    if (chimeRef.current) {
      chimeRef.current.dispose();
      chimeRef.current = null;
    }
  };

  const setupBackground = () => {
    if (background === 'none') return;

    cleanupBackground();

    backgroundNoiseRef.current = new Tone.Noise('pink');
    backgroundFilterRef.current = new Tone.Filter({
      frequency: background === 'rain' ? 2000 : background === 'ocean' ? 400 : 800,
      type: 'lowpass',
      rolloff: -24,
    });

    const lfo = new Tone.LFO(background === 'ocean' ? 0.1 : 0.3, 0.2, 1);
    lfo.connect(backgroundFilterRef.current.frequency);
    lfo.start();

    backgroundNoiseRef.current.chain(backgroundFilterRef.current, backgroundGainRef.current!);
    backgroundNoiseRef.current.start();
  };

  const setupInstrument = (chakraIndex: number) => {
    cleanupSynth();

    const freq =
      tuning === 'scientific'
        ? CHAKRAS[chakraIndex].scientificFreq
        : CHAKRAS[chakraIndex].solfeggioFreq;

    if (instrument === 'piano') {
      const piano = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.5, sustain: 0.7, release: 2 },
        volume: -6,
      });
      piano.chain(reverbRef.current!, mainGainRef.current!);
      synthRef.current = piano;

      const notes = [freq, freq * 1.25, freq * 1.5, freq * 2];
      const now = Tone.now();
      const duration = minutes * 60;
      notes.forEach((note, i) => {
        piano.triggerAttackRelease(note, duration / 4, now + i * (duration / 4));
      });
    } else if (instrument === 'bowls') {
      const bowls = new Tone.FMSynth({
        harmonicity: 1.4,
        modulationIndex: 12,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.1, decay: 2, sustain: 0.8, release: 10 },
        modulation: { type: 'sine' },
        modulationEnvelope: { attack: 0.5, decay: 1, sustain: 0.6, release: 8 },
        volume: -8,
      });
      bowls.chain(chorusRef.current!, reverbRef.current!, mainGainRef.current!);
      synthRef.current = bowls;
      bowls.triggerAttackRelease(freq, minutes * 60);
    } else if (instrument === 'sine') {
      const osc = new Tone.Oscillator(freq, 'sine').start();
      osc.connect(mainGainRef.current!);
      synthRef.current = osc;
    } else if (instrument === 'square') {
      const osc = new Tone.Oscillator(freq, 'square').start();
      osc.connect(mainGainRef.current!);
      synthRef.current = osc;
    } else if (instrument === 'binaural') {
      const carrier = 150 + freq / 10;
      const beatFreq = 7;
      const panLeft = new Tone.Panner(-1).toDestination();
      const panRight = new Tone.Panner(1).toDestination();

      binauralLeftRef.current = new Tone.Oscillator(carrier - beatFreq / 2, 'sine').start();
      binauralRightRef.current = new Tone.Oscillator(carrier + beatFreq / 2, 'sine').start();

      binauralLeftRef.current.chain(panLeft, mainGainRef.current!);
      binauralRightRef.current.chain(panRight, mainGainRef.current!);
    }

    if (volumeSweep && mainGainRef.current) {
      const volume = -12 + (chakraIndex / 6) * 12;
      mainGainRef.current.gain.setValueAtTime(Tone.dbToGain(volume), Tone.now());
    }
  };

  const handlePlay = async () => {
    await Tone.start();
    setIsPlaying(true);
    setCurrentChakra(0);
    setTimeElapsed(0);

    setupBackground();
    setupInstrument(0);

    const chakraDuration = minutes * 60;
    let elapsed = 0;

    intervalRef.current = setInterval(() => {
      elapsed += 1;
      setTimeElapsed(elapsed);

      const currentChakraIndex = Math.floor(elapsed / chakraDuration);

      if (currentChakraIndex >= 7) {
        handleStop();
        return;
      }

      if (currentChakraIndex !== Math.floor((elapsed - 1) / chakraDuration)) {
        setCurrentChakra(currentChakraIndex);

        if (chimeRef.current) {
          chimeRef.current.triggerAttackRelease(1200, 0.1);
        }

        if (mainGainRef.current) {
          const currentVolume = volumeSweep ? -12 + (currentChakraIndex / 6) * 12 : 0;
          mainGainRef.current.gain.linearRampToValueAtTime(
            Tone.dbToGain(currentVolume - 6),
            Tone.now() + 6
          );
          mainGainRef.current.gain.linearRampToValueAtTime(
            Tone.dbToGain(currentVolume),
            Tone.now() + 12
          );
        }

        setupInstrument(currentChakraIndex);
      }
    }, 1000);
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    cleanupSynth();
    cleanupBackground();
    setCurrentChakra(0);
    setTimeElapsed(0);
  };

  const handlePreview = async (chakraIndex: number) => {
    await Tone.start();

    if (previewSynthRef.current) {
      previewSynthRef.current.stop();
      previewSynthRef.current.dispose();
    }

    const freq =
      tuning === 'scientific'
        ? CHAKRAS[chakraIndex].scientificFreq
        : CHAKRAS[chakraIndex].solfeggioFreq;

    const osc = new Tone.Oscillator(freq, 'sine').toDestination();
    osc.volume.value = -12;
    osc.start();

    previewSynthRef.current = osc;
    setPreviewChakra(chakraIndex);

    setTimeout(() => {
      osc.stop();
      osc.dispose();
      setPreviewChakra(null);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalMinutes > 0 ? (timeElapsed / (totalMinutes * 60)) * 100 : 0;

  const handlePreMadePlay = () => {
    if (!preMadeAudioRef.current) {
      preMadeAudioRef.current = new Audio('/audio/7-minute-chakra-activation.wav');
      preMadeAudioRef.current.addEventListener('ended', () => {
        setIsPreMadePlaying(false);
      });
    }

    if (isPreMadePlaying) {
      preMadeAudioRef.current.pause();
      setIsPreMadePlaying(false);
    } else {
      preMadeAudioRef.current.play();
      setIsPreMadePlaying(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '7-Minute Chakra Healing - MedBed™',
          text: 'Check out this 7-minute chakra healing journey with scientific tuning and grand piano',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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
          {/* Product Showcase */}
          <section className="my-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[var(--tesla-dark)] border border-[var(--border)] rounded-lg p-10">
              {/* Product Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                <img
                  src="/medbed-pad.png"
                  alt="Resonix MedBed Pad"
                  className="w-full h-full object-contain p-8"
                />
              </div>

              {/* Product Info */}
              <div>
                <h3 className="text-3xl font-semibold mb-3 tracking-tight">Resonix MedBed Pad</h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  The world&apos;s first fully app-controlled biophoton + PEMF healing mat
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold">$650</span>
                    <span className="bg-[var(--tesla-red)] text-white px-3 py-1 rounded text-sm font-semibold">
                      Pre-order: $499
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">First 500 units only</p>
                </div>

                <ul className="space-y-3 mb-8 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>8 pure copper PEMF coils (1–30 Hz)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>1,024× biophoton amplification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>Full 5G/EMF shielding layer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">✓</span>
                    <span>30+ nights per charge</span>
                  </li>
                </ul>

                <div className="flex gap-3">
                  <a
                    href="/product"
                    className="flex-1 px-6 py-3 bg-[var(--tesla-red)] text-white rounded font-semibold uppercase text-sm tracking-wide transition-all hover:bg-[#c01d23] hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-px text-center"
                  >
                    View Details
                  </a>
                  <button className="px-6 py-3 bg-transparent text-white border-2 border-white rounded font-semibold uppercase text-sm tracking-wide transition-all hover:bg-white hover:text-black">
                    Pre-order
                  </button>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mt-4">
                  Ships Q1 2026 • 90-night guarantee • 3-year warranty
                </p>
              </div>
            </div>
          </section>

          {/* Config Panel */}
          <div className="bg-[var(--tesla-dark)] rounded-lg my-12 overflow-hidden border border-[var(--border)] animate-fade-in-up">
            {/* Preset Banner */}
            <div className="relative bg-gradient-to-br from-[var(--tesla-gray)] to-[var(--tesla-dark)] p-10 border-b border-[var(--border)] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--chakra-root)] via-[var(--chakra-solar)] via-[var(--chakra-heart)] via-[var(--chakra-throat)] to-[var(--chakra-crown)]" />
              <h2 className="text-3xl font-semibold mb-3 tracking-tight">
                ✨ ChakraNote Exact Frequency
              </h2>
              <p className="text-[var(--text-secondary)] font-medium mb-2 tracking-tight">
                Or listen on your phone or online
              </p>
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
                          <td className="py-3 px-4 font-mono text-[var(--text-primary)]">{row.frequency} Hz</td>
                          <td className="py-3 px-4 text-[var(--text-secondary)] text-xs">{row.sensation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Chakra Preview Buttons */}
            <div className="p-6 bg-[var(--tesla-dark)] border-b border-[var(--border)]">
              <p className="text-center text-sm text-[var(--text-secondary)] mb-4 uppercase tracking-wider">
                Click to Play Sound
              </p>
              <div className="grid grid-cols-7 gap-3">
              {chakraData.map((data, i) => (
                <button
                  key={data.chakra}
                  disabled={isPlaying}
                  className="relative p-4 rounded border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: CHAKRAS[i].color,
                    backgroundColor: CHAKRAS[i].color + '22',
                  }}
                  onClick={() => handlePreview(i)}
                >
                  <div className="text-xs font-bold mb-1 text-white">{data.chakra}</div>
                  <div className="text-xs opacity-75 text-white font-mono">{data.frequency} Hz</div>
                  {previewChakra === i && (
                    <div
                      className="absolute inset-0 rounded opacity-50 animate-pulse"
                      style={{ backgroundColor: CHAKRAS[i].color }}
                    />
                  )}
                </button>
              ))}
              </div>
            </div>

            {/* Controls Section */}
            <div className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Tuning System */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Tuning System
                  </label>
                  <select
                    value={tuning}
                    onChange={(e) => setTuning(e.target.value as TuningSystem)}
                    disabled={isPlaying}
                    className="w-full px-5 py-4 bg-[var(--tesla-gray)] border-2 border-[var(--border)] rounded text-white font-medium transition-all hover:border-[var(--text-muted)] hover:bg-[var(--tesla-light-gray)] focus:border-white focus:bg-[var(--tesla-light-gray)] focus:outline-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="scientific">Scientific (256-480 Hz)</option>
                    <option value="solfeggio">Solfeggio (396-963 Hz)</option>
                  </select>
                </div>

                {/* Instrument */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Instrument / Sound
                  </label>
                  <select
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value as InstrumentType)}
                    disabled={isPlaying}
                    className="w-full px-5 py-4 bg-[var(--tesla-gray)] border-2 border-[var(--border)] rounded text-white font-medium transition-all hover:border-[var(--text-muted)] hover:bg-[var(--tesla-light-gray)] focus:border-white focus:bg-[var(--tesla-light-gray)] focus:outline-none cursor-pointer disabled:opacity-50"
                  >
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
                  <select
                    value={background}
                    onChange={(e) => setBackground(e.target.value as BackgroundType)}
                    disabled={isPlaying}
                    className="w-full px-5 py-4 bg-[var(--tesla-gray)] border-2 border-[var(--border)] rounded text-white font-medium transition-all hover:border-[var(--text-muted)] hover:bg-[var(--tesla-light-gray)] focus:border-white focus:bg-[var(--tesla-light-gray)] focus:outline-none cursor-pointer disabled:opacity-50"
                  >
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
                  <select
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value as 'wav' | 'mp3' | 'ogg')}
                    disabled={isPlaying || isDownloading}
                    className="w-full px-5 py-4 bg-[var(--tesla-gray)] border-2 border-[var(--border)] rounded text-white font-medium transition-all hover:border-[var(--text-muted)] hover:bg-[var(--tesla-light-gray)] focus:border-white focus:bg-[var(--tesla-light-gray)] focus:outline-none cursor-pointer disabled:opacity-50"
                  >
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
                  disabled={isPlaying}
                  className="w-full h-1 bg-[var(--border)] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                    [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-4 py-5">
                <input
                  type="checkbox"
                  id="volumeSweep"
                  checked={volumeSweep}
                  onChange={(e) => setVolumeSweep(e.target.checked)}
                  disabled={isPlaying}
                  className="w-6 h-6 cursor-pointer accent-white disabled:opacity-50"
                />
                <label htmlFor="volumeSweep" className="text-base font-medium cursor-pointer">
                  Volume Sweep: Quiet Root → Loud Crown
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 my-10">
                <button
                  onClick={isPlaying ? handleStop : handlePlay}
                  disabled={isDownloading}
                  className={`flex-1 px-8 py-5 font-semibold uppercase text-sm tracking-wide rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isPlaying
                      ? 'bg-white text-black hover:bg-[var(--tesla-off-white)] hover:shadow-lg hover:-translate-y-px active:translate-y-0'
                      : 'bg-[var(--tesla-red)] text-white hover:bg-[#c01d23] hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-px active:translate-y-0'
                  }`}
                >
                  {isPlaying ? '⏸ Stop Journey' : '▶ Begin Chakra Journey'}
                </button>
                <button
                  onClick={() => {
                    setIsDownloading(true);
                    setTimeout(() => setIsDownloading(false), 2000);
                  }}
                  disabled={isPlaying || isDownloading}
                  className="flex-1 px-8 py-5 font-semibold uppercase text-sm tracking-wide rounded transition-all bg-[var(--tesla-red)] text-white hover:bg-[#c01d23] hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? 'Preparing...' : '⬇ Download Song'}
                </button>
              </div>

              {/* Progress */}
              {isPlaying && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full animate-pulse"
                      style={{ backgroundColor: CHAKRAS[currentChakra].color }}
                    />
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: CHAKRAS[currentChakra].color }}>
                        {CHAKRAS[currentChakra].name}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        {tuning === 'scientific'
                          ? CHAKRAS[currentChakra].scientificFreq
                          : CHAKRAS[currentChakra].solfeggioFreq}{' '}
                        Hz • {CHAKRANOTE_MAPPINGS[currentChakra].note}
                      </div>
                    </div>
                    <div
                      className="w-4 h-4 rounded-full animate-pulse"
                      style={{ backgroundColor: CHAKRAS[currentChakra].color }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-[var(--text-secondary)] px-2">
                    <span>{formatTime(timeElapsed)}</span>
                    <span>Chakra {currentChakra + 1} of 7</span>
                    <span>{formatTime(totalMinutes * 60)}</span>
                  </div>

                  <div className="w-full h-3 bg-[var(--tesla-gray)] rounded-full overflow-hidden relative">
                    <div
                      className="h-full transition-all duration-1000 ease-linear"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(to right, ${CHAKRAS[0].color}, ${CHAKRAS[currentChakra].color})`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Info Bar */}
              {!isPlaying && (
                <div className="bg-[var(--tesla-gray)] p-6 rounded text-center mt-8">
                  <p className="text-white font-medium mb-1">
                    ✨ Real-time browser playback • Smooth crossfades • Soft chime transitions
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {totalMinutes} minute journey through all 7 chakras
                  </p>
                </div>
              )}
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
              <div className="flex flex-wrap gap-3 mb-6">
                {['Meditation', 'Healing', 'ChakraNote', 'Piano', 'Rain'].map((tag) => (
                  <span
                    key={tag}
                    className="bg-[var(--tesla-gray)] px-4 py-2 rounded text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider border border-[var(--border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Track Actions */}
              <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  onClick={handlePreMadePlay}
                  className="flex-1 px-6 py-3 bg-white text-black rounded font-semibold uppercase text-sm tracking-wide transition-all hover:bg-[var(--tesla-off-white)] hover:shadow-lg hover:-translate-y-px"
                >
                  {isPreMadePlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-transparent text-white border-2 border-white rounded font-semibold uppercase text-sm tracking-wide transition-all hover:bg-white hover:text-black"
                >
                  ↗ Share
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
