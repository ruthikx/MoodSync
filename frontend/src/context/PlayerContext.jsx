import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { formatTime } from '../lib/utils';
import { useMusic } from './MusicContext';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const { addToHistory } = useMusic();
  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const currentSongRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleLoaded = () => setDuration(audio.duration || currentSongRef.current?.duration || 0);
    const handleTime = () => setProgress(audio.currentTime || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      const activeQueue = queueRef.current;
      const activeSong = currentSongRef.current;
      if (!activeSong || activeQueue.length === 0) {
        return;
      }
      const currentIndex = activeQueue.findIndex((song) => song.id === activeSong.id);
      const nextSong = activeQueue[currentIndex + 1] || activeQueue[0];
      if (nextSong) {
        playSong(nextSong, activeQueue);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  function playSong(song, nextQueue = queue) {
    if (!song?.uri) {
      return;
    }

    if (!audioRef.current) {
      return;
    }

    if (currentSong?.id !== song.id) {
      audioRef.current.src = song.uri;
      setCurrentSong(song);
      setQueue(nextQueue);
      setProgress(0);
      setDuration(song.duration || 0);
      addToHistory(song);
    }

    audioRef.current.play().catch(() => {
      setIsPlaying(false);
    });
    setIsPlaying(true);
  }

  function togglePlayback() {
    if (!audioRef.current || !currentSong) {
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    audioRef.current.play().catch(() => {
      setIsPlaying(false);
    });
    setIsPlaying(true);
  }

  function seekTo(value) {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.currentTime = value;
    setProgress(value);
  }

  function playNext() {
    if (!currentSong || queue.length === 0) {
      return;
    }
    const currentIndex = queue.findIndex((song) => song.id === currentSong.id);
    const nextSong = queue[currentIndex + 1] || queue[0];
    if (nextSong) {
      playSong(nextSong, queue);
    }
  }

  function playPrevious() {
    if (!currentSong || queue.length === 0) {
      return;
    }
    const currentIndex = queue.findIndex((song) => song.id === currentSong.id);
    const previousSong = queue[currentIndex - 1] || queue[queue.length - 1];
    if (previousSong) {
      playSong(previousSong, queue);
    }
  }

  const value = useMemo(
    () => ({
      currentSong,
      isPlaying,
      progress,
      duration,
      progressLabel: formatTime(progress),
      durationLabel: formatTime(duration),
      playSong,
      togglePlayback,
      seekTo,
      playNext,
      playPrevious,
      setQueue,
    }),
    [currentSong, isPlaying, progress, duration, queue],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
