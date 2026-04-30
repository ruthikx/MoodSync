import { demoCovers, moods } from './constants';

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

export function initials(name = 'MoodSync') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function inferMood(seed = '') {
  const value = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return moods[(value % (moods.length - 1)) + 1];
}

export function enrichSong(song, index = 0) {
  const artistName =
    typeof song.artist === 'object'
      ? song.artist?.username || song.artist?.email || 'Unknown artist'
      : song.artist || 'Unknown artist';

  return {
    id: song._id || song.id || `song-${index}`,
    title: song.title || 'Untitled track',
    artistName,
    artistId: song.artist?._id || song.artist?.id || song.artist || null,
    uri: song.uri || '',
    mood: song.mood || inferMood(`${song.title}-${artistName}`),
    duration: song.duration || 180 + ((index * 17) % 100),
    cover:
      song.cover ||
      demoCovers[index % demoCovers.length] ||
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
    raw: song,
  };
}

export function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
}
