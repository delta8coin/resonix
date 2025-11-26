import Image from 'next/image';
import type { Movie } from '@/types/movie';

interface HeroMovieProps {
  movie: Movie;
  onMoreInfo: (movie: Movie) => void;
}

export default function HeroMovie({ movie, onMoreInfo }: HeroMovieProps) {
  return (
    <section className="relative h-[85vh] overflow-hidden flex items-end pb-[15%]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={movie.backdrop_path}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-[4%] max-w-[650px]">
        <div className="inline-block px-3.5 py-1.5 bg-netflix-red/90 rounded text-[13px] font-bold mb-5 tracking-[2px]">
          N SERIES
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight drop-shadow-2xl">
          {movie.title}
        </h1>

        <div className="flex gap-4 mb-5 text-base items-center">
          <span className="text-green-500 font-bold">
            {Math.round(movie.vote_average * 10)}% Match
          </span>
          <span className="text-gray-300">{movie.release_date?.split('-')[0]}</span>
          <span className="px-2 py-0.5 border border-white/40 rounded text-xs font-semibold">HD</span>
        </div>

        <p className="text-base md:text-lg leading-relaxed mb-8 text-gray-200 line-clamp-3 drop-shadow-lg max-w-xl">
          {movie.overview}
        </p>

        <div className="flex gap-3 flex-wrap">
          {movie.video_id && (
            <a
              href={`https://www.youtube.com/watch?v=${movie.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-black rounded font-bold text-base md:text-lg flex items-center gap-3 hover:bg-white/75 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Play</span>
            </a>
          )}
          <button
            onClick={() => onMoreInfo(movie)}
            className="px-8 py-3 bg-gray-600/70 text-white rounded font-bold text-base md:text-lg flex items-center gap-3 hover:bg-gray-600/40 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>More Info</span>
          </button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-netflix-black to-transparent pointer-events-none" />
    </section>
  );
}
