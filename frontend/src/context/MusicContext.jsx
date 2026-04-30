import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { musicService } from '../services/musicService';
import { libraryService } from '../services/libraryService';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [likes, setLikes] = useState([]);
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedMood, setSelectedMood] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadLibrary() {
      try {
        const [fetchedSongs, fetchedAlbums, fetchedLikes, fetchedHistory, fetchedPlaylists] =
          await Promise.all([
            musicService.fetchSongs(),
            musicService.fetchAlbums().catch(() => []),
            libraryService.fetchLikes(),
            libraryService.fetchHistory(),
            libraryService.fetchPlaylists(),
          ]);

        if (!mounted) {
          return;
        }

        setSongs(fetchedSongs);
        setAlbums(fetchedAlbums);
        setLikes(fetchedLikes);
        setHistory(fetchedHistory);
        setPlaylists(fetchedPlaylists);
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || 'Could not load the music library.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadLibrary();
    return () => {
      mounted = false;
    };
  }, []);

  async function refreshSongs(mood = selectedMood) {
    setLoading(true);
    setError('');
    try {
      const nextSongs =
        mood === 'all' ? await musicService.fetchSongs() : await musicService.fetchSongsByMood(mood);
      setSongs(nextSongs);
      setSelectedMood(mood);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to refresh songs right now.');
    } finally {
      setLoading(false);
    }
  }

  async function toggleLike(song) {
    const nextLikes = await libraryService.toggleLike(song);
    setLikes(nextLikes);
  }

  function addToHistory(song) {
    const nextHistory = libraryService.saveHistory(song);
    setHistory(nextHistory);
  }

  async function createPlaylist(title) {
    const playlist = await libraryService.createPlaylist(title);
    setPlaylists((current) => [playlist, ...current.filter((item) => item.id !== playlist.id)]);
  }

  async function uploadMusic(payload) {
    const song = await musicService.uploadMusic(payload);
    setSongs((current) => [song, ...current]);
    return song;
  }

  async function createAlbum(payload) {
    const album = await musicService.createAlbum(payload);
    setAlbums((current) => [album, ...current]);
    return album;
  }

  async function addSongToPlaylist(playlistId, song) {
    const playlist = playlists.find((item) => item.id === playlistId);
    if (!playlist) {
      return;
    }
    const exists = playlist.songs.find((item) => item.id === song.id);
    if (exists) {
      return;
    }
    const updated = await libraryService.updatePlaylist(playlistId, [song, ...playlist.songs]);
    setPlaylists((current) =>
      current.map((item) => (item.id === playlistId ? updated : item)),
    );
  }

  async function removeSongFromPlaylist(playlistId, songId) {
    const updated = await libraryService.removeSongFromPlaylist(playlistId, songId);
    setPlaylists((current) =>
      current.map((item) => (item.id === playlistId ? updated : item)),
    );
  }

  const value = useMemo(
    () => ({
      songs,
      albums,
      likes,
      history,
      playlists,
      selectedMood,
      loading,
      error,
      refreshSongs,
      toggleLike,
      addToHistory,
      createPlaylist,
      uploadMusic,
      createAlbum,
      addSongToPlaylist,
      removeSongFromPlaylist,
      setSelectedMood,
    }),
    [songs, albums, likes, history, playlists, selectedMood, loading, error],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
