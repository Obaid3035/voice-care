import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AudioContent } from '@/types';

interface PlayQueueContextType {
  queue: AudioContent[];
  currentTrack: AudioContent | null;
  isPlaying: boolean;
  isPlayerVisible: boolean;
  isQueueVisible: boolean;
  audioElement: HTMLAudioElement | null;
  addToQueue: (track: AudioContent) => void;
  removeFromQueue: (index: number) => void;
  moveInQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  playTrack: (track: AudioContent) => void;
  pauseTrack: () => void;
  clearCurrentTrack: () => void;
  hidePlayer: () => void;
  showPlayer: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleQueueVisibility: () => void;
  setQueueVisibility: (visible: boolean) => void;
}

const PlayQueueContext = createContext<PlayQueueContextType | undefined>(undefined);

export function PlayQueueProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<AudioContent[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isQueueVisible, setIsQueueVisible] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create a playlist that includes current track + queue for navigation
  const playlist = useMemo(() => {
    if (!currentTrack) return queue;
    return [currentTrack, ...queue];
  }, [currentTrack, queue]);

  const playTrack = useCallback(
    (track: AudioContent) => {
      // If it's the same track that's currently playing, just resume
      if (currentTrack && currentTrack.id === track.id) {
        if (audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
        setIsPlaying(true);
        return;
      }

      // Otherwise, set new track and play
      setCurrentTrack(track);
      setIsPlaying(true);
      setIsPlayerVisible(true);

      // Remove the track from queue when it starts playing
      setQueue((prev) => prev.filter((item) => item.id !== track.id));

      // Play the audio
      if (audioRef.current) {
        audioRef.current.src = track.audio_url || '';
        audioRef.current.play().catch(console.error);
      }
    },
    [currentTrack]
  );
  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next track if available
      if (playlist.length > 1) {
        const currentIndex = playlist.findIndex((track) => track.id === currentTrack?.id);
        const nextIndex =
          currentIndex === -1 || currentIndex === playlist.length - 1 ? 0 : currentIndex + 1;
        const nextTrack = playlist[nextIndex];
        if (nextTrack) {
          playTrack(nextTrack);
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [playlist, currentTrack, playTrack]);

  const addToQueue = useCallback((track: AudioContent) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveInQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueue((prev) => {
      const newQueue = [...prev];
      const [movedItem] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedItem);
      return newQueue;
    });
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const clearCurrentTrack = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsPlayerVisible(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  const hidePlayer = useCallback(() => {
    setIsPlayerVisible(false);
  }, []);

  const showPlayer = useCallback(() => {
    if (currentTrack) {
      setIsPlayerVisible(true);
    }
  }, [currentTrack]);

  const nextTrack = useCallback(() => {
    if (playlist.length <= 1) return;

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack?.id);
    const nextIndex =
      currentIndex === -1 || currentIndex === playlist.length - 1 ? 0 : currentIndex + 1;

    const nextTrack = playlist[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  }, [playlist, currentTrack, playTrack]);

  const previousTrack = useCallback(() => {
    if (playlist.length <= 1) return;

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack?.id);
    const prevIndex =
      currentIndex === -1 || currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;

    const prevTrack = playlist[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack);
    }
  }, [playlist, currentTrack, playTrack]);

  const toggleQueueVisibility = useCallback(() => {
    setIsQueueVisible((prev) => !prev);
  }, []);

  const setQueueVisibility = useCallback((visible: boolean) => {
    setIsQueueVisible(visible);
  }, []);

  const value: PlayQueueContextType = {
    queue,
    currentTrack,
    isPlaying,
    isPlayerVisible,
    isQueueVisible,
    audioElement: audioRef.current,
    addToQueue,
    removeFromQueue,
    moveInQueue,
    clearQueue,
    playTrack,
    pauseTrack,
    clearCurrentTrack,
    hidePlayer,
    showPlayer,
    nextTrack,
    previousTrack,
    toggleQueueVisibility,
    setQueueVisibility,
  };

  return (
    <PlayQueueContext.Provider value={value}>
      {children}
      {/* biome-ignore lint/a11y/useMediaCaption: Background audio element for programmatic playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </PlayQueueContext.Provider>
  );
}

export function usePlayQueue() {
  const context = useContext(PlayQueueContext);
  if (context === undefined) {
    throw new Error('usePlayQueue must be used within a PlayQueueProvider');
  }
  return context;
}
