'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { Movie } from '@/types/movie';

interface ModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function Modal({ movie, onClose }: ModalProps) {
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  if (!movie) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl bg-netflix-black rounded-lg overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-netflix-black/90 hover:bg-netflix-black rounded-full transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Player */}
        {movie.video_id && (
          <div className="relative w-full pt-[56.25%] bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${movie.video_id}?autoplay=1&rel=0`}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div className="flex gap-6">
            {/* Poster */}
            <div className="flex-shrink-0 w-48 h-72 relative rounded overflow-hidden hidden md:block">
              <Image
                src={movie.poster_path}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-green-500 font-bold text-lg">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span className="text-gray-400">
                  {movie.release_date?.split('-')[0]}
                </span>
                <span className="px-2 py-1 text-xs border border-gray-400 text-gray-400 rounded">
                  HD
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed mb-6">
                {movie.overview}
              </p>

              <div className="flex gap-3">
                {movie.video_id && (
                  <a
                    href={`https://www.youtube.com/watch?v=${movie.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-black rounded font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch on YouTube
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
