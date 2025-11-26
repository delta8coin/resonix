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

export default function ChakraActivator() {
  const [tuning, setTuning] = useState<TuningSystem>('scientific');
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [minutesPerChakra, setMinutesPerChakra] = useState(7);
  const [volumeSweep, setVolumeSweep] = useState(true);
  const [background, setBackground] = useState<BackgroundType>('none');
  const [binauralBeatFreq, setBinauralBeatFreq] = useState(7);
  const [binauralCarrier, setBinauralCarrier] = useState(150);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChakra, setCurrentChakra] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [previewChakra, setPreviewChakra] = useState<number | null>(null);
  const [isChakraNoteExact, setIsChakraNoteExact] = useState(false);
  const [showChakraNoteTable, setShowChakraNoteTable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'wav' | 'mp3' | 'ogg'>('wav');

  const synthRef = useRef<Tone.PolySynth | Tone.FMSynth | Tone.Oscillator | null>(null);
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

  const activateChakraNotePreset = () => {
    setIsChakraNoteExact(true);
    setTuning('scientific');
    setInstrument('piano');
    setMinutesPerChakra(6);
    setVolumeSweep(true);
    setBackground('rain');
    setShowChakraNoteTable(true);
  };

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

      // Arpeggio pattern
      const notes = [freq, freq * 1.25, freq * 1.5, freq * 2];
      const now = Tone.now();
      const duration = minutesPerChakra * 60;
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
      bowls.triggerAttackRelease(freq, minutesPerChakra * 60);
    } else if (instrument === 'sine') {
      const osc = new Tone.Oscillator(freq, 'sine').start();
      osc.connect(mainGainRef.current!);
      synthRef.current = osc;
    } else if (instrument === 'square') {
      const osc = new Tone.Oscillator(freq, 'square').start();
      osc.connect(mainGainRef.current!);
      synthRef.current = osc;
    } else if (instrument === 'binaural') {
      const carrier = binauralCarrier + freq / 10;
      const panLeft = new Tone.Panner(-1).toDestination();
      const panRight = new Tone.Panner(1).toDestination();

      binauralLeftRef.current = new Tone.Oscillator(carrier - binauralBeatFreq / 2, 'sine').start();
      binauralRightRef.current = new Tone.Oscillator(carrier + binauralBeatFreq / 2, 'sine').start();

      binauralLeftRef.current.chain(panLeft, mainGainRef.current!);
      binauralRightRef.current.chain(panRight, mainGainRef.current!);
    }

    // Set volume based on sweep
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

    // Timer for progress and chakra transitions
    const chakraDuration = minutesPerChakra * 60;
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
        // Transition to next chakra
        setCurrentChakra(currentChakraIndex);

        // Play chime
        if (chimeRef.current) {
          chimeRef.current.triggerAttackRelease(1200, 0.1);
        }

        // Crossfade
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

  const totalDuration = minutesPerChakra * 7;
  const progress = totalDuration > 0 ? (timeElapsed / (totalDuration * 60)) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      await Tone.start();

      // Create offline context for rendering
      const totalDurationSeconds = minutesPerChakra * 7 * 60;
      const offline = new Tone.OfflineContext(2, totalDurationSeconds, 44100);

      // Set Tone to use offline context
      Tone.setContext(offline);

      // Create all audio nodes in offline context
      const offlineReverb = new Tone.Reverb({ decay: 3.5, wet: 0.3 });
      await offlineReverb.generate();
      offlineReverb.connect(offline.destination);

      const offlineChorus = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.7, wet: 0.4 });
      offlineChorus.connect(offline.destination);

      const offlineMainGain = new Tone.Gain(0.7);
      offlineMainGain.connect(offline.destination);

      const offlineBackgroundGain = new Tone.Gain(0.15);
      offlineBackgroundGain.connect(offline.destination);

      // Setup background if needed
      if (background !== 'none') {
        const bgNoise = new Tone.Noise('pink');
        const bgFilter = new Tone.Filter({
          frequency: background === 'rain' ? 2000 : background === 'ocean' ? 400 : 800,
          type: 'lowpass',
          rolloff: -24,
        });

        const lfo = new Tone.LFO(background === 'ocean' ? 0.1 : 0.3, 0.2, 1);
        lfo.connect(bgFilter.frequency);
        lfo.start(0);

        bgNoise.chain(bgFilter, offlineBackgroundGain);
        bgNoise.start(0);
      }

      // Setup chime for transitions
      const chime = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.5, release: 1 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
        volume: -18,
      });
      chime.connect(offline.destination);

      // Render each chakra
      const chakraDuration = minutesPerChakra * 60;

      for (let i = 0; i < 7; i++) {
        const startTime = i * chakraDuration;

        // Play chime at transition
        if (i > 0) {
          chime.triggerAttackRelease(1200, 0.1, startTime);
        }

        const freq =
          tuning === 'scientific'
            ? CHAKRAS[i].scientificFreq
            : CHAKRAS[i].solfeggioFreq;

        // Set volume based on sweep
        if (volumeSweep) {
          const volume = -12 + (i / 6) * 12;
          offlineMainGain.gain.setValueAtTime(Tone.dbToGain(volume), startTime);
        }

        // Create instrument for this chakra
        if (instrument === 'piano') {
          const piano = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.5, sustain: 0.7, release: 2 },
            volume: -6,
          });
          piano.chain(offlineReverb, offlineMainGain);

          const notes = [freq, freq * 1.25, freq * 1.5, freq * 2];
          notes.forEach((note, j) => {
            piano.triggerAttackRelease(note, chakraDuration / 4, startTime + j * (chakraDuration / 4));
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
          bowls.chain(offlineChorus, offlineReverb, offlineMainGain);
          bowls.triggerAttackRelease(freq, chakraDuration, startTime);
        } else if (instrument === 'sine') {
          const osc = new Tone.Oscillator(freq, 'sine');
          osc.connect(offlineMainGain);
          osc.start(startTime);
          osc.stop(startTime + chakraDuration);
        } else if (instrument === 'square') {
          const osc = new Tone.Oscillator(freq, 'square');
          osc.connect(offlineMainGain);
          osc.start(startTime);
          osc.stop(startTime + chakraDuration);
        } else if (instrument === 'binaural') {
          const carrier = binauralCarrier + freq / 10;
          const panLeft = new Tone.Panner(-1);
          const panRight = new Tone.Panner(1);
          panLeft.connect(offline.destination);
          panRight.connect(offline.destination);

          const oscLeft = new Tone.Oscillator(carrier - binauralBeatFreq / 2, 'sine');
          const oscRight = new Tone.Oscillator(carrier + binauralBeatFreq / 2, 'sine');

          oscLeft.chain(panLeft, offlineMainGain);
          oscRight.chain(panRight, offlineMainGain);

          oscLeft.start(startTime);
          oscLeft.stop(startTime + chakraDuration);
          oscRight.start(startTime);
          oscRight.stop(startTime + chakraDuration);
        }
      }

      // Render audio
      const buffer = await offline.render();

      // Get the actual AudioBuffer
      const audioBuffer = buffer.get() as AudioBuffer;

      let blob: Blob;
      let filename: string;

      // Convert to selected format
      if (downloadFormat === 'wav') {
        const wav = bufferToWave(audioBuffer, audioBuffer.length);
        blob = new Blob([wav], { type: 'audio/wav' });
        filename = `chakra-journey-${tuning}-${instrument}-${minutesPerChakra}min.wav`;
      } else if (downloadFormat === 'mp3') {
        // For MP3, we'll use MediaRecorder API to encode
        blob = await encodeToMP3(audioBuffer);
        filename = `chakra-journey-${tuning}-${instrument}-${minutesPerChakra}min.mp3`;
      } else {
        // OGG format
        blob = await encodeToOGG(audioBuffer);
        filename = `chakra-journey-${tuning}-${instrument}-${minutesPerChakra}min.ogg`;
      }

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      // Reset Tone context to real-time
      Tone.setContext(new Tone.Context());

      // Reinitialize effects
      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
      reverbRef.current = new Tone.Reverb({ decay: 3.5, wet: 0.3 }).toDestination();
      await reverbRef.current.generate();

      if (chorusRef.current) {
        chorusRef.current.dispose();
      }
      chorusRef.current = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.7, wet: 0.4 }).toDestination();

      if (mainGainRef.current) {
        mainGainRef.current.dispose();
      }
      mainGainRef.current = new Tone.Gain(0.7).toDestination();

      if (backgroundGainRef.current) {
        backgroundGainRef.current.dispose();
      }
      backgroundGainRef.current = new Tone.Gain(0.15).toDestination();

      if (chimeRef.current) {
        chimeRef.current.dispose();
      }
      chimeRef.current = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.5, release: 1 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
        volume: -18,
      }).toDestination();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download audio. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to encode AudioBuffer to MP3 using MediaRecorder
  async function encodeToMP3(audioBuffer: AudioBuffer): Promise<Blob> {
    // Create an offline audio context to play the buffer
    const offlineCtx = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineCtx.destination);
    source.start();

    // Create a MediaStreamDestination
    const audioContext = new AudioContext();
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(mediaStreamDestination);

    // Use MediaRecorder to encode to MP3 (or webm if MP3 not supported)
    const mimeType = MediaRecorder.isTypeSupported('audio/mp4')
      ? 'audio/mp4'
      : 'audio/webm;codecs=opus';

    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream, {
      mimeType,
      audioBitsPerSecond: 192000
    });

    const chunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        audioContext.close();
        resolve(blob);
      };

      mediaRecorder.onerror = (e) => {
        audioContext.close();
        reject(e);
      };

      mediaRecorder.start();
      sourceNode.start();

      // Stop recording after the buffer duration
      setTimeout(() => {
        mediaRecorder.stop();
        sourceNode.stop();
      }, (audioBuffer.length / audioBuffer.sampleRate) * 1000);
    });
  }

  // Helper function to encode AudioBuffer to OGG
  async function encodeToOGG(audioBuffer: AudioBuffer): Promise<Blob> {
    const audioContext = new AudioContext();
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(mediaStreamDestination);

    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream, {
      mimeType: 'audio/webm;codecs=opus', // Opus in WebM container (similar to OGG)
      audioBitsPerSecond: 192000
    });

    const chunks: Blob[] = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg' });
        audioContext.close();
        resolve(blob);
      };

      mediaRecorder.onerror = (e) => {
        audioContext.close();
        reject(e);
      };

      mediaRecorder.start();
      sourceNode.start();

      setTimeout(() => {
        mediaRecorder.stop();
        sourceNode.stop();
      }, (audioBuffer.length / audioBuffer.sampleRate) * 1000);
    });
  }

  // Helper function to convert AudioBuffer to WAV
  function bufferToWave(abuffer: AudioBuffer, len: number) {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // write interleaved data
    for (let i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        // interleave channels
        let sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // write 16-bit sample
        pos += 2;
      }
      offset++; // next source sample
    }

    return buffer;

    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Turn Any Bed Into A MedBed™
          </h1>
          <p className="text-gray-400 text-lg">
            Synthesize personalized 7-chakra frequency Healing journeys
          </p>
        </div>

        {/* ChakraNote Exact Frequency Preset */}
        <div className="mb-12">
          <button
            onClick={activateChakraNotePreset}
            disabled={isPlaying}
            className={`w-full p-8 rounded-3xl transition-all duration-300 relative overflow-hidden group ${
              isChakraNoteExact
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 shadow-2xl shadow-amber-500/50 scale-[1.02]'
                : 'bg-gradient-to-r from-amber-600/20 via-yellow-500/20 to-amber-600/20 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.01]'
            } border-2 border-amber-500/50`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl">✨</span>
                <h2 className="text-3xl font-bold text-white">
                  ChakraNote Exact Frequency
                </h2>
                <span className="text-3xl">✨</span>
              </div>
              <p className="text-amber-100 text-lg font-semibold mb-1">
                Recommended: Scientific Tuning (C4–B4 Scale) • 256–480 Hz
              </p>
              <p className="text-amber-200/80 text-sm">
                Precision-mapped chakra frequencies to musical notes • Grand piano with gentle rain ambience • Best for meditation & healing
              </p>
              {isChakraNoteExact && (
                <div className="mt-3 inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold">
                  ✓ Preset Active
                </div>
              )}
            </div>
          </button>
        </div>

        {/* ChakraNote Frequency Table */}
        {showChakraNoteTable && (
          <div className="mb-12 bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-amber-300">Exact Frequency Mapping</h3>
              <button
                onClick={() => setShowChakraNoteTable(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-500/30">
                    <th className="text-left py-3 px-4 font-semibold text-amber-300">Chakra</th>
                    <th className="text-left py-3 px-4 font-semibold text-amber-300">Note</th>
                    <th className="text-left py-3 px-4 font-semibold text-amber-300">Frequency</th>
                    <th className="text-left py-3 px-4 font-semibold text-amber-300">Sensation</th>
                  </tr>
                </thead>
                <tbody>
                  {CHAKRANOTE_MAPPINGS.map((mapping, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-amber-500/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-white">{mapping.chakra}</td>
                      <td className="py-3 px-4 text-amber-200 font-mono font-bold">{mapping.note}</td>
                      <td className="py-3 px-4 text-amber-100 font-mono">{mapping.frequency} Hz</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">{mapping.sensation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chakra Preview Grid */}
        <div className="mb-12 grid grid-cols-7 gap-3">
          {CHAKRAS.map((chakra, i) => (
            <button
              key={chakra.name}
              onClick={() => handlePreview(i)}
              disabled={isPlaying}
              className={`relative p-4 rounded-xl transition-all duration-300 ${
                previewChakra === i
                  ? 'ring-4 ring-white scale-110'
                  : 'hover:scale-105 hover:ring-2 hover:ring-purple-400'
              }`}
              style={{
                background: `linear-gradient(135deg, ${chakra.color}22, ${chakra.color}44)`,
                borderColor: chakra.color,
                borderWidth: '2px',
              }}
            >
              <div className="text-xs font-bold mb-1">{chakra.name}</div>
              <div className="text-xs opacity-75">
                {tuning === 'scientific' ? chakra.scientificFreq : chakra.solfeggioFreq} Hz
              </div>
              {previewChakra === i && (
                <div className="absolute inset-0 animate-ping rounded-xl opacity-50" style={{ backgroundColor: chakra.color }} />
              )}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tuning System */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-purple-300">Tuning System</label>
              <div className="flex gap-4">
                {(['scientific', 'solfeggio'] as TuningSystem[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTuning(t)}
                    disabled={isPlaying}
                    className={`relative flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      tuning === t
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{t === 'scientific' ? 'Scientific (256-480 Hz)' : 'Solfeggio (396-963 Hz)'}</span>
                      {t === 'scientific' && (
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                          ✓ Recommended
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Instrument */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-purple-300">Instrument/Sound</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value as InstrumentType)}
                disabled={isPlaying}
                className="w-full py-3 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
              >
                <option value="piano">Piano (Realistic)</option>
                <option value="bowls">Tibetan Singing Bowls</option>
                <option value="sine">Pure Sine Wave</option>
                <option value="square">Square Wave</option>
                <option value="binaural">Binaural Beats</option>
              </select>
            </div>

            {/* Minutes per Chakra */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-purple-300">
                Minutes per Chakra: <span className="text-white">{minutesPerChakra}</span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                value={minutesPerChakra}
                onChange={(e) => setMinutesPerChakra(Number(e.target.value))}
                disabled={isPlaying}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="text-xs text-gray-500 mt-1">Total: {totalDuration} minutes</div>
            </div>

            {/* Background */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-purple-300">Background Ambience</label>
              <select
                value={background}
                onChange={(e) => setBackground(e.target.value as BackgroundType)}
                disabled={isPlaying}
                className="w-full py-3 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
              >
                <option value="none">None</option>
                <option value="rain">Rain</option>
                <option value="ocean">Ocean Waves</option>
                <option value="forest">Forest Sounds</option>
              </select>
            </div>

            {/* Binaural Settings */}
            {instrument === 'binaural' && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-purple-300">
                    Beat Frequency: <span className="text-white">{binauralBeatFreq} Hz</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.5"
                    value={binauralBeatFreq}
                    onChange={(e) => setBinauralBeatFreq(Number(e.target.value))}
                    disabled={isPlaying}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">Theta/Alpha brainwave entrainment</div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-purple-300">
                    Carrier Frequency: <span className="text-white">{binauralCarrier} Hz</span>
                  </label>
                  <input
                    type="range"
                    min="120"
                    max="200"
                    step="10"
                    value={binauralCarrier}
                    onChange={(e) => setBinauralCarrier(Number(e.target.value))}
                    disabled={isPlaying}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              </>
            )}

            {/* Volume Sweep */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={volumeSweep}
                  onChange={(e) => setVolumeSweep(e.target.checked)}
                  disabled={isPlaying}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="text-sm font-semibold text-purple-300">
                  Volume Sweep (Quiet Root → Loud Crown)
                </span>
              </label>
            </div>

            {/* Download Format */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-purple-300">Download Format</label>
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value as 'wav' | 'mp3' | 'ogg')}
                disabled={isPlaying || isDownloading}
                className="w-full py-3 px-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
              >
                <option value="wav">WAV (Uncompressed, Highest Quality)</option>
                <option value="mp3">MP3 (Compressed, Smaller File)</option>
                <option value="ogg">OGG (Compressed, Open Format)</option>
              </select>
            </div>
          </div>

          {/* Play/Stop and Download Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={isPlaying ? handleStop : handlePlay}
              disabled={isDownloading}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                isPlaying
                  ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:shadow-2xl hover:shadow-red-500/50'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isPlaying ? '⏸ Stop Journey' : '▶ Begin Chakra Journey'}
            </button>

            <button
              onClick={handleDownload}
              disabled={isPlaying || isDownloading}
              className="px-6 py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:shadow-2xl hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {isDownloading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Rendering...
                </>
              ) : (
                <>
                  ⬇ Download Song
                </>
              )}
            </button>
          </div>

          {isDownloading && (
            <div className="mt-4 text-center text-sm text-amber-300">
              Rendering {totalDuration}-minute audio file with all your settings... This may take a moment.
            </div>
          )}

          {/* Progress Bar & Current Chakra */}
          {isPlaying && (
              <div className="mt-6 space-y-4">
                {/* Current Chakra Display */}
                <div className="flex items-center justify-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: CHAKRAS[currentChakra].color }}
                  />
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: CHAKRAS[currentChakra].color }}>
                      {CHAKRAS[currentChakra].name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {tuning === 'scientific'
                        ? CHAKRAS[currentChakra].scientificFreq
                        : CHAKRAS[currentChakra].solfeggioFreq}{' '}
                      Hz
                      {isChakraNoteExact && ` • ${CHAKRANOTE_MAPPINGS[currentChakra].note}`}
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: CHAKRAS[currentChakra].color }}
                  />
                </div>

                {/* Time Display */}
                <div className="flex justify-between text-sm text-gray-400 px-2">
                  <span>{formatTime(timeElapsed)}</span>
                  <span>Chakra {currentChakra + 1} of 7</span>
                  <span>{formatTime(totalDuration * 60)}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full transition-all duration-1000 ease-linear"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(to right, ${CHAKRAS[0].color}, ${CHAKRAS[currentChakra].color})`,
                    }}
                  />
                </div>

                {/* Chakra Timeline */}
                <div className="grid grid-cols-7 gap-2 mt-4">
                  {CHAKRAS.map((chakra, i) => (
                    <div
                      key={i}
                      className={`text-center p-2 rounded-lg transition-all ${
                        i === currentChakra
                          ? 'ring-2 ring-white scale-110'
                          : i < currentChakra
                          ? 'opacity-50'
                          : 'opacity-30'
                      }`}
                      style={{
                        backgroundColor: `${chakra.color}22`,
                        borderColor: chakra.color,
                        borderWidth: '1px',
                      }}
                    >
                      <div className="text-xs font-bold">{chakra.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">
            ✨ Real-time browser playback • Smooth crossfades • Soft chime transitions
          </p>
          <p>
            {totalDuration} minute journey through all 7 chakras
          </p>
        </div>
      </div>
    </div>
  );
}
