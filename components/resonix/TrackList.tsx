import { useResonixStore } from '../../stores/resonixStore';
import Track from './Track';
import AddTrackButton from './AddTrackButton';

export default function TrackList() {
  const { tracks } = useResonixStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Tracks
        </h2>
        <AddTrackButton />
      </div>

      {tracks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-purple-500/30 rounded-xl bg-purple-900/10">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl text-purple-300 mb-2">No tracks yet</h3>
          <p className="text-purple-400/70 mb-6">
            Add your first track to start creating frequencies
          </p>
          <AddTrackButton />
        </div>
      ) : (
        <div className="space-y-3">
          {tracks.map((track) => (
            <Track key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}
