'use client';

import { useEffect, useState, useCallback } from 'react';
import AudioUploader from '@/components/lab/AudioUploader';
import WaveformEditor from '@/components/lab/WaveformEditor';
import FrequencyControls from '@/components/lab/FrequencyControls';
import { retuneAudio, detectDominantFrequency, calculateFrequencyDeviation } from '@/utils/audioProcessing';

export default function FrequencyLabPage() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = 'Resonix Frequency Lab — Edit Sound Like a Master Alchemist';
    return () => {
      document.title = 'Frequency & Vibration - Sound Energy Exploration';
    };
  }, []);

  const handleAudioLoad = useCallback((buffer: AudioBuffer, file: File) => {
    setAudioBuffer(buffer);
    setFileName(file.name);
  }, []);

  const handleRetuneRequest = useCallback(async (targetHz: number, _preservePitch: boolean) => {
    if (!audioBuffer) return;

    setIsProcessing(true);
    try {
      const retunedBuffer = await retuneAudio(audioBuffer, targetHz);
      setAudioBuffer(retunedBuffer);
    } catch (error) {
      console.error('Retune failed:', error);
      alert('Failed to retune audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [audioBuffer]);

  const handleAnalyzeRequest = useCallback(() => {
    console.log('Analyze button clicked');

    if (!audioBuffer) {
      console.log('No audio buffer available');
      alert('No audio loaded. Please upload a file first.');
      return;
    }

    console.log('Starting frequency analysis...');
    setIsProcessing(true);

    // Use setTimeout to avoid blocking and catch async errors
    setTimeout(() => {
      try {
        console.log('Detecting dominant frequency...');
        const result = detectDominantFrequency(audioBuffer);
        console.log('Detection result:', result);

        if (!result || typeof result.frequency !== 'number') {
          throw new Error('Invalid detection result');
        }

        const deviation432 = calculateFrequencyDeviation(result.frequency, 432);
        const deviation440 = calculateFrequencyDeviation(result.frequency, 440);
        console.log('Deviations calculated:', { deviation432, deviation440 });

        const message =
          `Frequency Analysis:\n\n` +
          `Dominant Frequency: ${result.frequency.toFixed(2)} Hz\n` +
          `Confidence: ${(result.confidence * 100).toFixed(0)}%\n\n` +
          `Deviation from 432 Hz: ${deviation432.cents.toFixed(0)} cents\n` +
          `Deviation from 440 Hz: ${deviation440.cents.toFixed(0)} cents`;

        console.log('Analysis complete:', message);
        alert(message);
      } catch (error) {
        console.error('Analysis failed:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        alert(`Failed to analyze frequency: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  }, [audioBuffer]);

  const handleBinauralAdd = useCallback(() => {
    alert('Binaural layer feature coming soon! This will add a binaural beat layer to your audio.');
  }, []);

  return (
    <div className="relative min-h-screen bg-netflix-black pt-28 md:pt-32 lg:pt-36 pb-16">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-netflix-red/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative container">
        {/* Hero Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12 animate-fade-in-up max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Resonix{' '}
            <span className="bg-gradient-to-r from-netflix-red to-purple-600 bg-clip-text text-transparent">
              Frequency Lab
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Edit Sound Like a Master Alchemist — Transform any audio into sacred frequency vibrations
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="px-4 py-2 rounded-full bg-netflix-red/20 border border-netflix-red/50 text-sm text-netflix-red font-medium">
              432 Hz Retuning
            </div>
            <div className="px-4 py-2 rounded-full bg-purple-600/20 border border-purple-600/50 text-sm text-purple-400 font-medium">
              Frequency Analysis
            </div>
            <div className="px-4 py-2 rounded-full bg-pink-600/20 border border-pink-600/50 text-sm text-pink-400 font-medium">
              Sacred Frequencies
            </div>
            <div className="px-4 py-2 rounded-full bg-blue-600/20 border border-blue-600/50 text-sm text-blue-400 font-medium">
              Spectral Editing
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!audioBuffer ? (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <AudioUploader onAudioLoad={handleAudioLoad} />

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="glass p-6 rounded-xl hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-netflix-red/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-netflix-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sacred Retuning</h3>
                <p className="text-sm text-gray-400">
                  Retune your music to 432 Hz, 528 Hz, or any healing frequency with precision pitch shifting
                </p>
              </div>

              <div className="glass p-6 rounded-xl hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Frequency Analysis</h3>
                <p className="text-sm text-gray-400">
                  Detect dominant frequencies and see how your audio deviates from sacred tunings
                </p>
              </div>

              <div className="glass p-6 rounded-xl hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Visual Editing</h3>
                <p className="text-sm text-gray-400">
                  Edit with Audacity-style waveform controls, spectrogram, and region selection
                </p>
              </div>
            </div>

            {/* How it works */}
            <div className="glass p-8 rounded-xl mt-12">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-netflix-red to-purple-600 flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-white mb-2">Upload Audio</h4>
                  <p className="text-sm text-gray-400">
                    Drag & drop any song or audio file
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-netflix-red to-purple-600 flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-white mb-2">Edit & Analyze</h4>
                  <p className="text-sm text-gray-400">
                    Select regions and analyze frequencies
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-netflix-red to-purple-600 flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-white mb-2">Apply Frequencies</h4>
                  <p className="text-sm text-gray-400">
                    Retune to sacred healing frequencies
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-netflix-red to-purple-600 flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
                    4
                  </div>
                  <h4 className="font-semibold text-white mb-2">Export</h4>
                  <p className="text-sm text-gray-400">
                    Download your transformed audio
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
            {/* Main editor area */}
            <div className="lg:col-span-3 space-y-6">
              {/* File info */}
              <div className="glass p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-netflix-red to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{fileName}</h3>
                    <p className="text-sm text-gray-400">
                      {audioBuffer.duration.toFixed(2)}s • {audioBuffer.sampleRate / 1000}kHz • {audioBuffer.numberOfChannels} ch
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAudioBuffer(null);
                    setFileName('');
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                >
                  Load New File
                </button>
              </div>

              {/* Waveform editor */}
              <WaveformEditor audioBuffer={audioBuffer} fileName={fileName} />
            </div>

            {/* Sidebar controls */}
            <div className="lg:col-span-1">
              <FrequencyControls
                onRetuneRequest={handleRetuneRequest}
                onAnalyzeRequest={handleAnalyzeRequest}
                onBinauralAdd={handleBinauralAdd}
                isProcessing={isProcessing}
                hasAudio={!!audioBuffer}
              />
            </div>
          </div>
        )}

        {/* Bottom quote */}
        <div className="text-center mt-16 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <blockquote className="text-xl sm:text-2xl text-gray-300 italic leading-relaxed">
            "In the beginning was the Word, and the Word was with God, and the Word was God."
          </blockquote>
          <cite className="block mt-3 text-sm text-netflix-red font-medium not-italic">
            — John 1:1
          </cite>
          <p className="text-sm text-gray-500 mt-4">
            Sound is the primordial force of creation. Transform it with intention.
          </p>
        </div>
      </div>
    </div>
  );
}
