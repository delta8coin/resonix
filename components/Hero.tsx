interface HeroProps {
  title: string;
  description: string;
  matchScore?: number;
  year?: string;
}

export default function Hero({ title, description, matchScore = 98, year = '2024' }: HeroProps) {
  return (
    <section className="relative h-[85vh] overflow-hidden flex items-center px-[4%] bg-gradient-to-br from-frequency-purple via-frequency-violet to-frequency-dark">
      {/* Animated gradient overlay */}
      <div className="absolute w-full h-full opacity-50 animate-pulse"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(138, 43, 226, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(75, 0, 130, 0.3) 0%, transparent 50%)'
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-netflix-black to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-[650px]">
        <div className="inline-block px-3.5 py-1.5 bg-netflix-red/90 rounded text-[13px] font-bold mb-5 tracking-[2px]">
          N SERIES
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
          {title}
        </h1>

        <div className="flex gap-4 mb-5 text-base items-center">
          <span className="text-green-500 font-bold">{matchScore}% Match</span>
          <span className="text-gray-300">{year}</span>
          <span className="px-2 py-0.5 border border-white/40 rounded text-xs font-semibold">HD</span>
        </div>

        <p className="text-lg leading-relaxed mb-8 text-gray-200">
          {description}
        </p>

        <div className="flex gap-4">
          <button className="px-9 py-3.5 bg-white text-black rounded font-bold text-lg flex items-center gap-3 hover:bg-white/75 transition-all">
            <span>▶️</span>
            <span>Play</span>
          </button>
          <button className="px-9 py-3.5 bg-gray-600/70 text-white rounded font-bold text-lg flex items-center gap-3 hover:bg-gray-600/40 transition-all">
            <span>ℹ️</span>
            <span>More Info</span>
          </button>
        </div>
      </div>
    </section>
  );
}
