import ChakraActivator from '@/components/ChakraActivator';
import Link from 'next/link';

export default function ChakraActivatorPage() {
  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            Resonix
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 hover:text-white transition-all"
          >
            ← Back to Lab
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <ChakraActivator />
    </div>
  );
}
