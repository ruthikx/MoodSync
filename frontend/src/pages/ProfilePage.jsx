import { useMemo, useState } from 'react';
import EmptyState from '../components/ui/EmptyState';
import SectionHeading from '../components/ui/SectionHeading';
import SongCard from '../components/music/SongCard';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';

function ProfilePage() {
  const { user } = useAuth();
  const { songs, albums, likes, history, playlists, toggleLike, uploadMusic, createAlbum } = useMusic();
  const [musicForm, setMusicForm] = useState({ title: '', file: null });
  const [albumForm, setAlbumForm] = useState({ title: '', musics: [] });
  const [submittingMusic, setSubmittingMusic] = useState(false);
  const [submittingAlbum, setSubmittingAlbum] = useState(false);
  const [artistError, setArtistError] = useState('');
  const [artistSuccess, setArtistSuccess] = useState('');

  const artistSongs = useMemo(
    () => songs.filter((song) => song.artistId === user?.id),
    [songs, user?.id],
  );

  const artistAlbums = useMemo(
    () =>
      albums.filter((album) => {
        const artistId = album.artist?._id || album.artist?.id || album.artist;
        return artistId === user?.id;
      }),
    [albums, user?.id],
  );

  function resetArtistFeedback() {
    setArtistError('');
    setArtistSuccess('');
  }

  function handleMusicFieldChange(event) {
    const { name, value, files } = event.target;
    resetArtistFeedback();
    setMusicForm((current) => ({
      ...current,
      [name]: name === 'file' ? files?.[0] || null : value,
    }));
  }

  function handleAlbumTitleChange(event) {
    resetArtistFeedback();
    setAlbumForm((current) => ({ ...current, title: event.target.value }));
  }

  function handleAlbumMusicToggle(musicId) {
    resetArtistFeedback();
    setAlbumForm((current) => ({
      ...current,
      musics: current.musics.includes(musicId)
        ? current.musics.filter((id) => id !== musicId)
        : [...current.musics, musicId],
    }));
  }

  async function handleMusicSubmit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    resetArtistFeedback();
    setSubmittingMusic(true);

    try {
      await uploadMusic(musicForm);
      setArtistSuccess('Track uploaded successfully.');
      setMusicForm({ title: '', file: null });
      formElement.reset();
    } catch (error) {
      setArtistError(error.response?.data?.message || 'Unable to upload this track right now.');
    } finally {
      setSubmittingMusic(false);
    }
  }

  async function handleAlbumSubmit(event) {
    event.preventDefault();
    resetArtistFeedback();
    setSubmittingAlbum(true);

    try {
      await createAlbum(albumForm);
      setArtistSuccess('Album created successfully.');
      setAlbumForm({ title: '', musics: [] });
    } catch (error) {
      setArtistError(error.response?.data?.message || 'Unable to create this album right now.');
    } finally {
      setSubmittingAlbum(false);
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Profile"
        title={user?.username || 'Your profile'}
        description="Track what you loved, what you played recently, and how your playlists are evolving."
      />

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm text-slate-400">Liked songs</p>
          <p className="mt-2 text-4xl font-bold text-slate-100">{likes.length}</p>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm text-slate-400">Listening history</p>
          <p className="mt-2 text-4xl font-bold text-slate-100">{history.length}</p>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm text-slate-400">Playlists</p>
          <p className="mt-2 text-4xl font-bold text-slate-100">{playlists.length}</p>
        </div>
      </section>

      {user?.role === 'artist' ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Artist tools"
            title="Publish music and bundle albums"
            description="Upload new tracks, then assemble them into albums directly from your profile."
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <form onSubmit={handleMusicSubmit} className="glass-panel rounded-[2rem] p-6">
              <h3 className="text-xl font-semibold text-slate-100">Add music</h3>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Track title</span>
                  <input
                    name="title"
                    value={musicForm.title}
                    onChange={handleMusicFieldChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-300"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Audio file</span>
                  <input
                    name="file"
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicFieldChange}
                    required
                    className="w-full rounded-2xl border border-dashed border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={submittingMusic}
                className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingMusic ? 'Uploading...' : 'Upload track'}
              </button>
            </form>

            <form onSubmit={handleAlbumSubmit} className="glass-panel rounded-[2rem] p-6">
              <h3 className="text-xl font-semibold text-slate-100">Add album</h3>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Album title</span>
                  <input
                    value={albumForm.title}
                    onChange={handleAlbumTitleChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-300"
                  />
                </label>
                <div>
                  <span className="mb-3 block text-sm text-slate-300">Select tracks</span>
                  {artistSongs.length === 0 ? (
                    <p className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-400">
                      Upload at least one track before creating an album.
                    </p>
                  ) : (
                    <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                      {artistSongs.map((song) => (
                        <label
                          key={song.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-100">{song.title}</p>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{song.mood}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={albumForm.musics.includes(song.id)}
                            onChange={() => handleAlbumMusicToggle(song.id)}
                            className="h-4 w-4 rounded border-white/20 bg-slate-900 text-brand-300"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={submittingAlbum || artistSongs.length === 0 || albumForm.musics.length === 0}
                className="mt-5 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submittingAlbum ? 'Creating...' : 'Create album'}
              </button>
            </form>
          </div>

          {artistError ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {artistError}
            </div>
          ) : null}
          {artistSuccess ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {artistSuccess}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Your tracks</p>
              <p className="mt-2 text-4xl font-bold text-slate-100">{artistSongs.length}</p>
            </div>
            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Your albums</p>
              <p className="mt-2 text-4xl font-bold text-slate-100">{artistAlbums.length}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeading title="Liked songs" />
        {likes.length === 0 ? (
          <EmptyState title="Nothing liked yet" description="Start liking tracks from Home or Discover to build your taste graph." />
        ) : (
          <div className="grid gap-4">
            {likes.map((song) => (
              <SongCard key={song.id} song={song} queue={likes} liked onLike={toggleLike} compact />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeading title="Recent listening" />
        {history.length === 0 ? (
          <EmptyState title="History is empty" description="Play a song to start building your listening timeline." />
        ) : (
          <div className="grid gap-4">
            {history.map((song) => (
              <SongCard
                key={`${song.id}-history`}
                song={song}
                queue={history}
                liked={likes.some((item) => item.id === song.id)}
                onLike={toggleLike}
                compact
              />
            ))}
          </div>
        )}
      </section>

      {user?.role === 'artist' ? (
        <section>
          <SectionHeading title="Published tracks" />
          {artistSongs.length === 0 ? (
            <EmptyState
              title="No tracks published yet"
              description="Upload your first track above and it will appear here immediately."
            />
          ) : (
            <div className="grid gap-4">
              {artistSongs.map((song) => (
                <SongCard
                  key={`${song.id}-artist`}
                  song={song}
                  queue={artistSongs}
                  liked={likes.some((item) => item.id === song.id)}
                  onLike={toggleLike}
                  compact
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {user?.role === 'artist' ? (
        <section>
          <SectionHeading title="Published albums" />
          {artistAlbums.length === 0 ? (
            <EmptyState
              title="No albums yet"
              description="Create an album from your uploaded tracks to start building a catalog."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {artistAlbums.map((album) => (
                <article key={album._id || album.id} className="glass-panel rounded-[2rem] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Album</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-100">{album.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {Array.isArray(album.musics) ? album.musics.length : 0} tracks
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

export default ProfilePage;
