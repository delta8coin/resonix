import * as Tone from 'tone';
import type { Track, MasterEffects } from '../types/resonix';

class AudioEngine {
  private initialized = false;
  private trackNodes: Map<string, Tone.ToneAudioNode> = new Map();
  private trackChannels: Map<string, Tone.Channel> = new Map();

  // Master chain
  private masterChannel: Tone.Channel;
  private reverb: Tone.Reverb;
  private delay: Tone.FeedbackDelay;
  private eq3: Tone.EQ3;
  private compressor: Tone.Compressor;
  private limiter: Tone.Limiter;

  // Analyser for visualization
  private analyser: AnalyserNode | null = null;

  constructor() {
    // Initialize master effects chain
    this.masterChannel = new Tone.Channel().toDestination();
    this.reverb = new Tone.Reverb();
    this.delay = new Tone.FeedbackDelay();
    this.eq3 = new Tone.EQ3();
    this.compressor = new Tone.Compressor();
    this.limiter = new Tone.Limiter(-1);

    // Connect master chain
    this.masterChannel.chain(
      this.eq3,
      this.compressor,
      this.reverb,
      this.delay,
      this.limiter,
      Tone.Destination
    );
  }

  async init() {
    if (!this.initialized) {
      await Tone.start();

      // Create and connect analyser to destination for visualization
      const audioContext = Tone.getContext().rawContext as AudioContext;
      this.analyser = audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect Tone.js destination to analyser
      const destination = Tone.getDestination() as unknown as AudioNode;
      destination.connect(this.analyser);

      this.initialized = true;
      console.log('🎵 Audio engine initialized - Ready to make frequencies!');
    }
  }

  // Create audio node for a track
  createTrackNode(track: Track): Tone.ToneAudioNode | null {
    this.disposeTrackNode(track.id);

    let node: Tone.ToneAudioNode | null = null;

    try {
      switch (track.type) {
        case 'oscillator': {
          const osc = new Tone.Oscillator({
            frequency: track.frequency || 440,
            type: track.waveform || 'sine',
          });
          node = osc;
          break;
        }

        case 'noise': {
          const noiseType = track.noiseType === 'violet' ? 'white' : (track.noiseType || 'white');
          const noise = new Tone.Noise(noiseType as 'white' | 'pink' | 'brown');
          node = noise;
          break;
        }

        case 'binaural': {
          // Create binaural beat (different frequencies in each ear)
          const baseFreq = track.baseFrequency || 200;
          const leftOffset = track.leftOffset || 2;
          const rightOffset = track.rightOffset || 2;

          // Left ear gets base - offset, right ear gets base + offset
          const leftOsc = new Tone.Oscillator({
            frequency: baseFreq + leftOffset,
            type: 'sine',
          });
          const rightOsc = new Tone.Oscillator({
            frequency: baseFreq + rightOffset,
            type: 'sine',
          });

          const merger = new Tone.Merge();
          leftOsc.connect(merger, 0, 0);
          rightOsc.connect(merger, 0, 1);

          // Store both oscillators in a group
          (leftOsc as any)._binauralPair = rightOsc;
          node = merger;
          this.trackNodes.set(`${track.id}_left`, leftOsc);
          this.trackNodes.set(`${track.id}_right`, rightOsc);
          break;
        }

        case 'isochronic': {
          // Isochronic tones: amplitude modulated sine wave
          const carrier = new Tone.Oscillator({
            frequency: track.carrierFrequency || 200,
            type: 'sine',
          });
          const modulator = new Tone.LFO({
            frequency: track.pulseFrequency || 10,
            min: 0,
            max: 1,
          });
          const gain = new Tone.Gain(0.5);
          carrier.connect(gain);
          modulator.connect(gain.gain);
          modulator.start();

          (carrier as any)._isochronicMod = modulator;
          (carrier as any)._isochronicGain = gain;
          node = gain;
          this.trackNodes.set(`${track.id}_carrier`, carrier);
          this.trackNodes.set(`${track.id}_modulator`, modulator);
          break;
        }

        case 'audio': {
          if (track.audioBuffer) {
            const player = new Tone.Player({
              url: track.audioUrl,
              loop: true,
            });
            node = player;
          }
          break;
        }
      }

      if (node) {
        // Create channel for this track
        const channel = new Tone.Channel({
          volume: Tone.gainToDb(track.volume),
          pan: track.pan,
        }).connect(this.masterChannel);

        // Apply filter if enabled
        if (track.filterEnabled) {
          const filter = new Tone.Filter({
            type: track.filterType || 'lowpass',
            frequency: track.filterFrequency || 1000,
            Q: track.filterQ || 1,
          });
          node.connect(filter);
          filter.connect(channel);
          this.trackNodes.set(`${track.id}_filter`, filter);
        } else {
          node.connect(channel);
        }

        // Apply modulation if enabled
        if (track.modulationEnabled && track.modulationType === 'AM') {
          const lfo = new Tone.LFO({
            frequency: track.modulationRate || 1,
            min: 1 - (track.modulationDepth || 0.5),
            max: 1,
          });
          lfo.connect(channel.volume);
          lfo.start();
          this.trackNodes.set(`${track.id}_lfo`, lfo);
        }

        this.trackChannels.set(track.id, channel);
        this.trackNodes.set(track.id, node);
      }
    } catch (error) {
      console.error('Error creating track node:', error);
    }

    return node;
  }

