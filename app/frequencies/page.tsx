'use client';

import { useState } from 'react';
import HeroMovie from '@/components/HeroMovie';
import MovieRow from '@/components/MovieRow';
import Modal from '@/components/Modal';
import { trendingNow, topRated } from '@/data/movies';
import type { Movie } from '@/types/movie';

// Featured frequency for this page - 528 Hz (most popular Solfeggio)
const featuredFrequency: Movie = {
  id: 4,
  title: "528 Hz - DNA Repair & Miracles",
  overview: "Known as the 'Love Frequency' or 'Miracle Tone,' 528 Hz is said to repair DNA and bring transformation. Research shows this frequency reduces stress hormones and increases energy. It resonates at the heart of everything that exists in the universe, making it the most studied and celebrated of all Solfeggio frequencies.",
  poster_path: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=500",
  backdrop_path: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1920",
  release_date: "2024-01-01",
  vote_average: 9.7,
  genre_ids: [1, 2, 4],
  video_id: "NllYXuy8FMk",
};

const FrequenciesPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // Combine all frequency content
  const allFrequencies = [...trendingNow, ...topRated];

  return (
    <>
      {/* Hero Section */}
      <HeroMovie movie={featuredFrequency} onMoreInfo={handleMovieClick} />

      {/* Content Section */}
      <div className="-mt-16 sm:-mt-24 md:-mt-32 relative z-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-screen-2xl">
          {/* Page Introduction */}
          <div className="mb-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Explore Healing Frequencies
              </h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Discover the ancient Solfeggio scale and modern healing frequencies that resonate with your body,
                mind, and spirit. Each frequency carries unique properties for transformation, healing, and spiritual growth.
              </p>
            </div>
          </div>

          <MovieRow
            title="Solfeggio Frequencies"
            movies={trendingNow}
            onMovieClick={handleMovieClick}
          />

          <MovieRow
            title="Healing Frequencies"
            movies={topRated}
            onMovieClick={handleMovieClick}
          />

          <MovieRow
            title="All Frequencies"
            movies={allFrequencies}
            onMovieClick={handleMovieClick}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal movie={selectedMovie} onClose={handleCloseModal} />
    </>
  );
};

export default FrequenciesPage;
