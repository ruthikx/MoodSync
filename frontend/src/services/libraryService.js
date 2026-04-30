import { api } from './api';
import { safeJsonParse } from '../lib/utils';

const keys = {
  likes: 'moodsync_likes',
  history: 'moodsync_history',
  playlists: 'moodsync_playlists',
};

function readLocal(key, fallback = []) {
  return safeJsonParse(window.localStorage.getItem(key), fallback);
}

function writeLocal(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

async function tryGet(endpoints) {
  for (const endpoint of endpoints) {
    try {
      const { data } = await api.get(endpoint);
      return data;
    } catch (error) {
      if (error.response?.status && error.response.status < 500) {
        continue;
      }
    }
  }
  return null;
}

export const libraryService = {
  async fetchLikes() {
    const data = await tryGet(['/likes', '/music/likes']);
    return data?.likes || readLocal(keys.likes, []);
  },

  async toggleLike(song) {
    const existing = readLocal(keys.likes, []);
    const found = existing.find((item) => item.id === song.id);
    const next = found ? existing.filter((item) => item.id !== song.id) : [song, ...existing];
    writeLocal(keys.likes, next);

    try {
      if (found) {
        await api.delete(`/likes/${song.id}`);
      } else {
        await api.post('/likes', { songId: song.id });
      }
    } catch {
      return next;
    }

    return next;
  },

  async fetchHistory() {
    const data = await tryGet(['/history', '/users/history']);
    return data?.history || readLocal(keys.history, []);
  },

  saveHistory(song) {
    const current = readLocal(keys.history, []);
    const next = [song, ...current.filter((item) => item.id !== song.id)].slice(0, 20);
    return writeLocal(keys.history, next);
  },

  async fetchPlaylists() {
    const data = await tryGet(['/playlists', '/music/playlists']);
    return data?.playlists || readLocal(keys.playlists, []);
  },

  async createPlaylist(title) {
    const playlist = {
      id: `${Date.now()}`,
      title,
      songs: [],
      createdAt: new Date().toISOString(),
    };

    const current = readLocal(keys.playlists, []);
    writeLocal(keys.playlists, [playlist, ...current]);

    try {
      await api.post('/playlists', { title });
    } catch {
      return playlist;
    }

    return playlist;
  },

  async updatePlaylist(playlistId, songs) {
    const current = readLocal(keys.playlists, []);
    const next = current.map((playlist) =>
      playlist.id === playlistId ? { ...playlist, songs } : playlist,
    );
    writeLocal(keys.playlists, next);

    try {
      await api.put(`/playlists/${playlistId}`, { songs: songs.map((song) => song.id) });
    } catch {
      return next.find((playlist) => playlist.id === playlistId);
    }

    return next.find((playlist) => playlist.id === playlistId);
  },

  async removeSongFromPlaylist(playlistId, songId) {
    const current = readLocal(keys.playlists, []);
    const next = current.map((playlist) =>
      playlist.id === playlistId
        ? { ...playlist, songs: playlist.songs.filter((song) => song.id !== songId) }
        : playlist,
    );
    writeLocal(keys.playlists, next);

    try {
      await api.delete(`/playlists/${playlistId}/songs/${songId}`);
    } catch {
      return next.find((playlist) => playlist.id === playlistId);
    }

    return next.find((playlist) => playlist.id === playlistId);
  },
};
