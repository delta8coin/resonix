'use client';

import { useState } from 'react';
import HeroMovie from '@/components/HeroMovie';
import MovieRow from '@/components/MovieRow';
import Modal from '@/components/Modal';
import { actionMovies, hemiSyncContent } from '@/data/movies';
import type { Movie } from '@/types/movie';

// Featured content for Meditation - Theta Waves
const featuredMeditation: Movie = {
  id: 13,
  title: "Theta Waves (4-8 Hz)",
  overview: "Theta waves occur during deep meditation and light sleep, representing the gateway to your subconscious mind. They unlock creativity, enhance learning, reduce stress, and promote profound relaxation. This state allows access to deep-seated memories, intuition, and is ideal for hypnosis, visualization, and transformative inner work.",
  poster_path: "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=500",
  backdrop_path: "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1920",
  release_date: "2024-01-01",
  vote_average: 9.0,
  genre_ids: [5, 6],
  video_id: "BWYyGMuZSgc",
};

const MeditationPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // Get Hemi-Sync meditation content
  const hemiSyncMeditation = hemiSyncContent.filter(
    item => item.title.includes('Focus') || item.title.includes('Gateway')
  );

  return (
    <>
      {/* Hero Section */}
      <HeroMovie movie={featuredMeditation} onMoreInfo={handleMovieClick} />

      {/* Content Section */}
      <div className="-mt-16 sm:-mt-24 md:-mt-32 relative z-10 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-screen-2xl">
          {/* Page Introduction */}
          <div className="mb-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Meditation & Brainwave States
              </h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                Explore the science of brainwave entrainment and discover how different frequencies can guide your
                mind into optimal states for relaxation, creativity, focus, and deep meditation. Learn to harness
                the power of your brain's natural rhythms.
              </p>
            </div>
          </div>

          <MovieRow
            title="Brainwave States"
            movies={actionMovies}
            onMovieClick={handleMovieClick}
          />

          <MovieRow
            title="Hemi-Sync Focus States"
            movies={hemiSyncMeditation}
            onMovieClick={handleMovieClick}
          />

          {/* Brainwave Guide */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              <div className="bg-white/5 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Beta (12-30 Hz)
                </h3>
                <p className="text-gray-400 text-sm">
                  Active thinking, focus, alertness. Your normal waking state.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Alpha (8-12 Hz)
                </h3>
                <p className="text-gray-400 text-sm">
                  Relaxed awareness, creativity, light meditation, learning.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Theta (4-8 Hz)
                </h3>
                <p className="text-gray-400 text-sm">
                  Deep meditation, intuition, memory access, REM sleep.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Delta (0.5-4 Hz)
                </h3>
                <p className="text-gray-400 text-sm">
                  Deep sleep, healing, regeneration, unconscious mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal movie={selectedMovie} onClose={handleCloseModal} />
    </>
  );
};

export default MeditationPage;
