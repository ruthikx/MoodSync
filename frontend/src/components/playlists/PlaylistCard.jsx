function PlaylistCard({ playlist, onRemove }) {
  return (
    <div className="glass-panel rounded-[1.75rem] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{playlist.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{playlist.songs.length} songs</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {playlist.songs.length === 0 ? (
          <p className="text-sm text-slate-500">No tracks yet. Add songs from Home or Discover.</p>
        ) : (
          playlist.songs.map((song) => (
            <div key={song.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-200">{song.title}</p>
                <p className="text-xs text-slate-500">{song.artistName}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(playlist.id, song.id)}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PlaylistCard;
