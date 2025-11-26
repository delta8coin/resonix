import * as Tone from 'tone';

export type TuningSystem = 'scientific' | 'solfeggio';
export type InstrumentType = 'piano' | 'bowls' | 'sine' | 'square' | 'binaural';
export type BackgroundType = 'none' | 'rain' | 'ocean' | 'forest';

export interface ChakraConfig {
  name: string;
  scientificFreq: number;
  solfeggioFreq: number;
  color: string;
}

export const CHAKRAS: ChakraConfig[] = [
  { name: 'Root', scientificFreq: 256, solfeggioFreq: 396, color: '#DC2626' },
  { name: 'Sacral', scientificFreq: 288, solfeggioFreq: 417, color: '#EA580C' },
  { name: 'Solar Plexus', scientificFreq: 320, solfeggioFreq: 528, color: '#EAB308' },
  { name: 'Heart', scientificFreq: 341.3, solfeggioFreq: 639, color: '#22C55E' },
  { name: 'Throat', scientificFreq: 384, solfeggioFreq: 741, color: '#3B82F6' },
  { name: 'Third Eye', scientificFreq: 426.7, solfeggioFreq: 852, color: '#8B5CF6' },
  { name: 'Crown', scientificFreq: 480, solfeggioFreq: 963, color: '#A855F7' },
];

export interface SynthOptions {
  tuning: TuningSystem;
  instrument: InstrumentType;
  minutesPerChakra: number;
  volumeSweep: boolean;
  background: BackgroundType;
  binauralBeatFreq?: number;
  binauralCarrier?: number;
  isChakraNoteExact?: boolean;
}

export interface ChakraNoteMapping {
  chakra: string;
  note: string;
  frequency: number;
  sensation: string;
}

export const CHAKRANOTE_MAPPINGS: ChakraNoteMapping[] = [
  { chakra: 'Root', note: 'C4', frequency: 256, sensation: 'Grounding, stability, physical presence' },
  { chakra: 'Sacral', note: 'D4', frequency: 288, sensation: 'Creativity, pleasure, emotional flow' },
  { chakra: 'Solar Plexus', note: 'E4', frequency: 320, sensation: 'Personal power, confidence, willpower' },
  { chakra: 'Heart', note: 'F4', frequency: 341.3, sensation: 'Love, compassion, connection' },
  { chakra: 'Throat', note: 'G4', frequency: 384, sensation: 'Expression, truth, communication' },
  { chakra: 'Third Eye', note: 'A4', frequency: 426.7, sensation: 'Intuition, insight, inner vision' },
  { chakra: 'Crown', note: 'B4', frequency: 480, sensation: 'Unity, enlightenment, divine connection' },
];

export class ResonixChakraSynth {
  private reverb: Tone.Reverb;
  private chorus: Tone.Chorus;
  private mainGain: Tone.Gain;
  private backgroundGain: Tone.Gain;
  private synth: Tone.PolySynth | Tone.FMSynth | Tone.Oscillator | null = null;
  private binauralLeft: Tone.Oscillator | null = null;
  private binauralRight: Tone.Oscillator | null = null;
  private backgroundNoise: Tone.Noise | null = null;
  private backgroundFilter: Tone.Filter | null = null;

