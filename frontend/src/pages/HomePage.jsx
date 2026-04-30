import { useState } from 'react';
import MoodFilter from '../components/music/MoodFilter';
import SongCard from '../components/music/SongCard';
import EmptyState from '../components/ui/EmptyState';
import Loader from '../components/ui/Loader';
import SectionHeading from '../components/ui/SectionHeading';
import { useMusic } from '../context/MusicContext';

function HomePage() {
  const {
    songs,
    likes,
    playlists,
    selectedMood,
    loading,
    error,
    refreshSongs,
    toggleLike,
    addSongToPlaylist,
  } = useMusic();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  if (loading) {
    return <Loader label="Loading your feed..." />;
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Home"
        title="Mood-matched tracks for right now"
        description="Browse your current catalog, switch by mood, and send songs straight into your player or playlists."
      />

      <div className="glass-panel mb-6 rounded-[2rem] p-5">
        <MoodFilter selectedMood={selectedMood} onSelect={refreshSongs} />
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </div>

      <div className="mb-6 flex max-w-sm items-center gap-3">
        <select
          value={selectedPlaylistId}
          onChange={(event) => setSelectedPlaylistId(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none"
        >
          <option value="">Select a playlist to quick-add</option>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.title}
            </option>
          ))}
        </select>
      </div>

      {songs.length === 0 ? (
        <EmptyState
          title="No songs available"
          description="Your backend returned an empty catalog. Add tracks from the artist side or refresh later."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {songs.map((song) => {
            const liked = likes.some((item) => item.id === song.id);
            return (
              <SongCard
                key={song.id}
                song={song}
                queue={songs}
                liked={liked}
                onLike={toggleLike}
                action={
                  selectedPlaylistId ? (
                    <button
                      type="button"
                      onClick={() => addSongToPlaylist(selectedPlaylistId, song)}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20"
                    >
                      Add to playlist
                    </button>
                  ) : null
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HomePage;
