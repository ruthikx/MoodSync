import { useEffect, useState } from 'react';
import SectionHeading from '../components/ui/SectionHeading';
import { useMusic } from '../context/MusicContext';
import { usePlayer } from '../context/PlayerContext';
import { useSocketRoom } from '../hooks/useSocketRoom';
import { roomEvents } from '../lib/constants';

function ListeningRoomPage() {
  const [roomId, setRoomId] = useState('global-room');
  const { songs } = useMusic();
  const { currentSong, isPlaying, progress, playSong, togglePlayback, seekTo } = usePlayer();
  const { connected, members, roomState, emitRoomEvent } = useSocketRoom(roomId, Boolean(roomId));

  useEffect(() => {
    if (!roomState.songId) {
      return;
    }

    if (currentSong?.id !== roomState.songId) {
      const nextSong = songs.find((song) => song.id === roomState.songId);
      if (nextSong) {
        playSong(nextSong, songs);
      }
    }

    if (Math.abs(progress - roomState.currentTime) > 2) {
      seekTo(roomState.currentTime || 0);
    }
  }, [roomState, songs, currentSong, playSong, progress, seekTo]);

  function syncPlayPause() {
    if (!currentSong) {
      return;
    }
    togglePlayback();
    emitRoomEvent(isPlaying ? roomEvents.PAUSE : roomEvents.PLAY, {
      songId: currentSong.id,
      currentTime: progress,
      isPlaying: !isPlaying,
    });
  }

  function syncSeek(event) {
    const value = Number(event.target.value);
    seekTo(value);
    emitRoomEvent(roomEvents.SEEK, {
      songId: currentSong?.id,
      currentTime: value,
    });
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Listening rooms"
        title="Realtime shared playback"
        description="Join a room and broadcast play, pause, and seek updates. The UI will sync with any Socket.io server that emits compatible room state events."
      />

      <div className="glass-panel rounded-[2rem] p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label>
            <span className="mb-2 block text-sm text-slate-300">Room ID</span>
            <input
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none"
            />
          </label>
          <div className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300">
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Room playback</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">
              {currentSong?.title || 'Pick a song from Home first'}
            </p>
            <p className="mt-1 text-sm text-slate-500">{currentSong?.artistName || 'No active track'}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={syncPlayPause}
                disabled={!currentSong}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
              >
                {isPlaying ? 'Pause for room' : 'Play for room'}
              </button>
            </div>

            <div className="mt-5">
              <input
                type="range"
                min="0"
                max={currentSong?.duration || 0}
                value={progress}
                onChange={syncSeek}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10"
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Room state</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span>{roomState.isPlaying ? 'Playing' : 'Paused'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Synced time</span>
                <span>{Math.round(roomState.currentTime || 0)}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Members</span>
                <span>{members.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListeningRoomPage;
