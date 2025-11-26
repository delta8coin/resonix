'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Music, Sparkles } from 'lucide-react';
import SongCard from '@/components/library/SongCard';

interface LibrarySong {
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

const LibraryPage: React.FC = () => {
  const [songs, setSongs] = useState<LibrarySong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<LibrarySong[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const frequencies = [174, 285, 396, 417, 432, 528, 639, 741, 852, 963];

  useEffect(() => {
    fetchLibrary();
  }, []);

  useEffect(() => {
    filterSongs();
  }, [songs, searchQuery, selectedFrequency]);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-library');
      if (response.ok) {
        const data = await response.json();
        setSongs(data.songs || []);
      } else {
        console.error('Failed to fetch library');
        setSongs([]);
      }
    } catch (error) {
      console.error('Error fetching library:', error);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSongs = () => {
    let filtered = songs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.uploaderName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by frequency
    if (selectedFrequency) {
      filtered = filtered.filter((song) => song.targetFrequency === selectedFrequency);
    }

    setFilteredSongs(filtered);
  };

  const paginatedSongs = filteredSongs.slice(0, page * itemsPerPage);
  const hasMore = paginatedSongs.length < filteredSongs.length;

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Generate sample waveform data (in production, this would come from the server)
  const generateWaveform = () => {
    return Array.from({ length: 50 }, () => Math.random() * 255);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/50 via-black to-teal-950/50 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400">
                Resonix Library
              </h1>
              <Sparkles className="w-8 h-8 text-teal-400 animate-pulse" />
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Community Healing Archive — Every song ever converted to sacred healing frequencies
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-300">
              <Music className="w-4 h-4" />
              <span>{filteredSongs.length} healing tracks available</span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search by song title or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-teal-900/30 border border-purple-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Frequency Filter */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400 mr-2">Filter by frequency:</span>
              <button
                onClick={() => setSelectedFrequency(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedFrequency === null
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-purple-900/20 text-gray-300 hover:bg-purple-800/30 border border-purple-500/20'
                }`}
              >
                All
              </button>
              {frequencies.map((freq) => (
                <button
                  key={freq}
                  onClick={() => setSelectedFrequency(freq)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedFrequency === freq
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-purple-900/20 text-gray-300 hover:bg-purple-800/30 border border-purple-500/20'
                  }`}
                >
                  {freq} Hz
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSongs.length === 0 && (
            <div className="text-center py-20">
              <Music className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {searchQuery || selectedFrequency ? 'No songs found' : 'No songs yet'}
              </h3>
              <p className="text-gray-400">
                {searchQuery || selectedFrequency
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to share a healing frequency conversion!'}
              </p>
            </div>
          )}

          {/* Songs Grid */}
          {!loading && paginatedSongs.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {paginatedSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    id={song.id}
                    title={song.title}
                    originalFrequency={song.originalFrequency}
                    targetFrequency={song.targetFrequency}
                    uploadDate={song.uploadDate}
                    uploaderName={song.uploaderName}
                    fileUrl={song.fileUrl}
                    waveformData={song.waveformData || generateWaveform()}
                    playCount={song.playCount}
                    likes={song.likes}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 hover:from-purple-500 hover:via-pink-500 hover:to-teal-500 rounded-full text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105"
                  >
                    Load More Healing Frequencies
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
