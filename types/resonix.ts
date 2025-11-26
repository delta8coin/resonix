// Resonix Type Definitions

export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle';
export type NoiseType = 'white' | 'pink' | 'brown' | 'violet';
export type TrackType =
  | 'oscillator'
  | 'noise'
  | 'binaural'
  | 'isochronic'
  | 'audio'
  | 'modulator';

export type VisualizerMode = 'waveform' | 'spectrogram';

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  enabled: boolean;
  solo: boolean;
  mute: boolean;
  volume: number; // 0-1
  pan: number; // -1 to 1

  // Oscillator specific
  waveform?: WaveformType;
  frequency?: number;

  // Noise specific
  noiseType?: NoiseType;

  // Binaural specific
  baseFrequency?: number;
  leftOffset?: number;
  rightOffset?: number;

  // Isochronic specific
  carrierFrequency?: number;
  pulseFrequency?: number;

  // Audio file specific
  audioBuffer?: AudioBuffer;
  audioUrl?: string;

  // Modulation
  modulationEnabled?: boolean;
  modulationType?: 'AM' | 'FM';
  modulationRate?: number;
  modulationDepth?: number;

  // Filter
  filterEnabled?: boolean;
  filterType?: 'lowpass' | 'highpass' | 'bandpass';
  filterFrequency?: number;
  filterQ?: number;
}

export interface MasterEffects {
  reverb: {
    enabled: boolean;
    decay: number;
    wet: number;
  };
  delay: {
    enabled: boolean;
    time: number;
    feedback: number;
    wet: number;
  };
  eq: {
    enabled: boolean;
    low: number;
    mid: number;
    high: number;
  };
  compressor: {
    enabled: boolean;
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
  };
  limiter: {
    enabled: boolean;
    threshold: number;
  };
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: 'focus' | 'sleep' | 'meditation' | 'energy' | 'healing' | 'custom';
  tracks: Omit<Track, 'id'>[];
  effects: MasterEffects;
  duration?: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  tracks: Track[];
  effects: MasterEffects;
  tempo: number;
  duration: number;
}

export interface TransportState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loop: boolean;
  loopStart: number;
  loopEnd: number;
}

export interface ResonixState {
  // Project
  project: Project | null;

  // Tracks
  tracks: Track[];
  selectedTrackId: string | null;

  // Transport
  transport: TransportState;

  // Master
  masterVolume: number;
  masterEffects: MasterEffects;

  // UI
  visualizerMode: VisualizerMode;
  timelineZoom: number; // 1-10

  // Actions
  addTrack: (track: Omit<Track, 'id'>) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  selectTrack: (id: string | null) => void;
  reorderTracks: (startIndex: number, endIndex: number) => void;

  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setLoop: (loop: boolean, start?: number, end?: number) => void;

  updateMasterEffects: (updates: Partial<MasterEffects>) => void;
  setMasterVolume: (volume: number) => void;

  setVisualizerMode: (mode: VisualizerMode) => void;
  setTimelineZoom: (zoom: number) => void;

  loadPreset: (preset: Preset) => void;
  loadProject: (project: Project) => void;
  saveProject: () => Promise<void>;
  exportProject: () => Promise<void>;
  newProject: () => void;
}
