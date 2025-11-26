'use client';

import { useEffect, useState } from 'react';
import { useResonixStore } from '@/stores/resonixStore';
import { audioEngine } from '@/services/audioEngine';
import Transport from '@/components/resonix/Transport';
import TrackList from '@/components/resonix/TrackList';
import Visualizer from '@/components/resonix/Visualizer';
import EffectsRack from '@/components/resonix/EffectsRack';
import PresetSelector from '@/components/resonix/PresetSelector';
import MasterControls from '@/components/resonix/MasterControls';
import HeartTune from '@/components/resonix/HeartTune';

export default function ResonixPage() {
  const { transport, setPlaying, saveProject, exportProject, addTrack, tracks, removeTrack } = useResonixStore();
  const [isAwakened, setIsAwakened] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(432);
  const [quickPlayTrackId, setQuickPlayTrackId] = useState<string | null>(null);

  // Set page title
  useEffect(() => {
    document.title = 'Resonix — Forge Frequencies, Reshape Minds';
    return () => {
      document.title = 'Frequency & Vibration - Sound Energy Exploration';
    };
  }, []);

  const handleAwaken = async () => {
    try {
      await audioEngine.init();
      setIsAwakened(true);
    } catch (error) {
      console.error('Failed to awaken Resonix:', error);
      alert('Failed to initialize audio. Please try again.');
    }
  };

  const handleQuickPlay = async () => {
    if (!isAwakened) {
      await handleAwaken();
    }

    // Remove existing quick play track if any
    if (quickPlayTrackId) {
      const existingTrack = tracks.find(t => t.id === quickPlayTrackId);
      if (existingTrack) {
        removeTrack(quickPlayTrackId);
      }
    }

    // Add new track with selected frequency
    addTrack({
      name: `${selectedFrequency} Hz`,
      type: 'oscillator',
      waveform: 'sine',
      frequency: selectedFrequency,
      enabled: true,
      solo: false,
      mute: false,
      volume: 0.5,
      pan: 0,
    });

    // Get the newly added track ID (it will be the last one)
    setTimeout(() => {
      const newTracks = useResonixStore.getState().tracks;
      const newTrack = newTracks[newTracks.length - 1];
      if (newTrack) {
        setQuickPlayTrackId(newTrack.id);
      }
      setPlaying(true);
    }, 100);
  };

  const handleQuickStop = () => {
    setPlaying(false);
    if (quickPlayTrackId) {
      const existingTrack = tracks.find(t => t.id === quickPlayTrackId);
      if (existingTrack) {
        removeTrack(quickPlayTrackId);
      }
      setQuickPlayTrackId(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setPlaying(!transport.isPlaying);
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            saveProject();
          } else {
            e.preventDefault();
            setPlaying(false);
          }
          break;
        case 'e':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            exportProject();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [transport.isPlaying, setPlaying, saveProject, exportProject]);

  // Animated background particles
  useEffect(() => {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }> = [];

    const colors = ['#a855f7', '#ec4899', '#06b6d4', '#14b8a6'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <canvas
        id="particles-canvas"
        className="fixed inset-0 pointer-events-none opacity-30"
      />

      {/* Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-screen-2xl">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-5 md:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                Resonix
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-purple-300/80 mb-3 sm:mb-4 font-light">The Frequency Forge</p>
            <p className="text-sm sm:text-base md:text-lg text-purple-400/70 max-w-2xl mx-auto leading-relaxed">
              Professional brain-wave entrainment and frequency synthesis laboratory.
              Create binaural beats, isochronic tones, and multi-layered soundscapes.
            </p>

            {/* Awaken Button */}
            {!isAwakened && (
              <div className="mt-8">
                <button
                  onClick={handleAwaken}
                  className="px-12 py-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white text-2xl font-bold transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 animate-pulse"
                >
                  ⚡ Awaken Resonix ⚡
                </button>
                <p className="text-purple-400/60 text-sm mt-4">Click to initialize the audio engine</p>
              </div>
            )}

            {isAwakened && (
              <div className="mt-6 px-6 py-3 bg-green-600/20 border border-green-500/40 rounded-lg inline-block">
                <span className="text-green-400 font-semibold">🎵 Audio Engine Active</span>
              </div>
            )}
          </div>

          {/* Quick Frequency Player */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-purple-300 mb-4 text-center">Quick Frequency Player</h3>

              <div className="mb-4">
                <div className="text-center mb-2">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {selectedFrequency}
                  </span>
                  <span className="text-2xl text-purple-300 ml-2">Hz</span>
                </div>

                <input
                  type="number"
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0.1}
                  max={20000}
                  className="w-full bg-purple-900/60 border border-purple-500/60 rounded-lg px-4 py-2 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3"
                />

                <input
                  type="range"
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(parseFloat(e.target.value))}
                  min={1}
                  max={1000}
                  step={1}
                  className="w-full h-2 rounded-lg appearance-none bg-purple-900/60 accent-purple-500"
                />
              </div>

              <div className="mb-4">
                <label className="text-purple-300 mb-2 block text-sm">Solfeggio Frequencies</label>
                <div className="grid grid-cols-3 gap-2">
                  {[174, 285, 396, 417, 528, 639, 741, 852, 963].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setSelectedFrequency(freq)}
                      className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                        selectedFrequency === freq
                          ? 'bg-teal-600 border-teal-400 text-white'
                          : 'bg-teal-900/30 border-teal-500/40 text-teal-300 hover:bg-teal-800/40'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleQuickPlay}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all shadow-lg"
                >
                  ▶ Play
                </button>
                <button
                  onClick={handleQuickStop}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold transition-all shadow-lg"
                >
                  ⏹ Stop
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm text-purple-300/80">
              <span className="whitespace-nowrap">
                <kbd className="px-2 py-1 bg-purple-900/40 border border-purple-500/40 rounded text-xs">
                  SPACE
                </kbd>{' '}
                Play/Pause
              </span>
              <span className="whitespace-nowrap">
                <kbd className="px-2 py-1 bg-purple-900/40 border border-purple-500/40 rounded text-xs">
                  S
                </kbd>{' '}
                Stop
              </span>
              <span className="whitespace-nowrap">
                <kbd className="px-2 py-1 bg-purple-900/40 border border-purple-500/40 rounded text-xs">
                  Ctrl+S
                </kbd>{' '}
                Save
              </span>
              <span className="whitespace-nowrap">
                <kbd className="px-2 py-1 bg-purple-900/40 border border-purple-500/40 rounded text-xs">
                  Ctrl+E
                </kbd>{' '}
                Export
              </span>
            </div>
          </div>

          {/* HeartTune 432 Hz Converter */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <HeartTune />
          </div>

          {/* Preset Selector */}
          <div className="mb-6 sm:mb-8">
            <PresetSelector />
          </div>

          {/* Transport Controls */}
          <div className="mb-6 sm:mb-8">
            <Transport />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Tracks - Takes 2 columns */}
            <div className="lg:col-span-2 w-full">
              <TrackList />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4 sm:space-y-6 w-full">
              {/* Visualizer */}
              <Visualizer />

              {/* Master Controls */}
              <MasterControls />
            </div>
          </div>

          {/* Effects Rack */}
          <div className="mb-6 sm:mb-8">
            <EffectsRack />
          </div>

          {/* Footer Info */}
          <div className="text-center mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-purple-500/20">
            <p className="text-purple-400/60 text-xs sm:text-sm mb-2 px-4">
              "If you want to find the secrets of the universe, think in terms of energy,
              frequency and vibration."
            </p>
            <p className="text-purple-500/80 text-xs">— Nikola Tesla</p>
          </div>
        </div>
      </div>
    </div>
  );
}
