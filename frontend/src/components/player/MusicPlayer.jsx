import { usePlayer } from '../../context/PlayerContext';

function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    progressLabel,
    durationLabel,
    togglePlayback,
    seekTo,
    playNext,
    playPrevious,
  } = usePlayer();

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-7xl">
      <div className="glass-panel rounded-[2rem] px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <img src={currentSong.cover} alt={currentSong.title} className="h-16 w-16 rounded-2xl object-cover" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-100">{currentSong.title}</p>
              <p className="truncate text-sm text-slate-400">{currentSong.artistName}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={playPrevious}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={togglePlayback}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                onClick={playNext}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300"
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-10 text-xs text-slate-400">{progressLabel}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={(event) => seekTo(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10"
              />
              <span className="w-10 text-right text-xs text-slate-400">{durationLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
