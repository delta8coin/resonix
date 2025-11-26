import { create } from 'zustand';
import localforage from 'localforage';
import type {
  ResonixState,
  Track,
  MasterEffects,
  Project,
  Preset,
  VisualizerMode,
} from '../types/resonix';

const defaultMasterEffects: MasterEffects = {
  reverb: {
    enabled: false,
    decay: 1.5,
    wet: 0.3,
  },
  delay: {
    enabled: false,
    time: 0.25,
    feedback: 0.5,
    wet: 0.3,
  },
  eq: {
    enabled: false,
    low: 0,
    mid: 0,
    high: 0,
  },
  compressor: {
    enabled: false,
    threshold: -24,
    ratio: 4,
    attack: 0.003,
    release: 0.25,
  },
  limiter: {
    enabled: true,
    threshold: -1,
  },
};

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useResonixStore = create<ResonixState>((set, get) => ({
  // Initial state
  project: null,
  tracks: [],
  selectedTrackId: null,

  transport: {
    isPlaying: false,
    currentTime: 0,
    duration: 300, // 5 minutes default
    loop: false,
    loopStart: 0,
    loopEnd: 300,
  },

  masterVolume: 0.7,
  masterEffects: defaultMasterEffects,

  visualizerMode: 'waveform',
  timelineZoom: 1,

  // Track actions
  addTrack: (track) => {
    const newTrack: Track = {
      ...track,
      id: generateId(),
    };
    set((state) => ({
      tracks: [...state.tracks, newTrack],
      selectedTrackId: newTrack.id,
    }));
  },

  removeTrack: (id) => {
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== id),
      selectedTrackId: state.selectedTrackId === id ? null : state.selectedTrackId,
    }));
  },

  updateTrack: (id, updates) => {
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  selectTrack: (id) => {
    set({ selectedTrackId: id });
  },

  reorderTracks: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.tracks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { tracks: result };
    });
  },

  // Transport actions
  setPlaying: (playing) => {
    set((state) => ({
      transport: { ...state.transport, isPlaying: playing },
    }));
  },

  setCurrentTime: (time) => {
    set((state) => ({
      transport: { ...state.transport, currentTime: time },
    }));
  },

  setLoop: (loop, start?, end?) => {
    set((state) => ({
      transport: {
        ...state.transport,
        loop,
        loopStart: start !== undefined ? start : state.transport.loopStart,
        loopEnd: end !== undefined ? end : state.transport.loopEnd,
      },
    }));
  },

  // Master effects actions
  updateMasterEffects: (updates) => {
    set((state) => ({
      masterEffects: {
        ...state.masterEffects,
        ...updates,
      },
    }));
  },

  setMasterVolume: (volume) => {
    set({ masterVolume: Math.max(0, Math.min(1, volume)) });
  },

  // UI actions
  setVisualizerMode: (mode: VisualizerMode) => {
    set({ visualizerMode: mode });
  },

  setTimelineZoom: (zoom) => {
    set({ timelineZoom: Math.max(1, Math.min(10, zoom)) });
  },

  // Preset and project actions
  loadPreset: (preset: Preset) => {
    const tracks: Track[] = preset.tracks.map((t) => ({
      ...t,
      id: generateId(),
    }));

    set({
      tracks,
      masterEffects: preset.effects,
      selectedTrackId: null,
    });
  },

  loadProject: (project: Project) => {
    set({
      project,
      tracks: project.tracks,
      masterEffects: project.effects,
      transport: {
        ...get().transport,
        duration: project.duration,
        loopEnd: project.duration,
      },
      selectedTrackId: null,
    });
  },

  newProject: () => {
    set({
      project: {
        id: generateId(),
        name: 'Untitled Project',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tracks: [],
        effects: defaultMasterEffects,
        tempo: 120,
        duration: 300,
      },
      tracks: [],
      selectedTrackId: null,
      masterEffects: defaultMasterEffects,
      transport: {
        isPlaying: false,
        currentTime: 0,
        duration: 300,
        loop: false,
        loopStart: 0,
        loopEnd: 300,
      },
    });
  },

  saveProject: async () => {
    const state = get();
    const project: Project = {
      id: state.project?.id || generateId(),
      name: state.project?.name || 'Untitled Project',
      createdAt: state.project?.createdAt || Date.now(),
      updatedAt: Date.now(),
      tracks: state.tracks,
      effects: state.masterEffects,
      tempo: state.project?.tempo || 120,
      duration: state.transport.duration,
    };

    await localforage.setItem(`resonix-project-${project.id}`, project);
    set({ project });
  },

  exportProject: async () => {
    const state = get();
    const project: Project = {
      id: state.project?.id || generateId(),
      name: state.project?.name || 'Untitled Project',
      createdAt: state.project?.createdAt || Date.now(),
      updatedAt: Date.now(),
      tracks: state.tracks,
      effects: state.masterEffects,
      tempo: state.project?.tempo || 120,
      duration: state.transport.duration,
    };

    // Export as JSON file
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-')}.resonix`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));
