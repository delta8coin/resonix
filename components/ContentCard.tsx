import type { ContentItem } from './ContentRow';

interface ContentCardProps {
  item: ContentItem;
}

export default function ContentCard({ item }: ContentCardProps) {
  return (
    <div className="min-w-[300px] w-[300px] cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10 rounded overflow-hidden relative group">
      <div className={`w-full h-[169px] ${item.gradientClass} rounded flex items-center justify-center text-7xl relative overflow-hidden`}>
        {/* Music note icon */}
        <span className="opacity-25">♪</span>

        {/* Match badge */}
        <span className="absolute top-2.5 left-2.5 bg-black/90 px-2.5 py-1.5 rounded text-sm font-bold text-green-500">
          {item.matchScore}%
        </span>

        {/* Year badge */}
        <span className="absolute top-2.5 right-2.5 bg-black/90 px-2.5 py-1.5 rounded text-xs font-semibold text-white">
          {item.year}
        </span>
      </div>

      {/* Overlay on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-base font-bold leading-tight">
          {item.title}
        </div>
      </div>
    </div>
  );
}
