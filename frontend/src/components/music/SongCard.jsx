import { usePlayer } from '../../context/PlayerContext';
import { cn } from '../../lib/utils';

function SongCard({ song, queue, onLike, liked, compact = false, action }) {
  const { currentSong, isPlaying, playSong, togglePlayback } = usePlayer();

  const isCurrent = currentSong?.id === song.id;

  function handlePlay() {
    if (isCurrent) {
      togglePlayback();
      return;
    }
    playSong(song, queue);
  }

  return (
    <article
      className={cn(
        'glass-panel group rounded-[1.75rem] p-4 transition hover:-translate-y-1',
        compact ? 'flex items-center gap-4' : 'flex flex-col',
      )}
    >
      <img
        src={song.cover}
        alt={song.title}
        className={cn(
          'rounded-2xl object-cover',
          compact ? 'h-20 w-20 shrink-0' : 'h-52 w-full',
        )}
      />
      <div className={cn('flex-1', compact ? 'min-w-0' : 'mt-4')}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-100">{song.title}</p>
            <p className="truncate text-sm text-slate-400">{song.artistName}</p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-brand-200">
            {song.mood}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePlay}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            {isCurrent && isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => onLike(song)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm transition',
              liked
                ? 'border-brand-300 bg-brand-500/20 text-white'
                : 'border-white/10 text-slate-300 hover:border-white/20',
            )}
          >
            {liked ? 'Liked' : 'Like'}
          </button>
          {action}
        </div>
      </div>
    </article>
  );
}

export default SongCard;
