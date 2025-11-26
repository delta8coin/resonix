declare module 'soundtouchjs' {
  export class PitchShifter {
    constructor(context: AudioContext | OfflineAudioContext, buffer: AudioBuffer, bufferSize: number);
    pitch: number;
    pitchSemitones: number;
    tempo: number;
    on(event: string, callback: (event: any) => void): void;
  }
}