  // Start a track
  startTrack(trackId: string) {
    const node = this.trackNodes.get(trackId);
    if (node && 'start' in node && typeof node.start === 'function') {
      try {
        node.start();
      } catch (e) {
        // Already started
      }
    }

    // Start binaural pair
    const leftNode = this.trackNodes.get(`${trackId}_left`);
    const rightNode = this.trackNodes.get(`${trackId}_right`);
    if (leftNode && 'start' in leftNode && typeof leftNode.start === 'function') {
      try {
        leftNode.start();
        if (rightNode && 'start' in rightNode && typeof rightNode.start === 'function') {
          rightNode.start();
        }
      } catch (e) {
        // Already started
      }
    }

    // Start isochronic carrier
    const carrier = this.trackNodes.get(`${trackId}_carrier`);
    if (carrier && 'start' in carrier && typeof carrier.start === 'function') {
      try {
        carrier.start();
      } catch (e) {
        // Already started
      }
    }
  }

  // Stop a track
  stopTrack(trackId: string) {
    const node = this.trackNodes.get(trackId);
    if (node && 'stop' in node && typeof node.stop === 'function') {
      try {
        node.stop();
      } catch (e) {
        // Already stopped
      }
    }

    // Stop binaural pair
    const leftNode = this.trackNodes.get(`${trackId}_left`);
    const rightNode = this.trackNodes.get(`${trackId}_right`);
    if (leftNode && 'stop' in leftNode && typeof leftNode.stop === 'function') {
      try {
        leftNode.stop();
        if (rightNode && 'stop' in rightNode && typeof rightNode.stop === 'function') {
          rightNode.stop();
        }
      } catch (e) {
        // Already stopped
      }
    }

    // Stop isochronic carrier
    const carrier = this.trackNodes.get(`${trackId}_carrier`);
    if (carrier && 'stop' in carrier && typeof carrier.stop === 'function') {
      try {
        carrier.stop();
      } catch (e) {
        // Already stopped
      }
    }
  }

  // Update track parameters
  updateTrackParams(track: Track) {
    const node = this.trackNodes.get(track.id);
    const channel = this.trackChannels.get(track.id);

    if (channel) {
      channel.volume.value = Tone.gainToDb(track.volume);
      channel.pan.value = track.pan;
      channel.mute = track.mute;
      channel.solo = track.solo;
    }

    if (!node) return;

    // Update oscillator frequency
    if ('frequency' in node && track.frequency !== undefined) {
      (node.frequency as Tone.Signal<'frequency'>).value = track.frequency;
    }

    // Update oscillator waveform
    if ('type' in node && track.waveform) {
      (node as any).type = track.waveform;
    }

    // Update noise type
    if ('type' in node && track.noiseType) {
      (node as any).type = track.noiseType;
    }

    // Update binaural frequencies
    const leftNode = this.trackNodes.get(`${track.id}_left`) as Tone.Oscillator;
    const rightNode = this.trackNodes.get(`${track.id}_right`) as Tone.Oscillator;
    if (leftNode && rightNode && track.baseFrequency !== undefined) {
      leftNode.frequency.value = track.baseFrequency + (track.leftOffset || 2);
      rightNode.frequency.value = track.baseFrequency + (track.rightOffset || 2);
    }

    // Update isochronic frequencies
    const carrier = this.trackNodes.get(`${track.id}_carrier`) as Tone.Oscillator;
    const modulator = this.trackNodes.get(`${track.id}_modulator`) as Tone.LFO;
    if (carrier && track.carrierFrequency !== undefined) {
      carrier.frequency.value = track.carrierFrequency;
    }
    if (modulator && track.pulseFrequency !== undefined) {
      modulator.frequency.value = track.pulseFrequency;
    }

    // Update filter
    const filter = this.trackNodes.get(`${track.id}_filter`) as Tone.Filter;
    if (filter) {
      if (track.filterFrequency !== undefined) {
        filter.frequency.value = track.filterFrequency;
      }
      if (track.filterQ !== undefined) {
        filter.Q.value = track.filterQ;
      }
    }
  }

