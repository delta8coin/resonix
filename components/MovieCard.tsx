'use client';

import Image from 'next/image';
import type { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      onClick={() => onClick(movie)}
      className="min-w-[300px] w-[300px] cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10 rounded overflow-hidden relative group"
    >
      <div className="w-full h-[169px] relative overflow-hidden rounded bg-gray-900">
        <Image
          src={movie.poster_path}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="300px"
        />

        {/* Match badge */}
        <span className="absolute top-2.5 left-2.5 bg-black/90 px-2.5 py-1.5 rounded text-sm font-bold text-green-500 z-10">
          {Math.round(movie.vote_average * 10)}%
        </span>

        {/* Year badge */}
        <span className="absolute top-2.5 right-2.5 bg-black/90 px-2.5 py-1.5 rounded text-xs font-semibold text-white z-10">
          {movie.release_date?.split('-')[0]}
        </span>
      </div>

      {/* Overlay on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-base font-bold leading-tight line-clamp-2">
          {movie.title}
        </div>
      </div>
    </div>
  );
}
