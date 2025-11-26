export interface AudioTrack {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  tuning: 'scientific' | 'solfeggio';
  instrument: string;
  minutesPerChakra: number;
  tags: string[];
}

export const premadeAudio: AudioTrack[] = [
  {
    id: '7-minute-chakra',
    title: '7-Minute Chakra Healing',
    description: 'Complete 7-chakra journey using scientific tuning (C4-B4 scale, 256-480 Hz) with grand piano. 1 minute per chakra with smooth crossfades, gentle chime transitions, and rain ambience.',
    duration: '7:00',
    url: '/audio/7-minute-chakra-activation.wav',
    tuning: 'scientific',
    instrument: 'Piano',
    minutesPerChakra: 1,
    tags: ['Meditation', 'Healing', 'ChakraNote', 'Piano', 'Rain Ambience'],
  },
];
