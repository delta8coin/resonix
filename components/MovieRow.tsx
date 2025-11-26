'use client';

import { useRef } from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '@/types/movie';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 900;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-11">
      <div className="flex items-center justify-between mb-3 px-[4%]">
        <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
        <span className="text-sm text-frequency-purple font-bold cursor-pointer hover:text-purple-400 transition-colors flex items-center gap-1">
          Explore All ›
        </span>
      </div>

      <div className="relative group px-[4%]">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 w-[60px] h-[169px] bg-black/70 text-white text-4xl z-10 hidden group-hover:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110"
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll gap-2 hide-scrollbar py-1.5 -mx-1.5 px-1.5"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 w-[60px] h-[169px] bg-black/70 text-white text-4xl z-10 hidden group-hover:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
}
