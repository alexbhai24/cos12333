import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import _ReactPlayer from 'react-player';
import { useAuth } from './AuthContext';

const ReactPlayer = (_ReactPlayer as any).default || _ReactPlayer;

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  imageUrl: string;
}

interface MusicContextType {
  tracks: MusicTrack[];
  currentIdx: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: boolean;
  showPlaylist: boolean;
  currentTrack: MusicTrack | null;
  handlePlayPause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleSelectTrack: (idx: number) => void;
  handleProgressSeek: (ratio: number) => void;
  handleSaveTrack: (track: MusicTrack, editingIdx: number | null) => void;
  handleDeleteTrack: (idx: number) => void;
  setVolume: (v: number) => void;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  setShuffle: React.Dispatch<React.SetStateAction<boolean>>;
  setRepeat: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPlaylist: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const userKey = currentUser?.uid || currentUser?.email || 'guest';

  const loadUserTracks = useCallback((key: string): MusicTrack[] => {
    if (key === 'guest') return [];
    try {
      const raw = localStorage.getItem(`cosmicbone_music_playlist_${key}`);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as MusicTrack[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const [tracks, setTracks] = useState<MusicTrack[]>(() => loadUserTracks(userKey));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);

  const playerRef = useRef<any>(null);

  useEffect(() => {
    const loaded = loadUserTracks(userKey);
    setTracks(loaded);
    setCurrentIdx(0);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [userKey, loadUserTracks]);

  const saveUserTracks = (newTracks: MusicTrack[]) => {
    setTracks(newTracks);
    if (userKey !== 'guest') {
      localStorage.setItem(`cosmicbone_music_playlist_${userKey}`, JSON.stringify(newTracks));
    }
  };

  const currentTrack = tracks[currentIdx] ?? null;

  const handlePlayPause = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    if (!tracks.length) return;
    if (repeat) {
      playerRef.current?.seekTo(0);
      setIsPlaying(true);
      return;
    }
    if (shuffle) {
      let next = Math.floor(Math.random() * tracks.length);
      if (tracks.length > 1 && next === currentIdx) next = (next + 1) % tracks.length;
      setCurrentIdx(next);
    } else {
      setCurrentIdx((i) => (i + 1) % tracks.length);
    }
    setIsPlaying(true);
  }, [tracks, currentIdx, shuffle, repeat]);

  const handlePrev = useCallback(() => {
    if (currentTime > 3) {
      playerRef.current?.seekTo(0);
      return;
    }
    setCurrentIdx((i) => (i - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  }, [currentTime, tracks.length]);

  const handleSelectTrack = (idx: number) => {
    setCurrentIdx(idx);
    setIsPlaying(true);
  };

  const handleProgressSeek = (ratio: number) => {
    playerRef.current?.seekTo(ratio, 'fraction');
  };

  const handleSaveTrack = (track: MusicTrack, editingIdx: number | null) => {
    let updated: MusicTrack[];
    let switchToIdx = currentIdx;
    if (editingIdx !== null) {
      updated = tracks.map((t, i) => (i === editingIdx ? track : t));
      if (editingIdx === currentIdx) switchToIdx = editingIdx;
    } else {
      updated = [...tracks, track];
      switchToIdx = updated.length - 1;
    }
    saveUserTracks(updated);
    setCurrentIdx(switchToIdx);
  };

  const handleDeleteTrack = (idxToDelete: number) => {
    const updated = tracks.filter((_, i) => i !== idxToDelete);
    saveUserTracks(updated);
    if (currentIdx >= updated.length) {
      setCurrentIdx(Math.max(0, updated.length - 1));
    }
    if (updated.length === 0) {
      setIsPlaying(false);
    }
  };

  // Media Session API for background OS controls
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist || 'CosmicBone',
        artwork: currentTrack.imageUrl ? [{ src: currentTrack.imageUrl }] : []
      });
      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
      navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    } catch {}
  }, [currentTrack, handleNext, handlePrev]);

  // Auto-pause ONLY when other media explicitly starts playing in the app
  useEffect(() => {
    const handleOtherMediaPlay = (e: Event) => {
      const target = e.target as HTMLElement;
      const playerContainer = document.getElementById('cosmicbone-music-player-container');
      if (target && playerContainer && !playerContainer.contains(target)) {
        setIsPlaying(false);
      }
    };
    document.addEventListener('play', handleOtherMediaPlay, true);
    return () => {
      document.removeEventListener('play', handleOtherMediaPlay, true);
    };
  }, []);

  return (
    <MusicContext.Provider
      value={{
        tracks,
        currentIdx,
        isPlaying,
        progress,
        duration,
        currentTime,
        volume,
        isMuted,
        shuffle,
        repeat,
        showPlaylist,
        currentTrack,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleSelectTrack,
        handleProgressSeek,
        handleSaveTrack,
        handleDeleteTrack,
        setVolume,
        setIsMuted,
        setShuffle,
        setRepeat,
        setShowPlaylist,
        setIsPlaying,
      }}
    >
      {children}

      {/* Global persistent off-screen player engine */}
      <div
        id="cosmicbone-music-player-container"
        style={{
          position: 'fixed',
          bottom: '-200px',
          right: '-200px',
          width: '1px',
          height: '1px',
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -9999
        }}
      >
        <ReactPlayer
          ref={playerRef}
          url={currentTrack?.audioUrl}
          playing={isPlaying}
          volume={isMuted ? 0 : volume}
          playsinline={true}
          onProgress={(state: any) => {
            setProgress(state.played);
            setCurrentTime(state.playedSeconds);
            if ('mediaSession' in navigator && duration > 0) {
              try {
                navigator.mediaSession.setPositionState({
                  duration: Math.max(duration, state.playedSeconds),
                  playbackRate: 1,
                  position: state.playedSeconds,
                });
              } catch {}
            }
          }}
          onDuration={(d: number) => setDuration(d)}
          onEnded={handleNext}
          width="1px"
          height="1px"
          config={{
            file: {
              attributes: {
                playsInline: true,
                controlsList: 'nodownload',
              }
            },
            youtube: {
              playerVars: { showinfo: 1, playsinline: 1 } as any
            }
          } as any}
        />
      </div>
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
};
