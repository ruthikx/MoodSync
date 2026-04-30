import { useState } from 'react';
import PlaylistCard from '../components/playlists/PlaylistCard';
import EmptyState from '../components/ui/EmptyState';
import SectionHeading from '../components/ui/SectionHeading';
import { useMusic } from '../context/MusicContext';

function PlaylistsPage() {
  const { playlists, createPlaylist, removeSongFromPlaylist } = useMusic();
  const [title, setTitle] = useState('');

  async function handleCreate(event) {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }
    await createPlaylist(title.trim());
    setTitle('');
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Playlists"
        title="Keep each mood in its own lane"
        description="Create playlists instantly, then add tracks from the main feed or discovery stack."
      />

      <form onSubmit={handleCreate} className="glass-panel mb-6 flex flex-col gap-3 rounded-[2rem] p-5 md:flex-row">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Late night coding set"
          className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none"
        />
        <button
          type="submit"
          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Create playlist
        </button>
      </form>

      {playlists.length === 0 ? (
        <EmptyState
          title="No playlists yet"
          description="Create your first playlist here, then use the Home page quick-add control to fill it."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} onRemove={removeSongFromPlaylist} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistsPage;
