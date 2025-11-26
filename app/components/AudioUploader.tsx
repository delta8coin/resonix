import { useCallback, useState } from 'react';

interface AudioUploaderProps {
  onAudioLoad: (audioBuffer: AudioBuffer, file: File) => void;
}

export default function AudioUploader({ onAudioLoad }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        throw new Error('Please upload an audio file');
      }

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Decode audio data
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      onAudioLoad(audioBuffer, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audio file');
      console.error('Error loading audio:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onAudioLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative overflow-hidden
        border-2 border-dashed rounded-2xl
        transition-all duration-300
        ${isDragging
          ? 'border-netflix-red bg-netflix-red/10 scale-105'
          : 'border-gray-700 hover:border-netflix-red/50 bg-gradient-to-br from-gray-900/50 to-black/50'
        }
        ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
    >
      {/* Mystical background effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-netflix-red/20 via-transparent to-purple-600/20 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-netflix-red/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <label className="relative block p-12 sm:p-16 md:p-20 text-center cursor-pointer">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />

        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`
              p-6 rounded-full
              bg-gradient-to-br from-netflix-red to-purple-600
              shadow-lg shadow-netflix-red/50
              transition-transform duration-300
              ${isDragging ? 'scale-110 rotate-12' : 'hover:scale-105'}
            `}>
              {isLoading ? (
                <svg
                  className="w-12 h-12 text-white animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">
              {isLoading ? 'Loading Audio...' : 'Upload Your Sound'}
            </h3>
            <p className="text-gray-400 text-lg">
              {isDragging
                ? 'Release to begin your sonic journey'
                : 'Drag & drop an audio file, or click to browse'
              }
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: MP3, WAV, FLAC, OGG, M4A
            </p>
          </div>

          {/* Mystical quote */}
          <div className="pt-6 border-t border-gray-800">
            <p className="text-sm text-netflix-red/70 italic">
              "Transform ordinary sound into sacred vibration"
            </p>
          </div>
        </div>
      </label>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-red-900/90 border border-red-500 rounded-lg text-white text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
