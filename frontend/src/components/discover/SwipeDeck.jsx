import { useMemo, useState } from 'react';
import EmptyState from '../ui/EmptyState';
import { usePlayer } from '../../context/PlayerContext';
import { cn } from '../../lib/utils';

function DiscoverCard({ song, queue, liked, onLike, onSkip, stacked = false }) {
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
        'glass-panel overflow-hidden rounded-[2.2rem] transition',
        stacked ? 'pointer-events-none' : 'pointer-events-auto',
      )}
    >
      <div className="relative h-64 overflow-hidden sm:h-80">
        <img src={song.cover} alt={song.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-brand-100 backdrop-blur">
          {song.mood}
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-slate-50 sm:text-3xl">{song.title}</h3>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">{song.artistName}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Swipe-style discovery without the clutter. Preview the track, save it if it hits, or skip ahead to the next vibe.
            </p>
          </div>
          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Now showing</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{song.artistName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handlePlay}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            {isCurrent && isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => onLike(song)}
            className={cn(
              'rounded-full border px-5 py-3 text-sm font-medium transition',
              liked
                ? 'border-brand-300 bg-brand-500/20 text-white'
                : 'border-white/10 text-slate-300 hover:border-white/20',
            )}
          >
            {liked ? 'Liked' : 'Like'}
          </button>
          <button
            type="button"
            onClick={() => onSkip(song)}
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-white/20"
          >
            Skip
          </button>
        </div>
      </div>
    </article>
  );
}

function SwipeDeck({ songs, likes, onLike, onSkip }) {
  const [index, setIndex] = useState(0);

  const visibleSongs = useMemo(() => songs.slice(index, index + 3), [songs, index]);
  const activeSong = visibleSongs[0];

  function handleLike(song) {
    onLike(song);
    setIndex((current) => current + 1);
  }

  function handleSkip(song) {
    onSkip?.(song);
    setIndex((current) => current + 1);
  }

  if (!activeSong) {
    return (
      <EmptyState
        title="You cleared the stack"
        description="Refresh the page or switch moods to keep discovering new tracks."
      />
    );
  }

  return (
    <div className="relative mx-auto flex min-h-[42rem] w-full max-w-4xl items-start justify-center px-2 pt-6 sm:px-6">
      {visibleSongs
        .slice()
        .reverse()
        .map((song, layerIndex) => {
          const liked = likes.some((item) => item.id === song.id);
          const isTop = song.id === activeSong.id;
          return (
            <div
              key={song.id}
              className="absolute w-full transition"
              style={{
                transform: `translateY(${layerIndex * 26}px) scale(${1 - layerIndex * 0.05})`,
                opacity: 1 - layerIndex * 0.2,
              }}
            >
              <DiscoverCard
                song={song}
                queue={songs}
                liked={liked}
                onLike={isTop ? handleLike : onLike}
                onSkip={handleSkip}
                stacked={!isTop}
              />
            </div>
          );
        })}
    </div>
  );
}

export default SwipeDeck;