  // Dispose track node
  disposeTrackNode(trackId: string) {
    // Dispose main node
    const node = this.trackNodes.get(trackId);
    if (node) {
      node.dispose();
      this.trackNodes.delete(trackId);
    }

    // Dispose channel
    const channel = this.trackChannels.get(trackId);
    if (channel) {
      channel.dispose();
      this.trackChannels.delete(trackId);
    }

    // Dispose binaural nodes
    const leftNode = this.trackNodes.get(`${trackId}_left`);
    const rightNode = this.trackNodes.get(`${trackId}_right`);
    if (leftNode) {
      leftNode.dispose();
      this.trackNodes.delete(`${trackId}_left`);
    }
    if (rightNode) {
      rightNode.dispose();
      this.trackNodes.delete(`${trackId}_right`);
    }

    // Dispose isochronic nodes
    const carrier = this.trackNodes.get(`${trackId}_carrier`);
    const modulator = this.trackNodes.get(`${trackId}_modulator`);
    const gain = this.trackNodes.get(`${trackId}_gain`);
    if (carrier) {
      carrier.dispose();
      this.trackNodes.delete(`${trackId}_carrier`);
    }
    if (modulator) {
      modulator.dispose();
      this.trackNodes.delete(`${trackId}_modulator`);
    }
    if (gain) {
      gain.dispose();
      this.trackNodes.delete(`${trackId}_gain`);
    }

    // Dispose filter and LFO
    const filter = this.trackNodes.get(`${trackId}_filter`);
    const lfo = this.trackNodes.get(`${trackId}_lfo`);
    if (filter) {
      filter.dispose();
      this.trackNodes.delete(`${trackId}_filter`);
    }
    if (lfo) {
      lfo.dispose();
      this.trackNodes.delete(`${trackId}_lfo`);
    }
  }

  // Update master effects
  updateMasterEffects(effects: MasterEffects) {
    // Reverb
    this.reverb.wet.value = effects.reverb.enabled ? effects.reverb.wet : 0;
    this.reverb.decay = effects.reverb.decay;

    // Delay
    this.delay.wet.value = effects.delay.enabled ? effects.delay.wet : 0;
    this.delay.delayTime.value = effects.delay.time;
    this.delay.feedback.value = effects.delay.feedback;

    // EQ
    if (effects.eq.enabled) {
      this.eq3.low.value = effects.eq.low;
      this.eq3.mid.value = effects.eq.mid;
      this.eq3.high.value = effects.eq.high;
    } else {
      this.eq3.low.value = 0;
      this.eq3.mid.value = 0;
      this.eq3.high.value = 0;
    }

    // Compressor
    if (effects.compressor.enabled) {
      this.compressor.threshold.value = effects.compressor.threshold;
      this.compressor.ratio.value = effects.compressor.ratio;
      this.compressor.attack.value = effects.compressor.attack;
      this.compressor.release.value = effects.compressor.release;
    }

    // Limiter
    this.limiter.threshold.value = effects.limiter.threshold;
  }

  // Update master volume
  updateMasterVolume(volume: number) {
    this.masterChannel.volume.value = Tone.gainToDb(volume);
  }

  // Export audio as WAV
  async exportWAV(duration: number): Promise<Blob> {
    const recorder = new Tone.Recorder();
    this.limiter.connect(recorder);

    recorder.start();
    await new Promise((resolve) => setTimeout(resolve, duration * 1000));
    const recording = await recorder.stop();

    return recording;
  }

  // Get audio context for visualizers
  getContext(): AudioContext {
    return Tone.getContext().rawContext as AudioContext;
  }

  // Get destination node for visualizers
  getDestination(): AudioNode {
    return Tone.getDestination() as unknown as AudioNode;
  }

  // Get analyser for visualization
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  // Check if initialized
  isInitialized(): boolean {
    return this.initialized;
  }

  // Cleanup
  dispose() {
    this.trackNodes.forEach((node) => node.dispose());
    this.trackChannels.forEach((channel) => channel.dispose());
    this.trackNodes.clear();
    this.trackChannels.clear();

    this.reverb.dispose();
    this.delay.dispose();
    this.eq3.dispose();
    this.compressor.dispose();
    this.limiter.dispose();
    this.masterChannel.dispose();
  }
}

// Singleton instance - only create on client side
let audioEngineInstance: AudioEngine | null = null;

export const getAudioEngine = (): AudioEngine => {
  if (typeof window === 'undefined') {
    // Return a mock on server side
    return {} as AudioEngine;
  }

  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }

  return audioEngineInstance;
};

// For backwards compatibility
export const audioEngine = typeof window !== 'undefined' ? getAudioEngine() : {} as AudioEngine;
