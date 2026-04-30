import { api } from './api';
import { enrichSong } from '../lib/utils';

export const musicService = {
  async fetchSongs() {
    const { data } = await api.get('/music');
    const songs = Array.isArray(data?.musics) ? data.musics : [];
    return songs.map(enrichSong);
  },

  async fetchSongsByMood(mood) {
    const endpoints = [`/music/mood/${mood}`, `/music?mood=${mood}`];
    for (const endpoint of endpoints) {
      try {
        const { data } = await api.get(endpoint);
        const songs = Array.isArray(data?.musics) ? data.musics : Array.isArray(data?.songs) ? data.songs : [];
        if (songs.length) {
          return songs.map(enrichSong);
        }
      } catch (error) {
        if (error.response?.status && error.response.status < 500) {
          continue;
        }
      }
    }

    const songs = await this.fetchSongs();
    return songs.filter((song) => song.mood === mood);
  },

  async fetchAlbums() {
    const { data } = await api.get('/music/albums');
    return data?.albums || [];
  },

  async fetchAlbumById(albumId) {
    const { data } = await api.get(`/music/albums/${albumId}`);
    return data?.album || null;
  },

  async uploadMusic(payload) {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('music', payload.file);

    const { data } = await api.post('/music/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return enrichSong(data?.music || {});
  },

  async createAlbum(payload) {
    const { data } = await api.post('/music/album', {
      title: payload.title,
      musics: payload.musics,
    });
    return data?.album || null;
  },
};
