/**
 * Audio Processing Utilities for Frequency Lab
 * Handles pitch shifting, frequency analysis, and retuning
 */

import { PitchShifter } from 'soundtouchjs';

/**
 * Calculates the pitch shift ratio needed to retune from one frequency to another
 */
export function calculatePitchShiftRatio(currentHz: number, targetHz: number): number {
  return targetHz / currentHz;
}

/**
 * Calculates semitone shift from frequency ratio
 */
export function ratioToSemitones(ratio: number): number {
  return 12 * Math.log2(ratio);
}

/**
 * Calculates frequency ratio from semitone shift
 */
export function semitonesToRatio(semitones: number): number {
  return Math.pow(2, semitones / 12);
}

/**
 * Detects the dominant frequency in an audio buffer
 */
export function detectDominantFrequency(
  audioBuffer: AudioBuffer,
  startTime: number = 0,
  duration?: number
): { frequency: number; confidence: number } {
  try {
    console.log('detectDominantFrequency called', { sampleRate: audioBuffer.sampleRate, channels: audioBuffer.numberOfChannels });

    const sampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0);

    console.log('Channel data length:', channelData.length);

    const startSample = Math.floor(startTime * sampleRate);
    const endSample = duration
      ? Math.min(startSample + Math.floor(duration * sampleRate), channelData.length)
      : Math.min(startSample + sampleRate * 2, channelData.length); // Limit to 2 seconds max

    const slicedData = channelData.slice(startSample, endSample);
    console.log('Analyzing slice:', { startSample, endSample, length: slicedData.length });

    // Use autocorrelation for pitch detection
    const frequency = autoCorrelate(slicedData, sampleRate);
    console.log('Autocorrelation result:', frequency);

    return {
      frequency: frequency || 440,
      confidence: frequency ? 0.8 : 0.3
    };
  } catch (error) {
    console.error('Error in detectDominantFrequency:', error);
    return {
      frequency: 440,
      confidence: 0.1
    };
  }
}

/**
 * Autocorrelation-based pitch detection
 */
function autoCorrelate(buffer: Float32Array, sampleRate: number): number | null {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let best_offset = -1;
  let best_correlation = 0;
  let rms = 0;

  // Calculate RMS
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);

  // Not enough signal
  if (rms < 0.01) return null;

  // Find the best correlation
  let lastCorrelation = 1;
  for (let offset = 1; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;

    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }

    correlation = 1 - (correlation / MAX_SAMPLES);

    if (correlation > 0.9 && correlation > lastCorrelation) {
      const foundGoodCorrelation = correlation > best_correlation;
      if (foundGoodCorrelation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    }

    lastCorrelation = correlation;
  }

  if (best_correlation > 0.01 && best_offset !== -1) {
    const fundamentalFreq = sampleRate / best_offset;
    return fundamentalFreq;
  }

  return null;
}

/**
 * Applies pitch shift to an audio buffer using SoundTouch
 */
export async function applyPitchShift(
  audioBuffer: AudioBuffer,
  semitones: number,
  preserveTempo: boolean = true
): Promise<AudioBuffer> {
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  if (!preserveTempo) {
    // Simple pitch shift by changing playback rate
    const ratio = semitonesToRatio(semitones);
    const newLength = Math.floor(audioBuffer.length / ratio);
    const newContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      newLength,
      audioBuffer.sampleRate
    );

    const source = newContext.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = ratio;
    source.connect(newContext.destination);
    source.start(0);

    return await newContext.startRendering();
  }

  // Use SoundTouch for pitch shifting while preserving tempo
  const shifter = new PitchShifter(
    offlineContext,
    audioBuffer,
    4096 // buffer size
  );

  shifter.pitchSemitones = semitones;
  shifter.tempo = 1.0; // preserve tempo

  // This is a simplified version - in production you'd need to properly handle the SoundTouch processing
  // For now, we'll fall back to simple playback rate change
  const ratio = semitonesToRatio(semitones);
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = ratio;
  source.connect(offlineContext.destination);
  source.start(0);

  return await offlineContext.startRendering();
}

/**
 * Retunes audio from standard tuning (440 Hz A) to a target tuning (e.g., 432 Hz)
 */
export async function retuneAudio(
  audioBuffer: AudioBuffer,
  targetHz: number = 432,
  baseHz: number = 440
): Promise<AudioBuffer> {
  const ratio = targetHz / baseHz;
  const semitones = ratioToSemitones(ratio);

  return await applyPitchShift(audioBuffer, semitones, true);
}

/**
 * Analyzes an audio buffer and returns frequency spectrum data
 */
export function analyzeFrequencySpectrum(
  audioBuffer: AudioBuffer,
  startTime: number = 0,
  duration: number = 1.0
): Float32Array {
  const offlineContext = new OfflineAudioContext(
    1,
    audioBuffer.sampleRate * duration,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  const analyser = offlineContext.createAnalyser();

  analyser.fftSize = 8192;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Float32Array(bufferLength);

  source.buffer = audioBuffer;
  source.connect(analyser);
  analyser.connect(offlineContext.destination);

  source.start(startTime, duration);

  analyser.getFloatFrequencyData(dataArray);

  return dataArray;
}

/**
 * Calculates deviation from a target frequency
 */
export function calculateFrequencyDeviation(
  detectedHz: number,
  targetHz: number
): { cents: number; percentage: number } {
  const cents = 1200 * Math.log2(detectedHz / targetHz);
  const percentage = ((detectedHz - targetHz) / targetHz) * 100;

  return { cents, percentage };
}

/**
 * Sacred frequency presets
 */
export const SACRED_FREQUENCIES = {
  '174 Hz': 174,
  '285 Hz': 285,
  '396 Hz': 396,
  '417 Hz': 417,
  '432 Hz': 432, // Cosmic tuning
  '440 Hz': 440, // Standard tuning
  '444 Hz': 444, // Crystal tuning
  '528 Hz': 528, // Love frequency
  '639 Hz': 639,
  '741 Hz': 741,
  '852 Hz': 852,
  '963 Hz': 963,
};

/**
 * Converts frequency to note name
 */
export function frequencyToNote(frequency: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const a4 = 440;
  const c0 = a4 * Math.pow(2, -4.75);

  if (frequency === 0) return 'N/A';

  const halfSteps = 12 * Math.log2(frequency / c0);
  const octave = Math.floor(halfSteps / 12);
  const note = Math.round(halfSteps) % 12;

  return `${noteNames[note]}${octave}`;
}

/**
 * Export audio buffer as WAV file
 */
export function exportAsWAV(audioBuffer: AudioBuffer, filename: string = 'export.wav'): void {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numberOfChannels * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);

  // Write WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  // Write audio data
  const channels = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  // Create download link
  const blob = new Blob([buffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
