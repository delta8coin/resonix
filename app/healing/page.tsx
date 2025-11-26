'use client';

import { useState } from 'react';
import HeroMovie from '@/components/HeroMovie';
import MovieRow from '@/components/MovieRow';
import Modal from '@/components/Modal';
import { horrorMovies, comedyMovies } from '@/data/movies';
import type { Movie } from '@/types/movie';

// Featured content for Sound Healing - Tibetan Singing Bowls
const featuredHealing: Movie = {
  id: 22,
  title: "Tibetan Singing Bowls",
  overview: "Ancient instruments that produce rich, harmonic tones with profound healing properties. The vibrations from singing bowls promote deep relaxation, reduce stress, and can help balance the chakras. Used for centuries in meditation and healing practices across Asia, these sacred instruments create a bridge between the physical and spiritual worlds through pure sound.",
  poster_path: "https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg?auto=compress&cs=tinysrgb&w=500",
  backdrop_path: "https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg?auto=compress&cs=tinysrgb&w=1920",
  release_date: "2024-01-01",
  vote_average: 9.1,
  genre_ids: [4, 8],
  video_id: "hlWiI4xVXKY",
};

const SoundHealingPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      {/* Hero Section */}
      <HeroMovie movie={featuredHealing} onMoreInfo={handleMovieClick} />

      {/* Content Section */}
      <div className="-mt-16 sm:-mt-24 md:-mt-32 relative z-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-screen-2xl">
          {/* Page Introduction */}
          <div className="mb-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Sound Healing Practices
              </h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Experience the transformative power of sound healing through ancient instruments and modern techniques.
                From Tibetan singing bowls to crystal therapy, these practices use vibration and resonance to restore
                balance, release tension, and promote holistic well-being.
              </p>
            </div>
          </div>

          <MovieRow
            title="Healing Instruments"
            movies={horrorMovies}
            onMovieClick={handleMovieClick}
          />

          <MovieRow
            title="Science of Sound"
            movies={comedyMovies}
            onMovieClick={handleMovieClick}
          />

          {/* Additional Info Section */}
          <div className="mt-8">
            <div className="bg-white/5 rounded-lg p-6 max-w-4xl">
              <h3 className="text-xl font-semibold text-white mb-3">
                Benefits of Sound Healing
              </h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-netflix-red mt-1">•</span>
                  Deep relaxation and stress reduction
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-netflix-red mt-1">•</span>
                  Chakra balancing and energy alignment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-netflix-red mt-1">•</span>
                  Pain relief and physical healing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-netflix-red mt-1">•</span>
                  Enhanced meditation and spiritual connection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-netflix-red mt-1">•</span>
                  Improved sleep and emotional balance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal movie={selectedMovie} onClose={handleCloseModal} />
    </>
  );
};

export default SoundHealingPage;
