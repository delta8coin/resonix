'use client';

import { useState, useRef, useEffect } from 'react';
import type { AudioTrack } from '@/data/audioLibrary';

interface AudioLibraryPlayerProps {
  tracks: AudioTrack[];
}

export default function AudioLibraryPlayer({ tracks }: AudioLibraryPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="w-full bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
      <audio ref={audioRef} src={currentTrack.url} />

      {/* Track Info */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{currentTrack.title}</h3>
        <p className="text-gray-300 text-sm mb-3">{currentTrack.description}</p>
        <div className="flex flex-wrap gap-2">
          {currentTrack.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all"
        >
          {isPlaying ? (
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Track Details */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="text-gray-400">Tuning</div>
          <div className="text-white font-semibold">
            {currentTrack.tuning === 'scientific' ? 'Scientific' : 'Solfeggio'}
          </div>
        </div>
        <div>
          <div className="text-gray-400">Instrument</div>
          <div className="text-white font-semibold">{currentTrack.instrument}</div>
        </div>
        <div>
          <div className="text-gray-400">Duration</div>
          <div className="text-white font-semibold">{currentTrack.duration}</div>
        </div>
      </div>
    </div>
  );
}