  constructor() {
    this.reverb = new Tone.Reverb({ decay: 3.5, wet: 0.3 });
    this.chorus = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.7, wet: 0.4 });
    this.mainGain = new Tone.Gain(0.7);
    this.backgroundGain = new Tone.Gain(0.15);

    this.reverb.generate();
  }

  private createPianoSynth(): Tone.PolySynth {
    return new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.7,
        release: 2,
      },
      volume: -6,
    });
  }

  private createBowlsSynth(): Tone.FMSynth {
    return new Tone.FMSynth({
      harmonicity: 1.4,
      modulationIndex: 12,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.1,
        decay: 2,
        sustain: 0.8,
        release: 10,
      },
      modulation: { type: 'sine' },
      modulationEnvelope: {
        attack: 0.5,
        decay: 1,
        sustain: 0.6,
        release: 8,
      },
      volume: -8,
    });
  }

  private createChimeSynth(): Tone.MetalSynth {
    return new Tone.MetalSynth({
      envelope: {
        attack: 0.001,
        decay: 0.5,
        release: 1,
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
      volume: -18,
    });
  }

  private setupInstrument(type: InstrumentType, freq: number): void {
    this.cleanup();

    if (type === 'piano') {
      this.synth = this.createPianoSynth();
      this.synth.chain(this.reverb, this.mainGain, Tone.Destination);
    } else if (type === 'bowls') {
      this.synth = this.createBowlsSynth();
      this.synth.chain(this.chorus, this.reverb, this.mainGain, Tone.Destination);
    } else if (type === 'sine') {
      this.synth = new Tone.Oscillator(freq, 'sine').start();
      this.synth.chain(this.mainGain, Tone.Destination);
    } else if (type === 'square') {
      this.synth = new Tone.Oscillator(freq, 'square').start();
      this.synth.chain(this.mainGain, Tone.Destination);
    } else if (type === 'binaural') {
      // Handled separately
    }
  }

  private setupBinaural(carrier: number, beatFreq: number): void {
    this.cleanup();

    const panLeft = new Tone.Panner(-1);
    const panRight = new Tone.Panner(1);

    this.binauralLeft = new Tone.Oscillator(carrier - beatFreq / 2, 'sine').start();
    this.binauralRight = new Tone.Oscillator(carrier + beatFreq / 2, 'sine').start();

    this.binauralLeft.chain(panLeft, this.mainGain, Tone.Destination);
    this.binauralRight.chain(panRight, this.mainGain, Tone.Destination);
  }

  private setupBackground(type: BackgroundType): void {
    if (type === 'none') return;

    this.backgroundNoise = new Tone.Noise('pink');
    this.backgroundFilter = new Tone.Filter({
      frequency: type === 'rain' ? 2000 : type === 'ocean' ? 400 : 800,
      type: 'lowpass',
      rolloff: -24,
    });

    const lfo = new Tone.LFO(type === 'ocean' ? 0.1 : 0.3, 0.2, 1);
    lfo.connect(this.backgroundFilter.frequency);
    lfo.start();

    this.backgroundNoise.chain(this.backgroundFilter, this.backgroundGain, Tone.Destination);
    this.backgroundNoise.start();
  }

  private playChakraTone(freq: number, instrument: InstrumentType, duration: number, startTime: number): void {
    if (instrument === 'piano') {
      const synth = this.synth as Tone.PolySynth;
      // Arpeggio pattern for piano
      const notes = [freq, freq * 1.25, freq * 1.5, freq * 2];
      notes.forEach((note, i) => {
        synth.triggerAttackRelease(note, duration / 4, startTime + i * (duration / 4));
      });
    } else if (instrument === 'bowls') {
      const synth = this.synth as Tone.FMSynth;
      synth.triggerAttackRelease(freq, duration, startTime);
    } else if (instrument === 'sine' || instrument === 'square') {
      const osc = this.synth as Tone.Oscillator;
      osc.frequency.setValueAtTime(freq, startTime);
    }
    // Binaural updates carrier based on chakra freq
  }

  private triggerChime(time: number): void {
    const chime = this.createChimeSynth();
    chime.toDestination();
    chime.triggerAttackRelease(1200, 0.1, time);
    chime.dispose();
  }

  async renderOffline(options: SynthOptions, onProgress?: (progress: number) => void): Promise<AudioBuffer> {
    const totalDuration = options.minutesPerChakra * 7 * 60;
    const chakraDuration = options.minutesPerChakra * 60;
    const crossfadeDuration = 12;

    const toneBuffer = await Tone.Offline(
      async ({ transport }) => {
        await Tone.start();

        // Setup background
        this.setupBackground(options.background);

        let currentTime = 0;

        for (let i = 0; i < CHAKRAS.length; i++) {
          const chakra = CHAKRAS[i];
          const freq =
            options.tuning === 'scientific' ? chakra.scientificFreq : chakra.solfeggioFreq;

          // Volume sweep
          let volume = options.volumeSweep ? -12 + (i / 6) * 12 : 0;

          // Setup instrument for this chakra
          if (options.instrument === 'binaural') {
            const carrier = options.binauralCarrier || 150;
            const beatFreq = options.binauralBeatFreq || 7;
            this.setupBinaural(carrier + freq / 10, beatFreq);
          } else {
            this.setupInstrument(options.instrument, freq);
            this.playChakraTone(freq, options.instrument, chakraDuration, currentTime);
          }

          // Set volume
          this.mainGain.gain.setValueAtTime(Tone.dbToGain(volume), currentTime);

          // Crossfade
          if (i < CHAKRAS.length - 1) {
            const fadeStart = currentTime + chakraDuration - crossfadeDuration;
            this.mainGain.gain.linearRampToValueAtTime(
              Tone.dbToGain(volume - 6),
              fadeStart + crossfadeDuration / 2
            );

            // Chime at transition
            this.triggerChime(fadeStart + crossfadeDuration / 2);
          }

          currentTime += chakraDuration;

          // Progress callback
          if (onProgress) {
            onProgress(((i + 1) / CHAKRAS.length) * 100);
          }
        }

        // Fade out at end
        this.mainGain.gain.linearRampToValueAtTime(0, currentTime);

        transport.start();
      },
      totalDuration,
      2,
      44100
    );

    return toneBuffer.get() as AudioBuffer;
  }

  cleanup(): void {
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    if (this.binauralLeft) {
      this.binauralLeft.dispose();
      this.binauralLeft = null;
    }
    if (this.binauralRight) {
      this.binauralRight.dispose();
      this.binauralRight = null;
    }
    if (this.backgroundNoise) {
      this.backgroundNoise.dispose();
      this.backgroundNoise = null;
    }
    if (this.backgroundFilter) {
      this.backgroundFilter.dispose();
      this.backgroundFilter = null;
    }
  }

  dispose(): void {
    this.cleanup();
    this.reverb.dispose();
    this.chorus.dispose();
    this.mainGain.dispose();
    this.backgroundGain.dispose();
  }
}

export function generateFilename(options: SynthOptions): string {
  const tuning = options.tuning;
  const instrument = options.instrument;
  const minutes = options.minutesPerChakra;

  if (options.isChakraNoteExact) {
    return `resonix-chakranote-exact-${instrument}-${minutes}min.wav`;
  }

  return `resonix-chakra-activation-${tuning}-${instrument}-${minutes}min.wav`;
}
