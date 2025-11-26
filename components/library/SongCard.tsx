import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Heart } from 'lucide-react';

interface SongCardProps {
  id: string;
  title: string;
  originalFrequency: number;
  targetFrequency: number;
  uploadDate: string;
  uploaderName?: string;
  fileUrl: string;
  waveformData?: number[];
  playCount?: number;
  likes?: number;
}

const SongCard: React.FC<SongCardProps> = ({
  title,
  originalFrequency,
  targetFrequency,
  uploadDate,
  uploaderName,
  fileUrl,
  waveformData,
  playCount = 0,
  likes = 0,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw waveform on canvas
  useEffect(() => {
    if (canvasRef.current && waveformData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / waveformData.length;

      ctx.clearRect(0, 0, width, height);

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#a78bfa');
      gradient.addColorStop(0.5, '#f472b6');
      gradient.addColorStop(1, '#2dd4bf');

      ctx.fillStyle = gradient;

      waveformData.forEach((value, index) => {
        const barHeight = (value / 255) * height;
        const x = index * barWidth;
        const y = (height - barHeight) / 2;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });
    }
  }, [waveformData]);

  const handlePlayPause = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(fileUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}_${targetFrequency}hz.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Send like to backend
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="group relative bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-teal-900/30 border border-purple-500/30 rounded-xl overflow-hidden hover:scale-105 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
      {/* Waveform Thumbnail */}
      <div className="relative h-32 bg-black/40 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={300}
          height={128}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-purple-500/50"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            )}
          </button>
        </div>

        {/* Frequency Badge */}
        <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold shadow-lg">
          {originalFrequency} → {targetFrequency} Hz
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-teal-400 transition-all">
          {title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>{formatDate(uploadDate)}</span>
          {uploaderName && (
            <>
              <span>•</span>
              <span className="text-purple-300">{uploaderName}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-400 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? 'fill-pink-400 text-pink-400' : ''}`}
              />
              <span>{likes + (isLiked ? 1 : 0)}</span>
            </button>

            {/* Play Count */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Play className="w-3 h-3" />
              <span>{playCount}</span>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 rounded-full bg-gradient-to-r from-purple-600/50 to-teal-600/50 hover:from-purple-500 hover:to-teal-500 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className={`w-4 h-4 text-white ${isDownloading ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
