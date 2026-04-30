import { useEffect, useMemo, useState } from 'react';
import { getSocket } from '../services/socketService';
import { roomEvents } from '../lib/constants';

export function useSocketRoom(roomId, enabled = true) {
  const socket = useMemo(() => getSocket(), []);
  const [connected, setConnected] = useState(socket.connected);
  const [members, setMembers] = useState([]);
  const [roomState, setRoomState] = useState({
    isPlaying: false,
    currentTime: 0,
    songId: null,
  });

  useEffect(() => {
    if (!enabled || !roomId) {
      return undefined;
    }

    function handleConnect() {
      setConnected(true);
      socket.emit(roomEvents.JOIN, { roomId });
      socket.emit(roomEvents.STATE_REQUEST, { roomId });
    }

    function handleDisconnect() {
      setConnected(false);
    }

    function handleStateUpdate(payload) {
      setRoomState((current) => ({ ...current, ...payload }));
      if (payload.members) {
        setMembers(payload.members);
      }
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on(roomEvents.STATE_UPDATE, handleStateUpdate);

    socket.connect();
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off(roomEvents.STATE_UPDATE, handleStateUpdate);
    };
  }, [socket, roomId, enabled]);

  function emitRoomEvent(event, payload) {
    if (!roomId) {
      return;
    }
    socket.emit(event, { roomId, ...payload });
  }

  return {
    connected,
    members,
    roomState,
    emitRoomEvent,
  };
}
