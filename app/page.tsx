import ChakraActivator from '@/components/ChakraActivator';
import AudioLibraryPlayer from '@/components/AudioLibraryPlayer';
import { premadeAudio } from '@/data/audioLibrary';

export default function Home() {
  return (
    <>
      <ChakraActivator />

      {/* Audio Library Section */}
      <div className="bg-gradient-to-br from-black via-purple-950 to-black text-white p-8 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-3">
              Pre-Made Chakra Journeys
            </h2>
            <p className="text-gray-400 text-lg">
              Ready-to-play chakra activation audio • Perfect for immediate meditation
            </p>
          </div>

          <AudioLibraryPlayer tracks={premadeAudio} />
        </div>
      </div>
    </>
  );
}
