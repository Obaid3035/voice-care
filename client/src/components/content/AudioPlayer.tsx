import {
    ChevronDown,
    ChevronUp,
    Download,
    List,
    Maximize2,
    Minimize2,
    MoreHorizontal,
    Pause,
    Play,
    Repeat,
    Share2,
    Shuffle,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import type { AudioContent, AudioPlayerState } from '@/types';
import { usePlayQueue } from '@/hooks/usePlayQueue';

interface AudioPlayerProps {
  track: AudioContent;
  isVisible: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  playlist?: AudioContent[];
}

const getTypeIcon = () => {
  return '🎵';
};

export function AudioPlayer({
  track,
  isVisible,
  onClose,
  onNext,
  onPrevious,
  playlist = [],
}: AudioPlayerProps) {
  const { isPlaying, playTrack, pauseTrack, audioElement } = usePlayQueue();
  
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 75,
    isMuted: false,
    isLoading: false,
    isRepeat: false,
    isShuffle: false,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Prevent body scroll when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isFullscreen]);

  // Initialize when track changes
  useEffect(() => {
    if (track) {
      console.log('AudioPlayer: Track changed', {
        title: track.title,
        audio_url: track.audio_url,
      });

      setPlayerState((prev) => ({
        ...prev,
        currentTime: 0,
        isPlaying: false,
        isLoading: true,
      }));
    }
  }, [track]);

  // Sync player state with context
  useEffect(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying }));
  }, [isPlaying]);

  // Update progress
  useEffect(() => {
    const audio = audioElement;
    if (!audio) return;

    const updateProgress = () => {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
        isLoading: false,
      }));
    };

    const handleEnded = () => {
      if (playerState.isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else if (onNext) {
        onNext();
      }
    };

    const handleLoadStart = () => {
      setPlayerState((prev) => ({ ...prev, isLoading: true }));
    };

    const handleCanPlay = () => {
      setPlayerState((prev) => ({ ...prev, isLoading: false }));
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [playerState.isRepeat, onNext]);

  const togglePlay = async () => {
    if (!track) {
      console.log('AudioPlayer: Cannot play - track is null');
      return;
    }

    try {
      if (isPlaying) {
        pauseTrack();
      } else {
        playTrack(track);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioElement;
    if (!audio || !track) return;

    const newTime = (value[0] / 100) * playerState.duration;
    audio.currentTime = newTime;
    setPlayerState((prev) => ({ ...prev, currentTime: newTime }));
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioElement;
    const newVolume = value[0];

    setPlayerState((prev) => ({
      ...prev,
      volume: newVolume,
      isMuted: newVolume === 0,
    }));

    if (audio) {
      audio.volume = newVolume / 100;
    }
  };

  const toggleMute = () => {
    const audio = audioElement;
    if (!audio) return;

    if (playerState.isMuted) {
      audio.volume = playerState.volume / 100;
      setPlayerState((prev) => ({ ...prev, isMuted: false }));
    } else {
      audio.volume = 0;
      setPlayerState((prev) => ({ ...prev, isMuted: true }));
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Like functionality removed - not available in current data structure

  const handleDragHandleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDragHandleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFullscreen(false);
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsFullscreen(false);
    }
  };

  // Prevent scroll events from bubbling when in fullscreen
  const handleFullscreenScroll = (e: React.WheelEvent) => {
    if (isFullscreen) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const progressPercentage =
    playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0;

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      {isFullscreen && (
        <div
          className='fixed inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-xl z-40'
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
          onWheel={handleFullscreenScroll}
          role='button'
          tabIndex={0}
          aria-label='Close fullscreen player'
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Audio Player */}
      <div
        className={`fixed z-50 transition-all duration-500 ${
          isFullscreen ? 'inset-4 md:inset-8' : 'bottom-0 left-0 right-0'
        }`}
        onWheel={handleFullscreenScroll}
        style={isFullscreen ? { touchAction: 'none' } : {}}
      >
        <Card
          className={`border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden ${
            isFullscreen ? 'rounded-3xl h-full' : 'rounded-t-3xl'
          }`}
        >
          {/* Drag Handle */}
          {!isFullscreen && (
            <div className='flex justify-center pt-3 pb-2'>
              <div
                className='w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full opacity-50 hover:opacity-100 transition-opacity cursor-pointer'
                onClick={handleDragHandleClick}
                onKeyDown={handleDragHandleKeyDown}
                role='button'
                tabIndex={0}
                aria-label='Toggle player expansion'
              />
            </div>
          )}

          {/* Main Player Content */}
          <div
            className={`${isFullscreen ? 'p-8 h-full flex flex-col' : 'px-6 pb-6'} ${!isExpanded && !isFullscreen ? 'pb-4' : ''}`}
          >
            {/* Header Controls */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                {!isFullscreen && (
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => setIsExpanded(!isExpanded)}
                    className='h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
                  >
                    {isExpanded ? (
                      <ChevronDown className='h-4 w-4' />
                    ) : (
                      <ChevronUp className='h-4 w-4' />
                    )}
                  </Button>
                )}
                <h3 className='font-semibold text-gray-900 dark:text-white'>Now Playing</h3>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className='h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  <List className='h-4 w-4' />
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className='h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  {isFullscreen ? (
                    <Minimize2 className='h-4 w-4' />
                  ) : (
                    <Maximize2 className='h-4 w-4' />
                  )}
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={onClose}
                  className='h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Track Information */}
            <div className={`flex items-center gap-6 mb-6 ${isFullscreen ? 'justify-center' : ''}`}>
              {/* Album Art */}
              <div
                className={`rounded-2xl bg-gradient-to-br from-[rgb(var(--primary))]/20 to-[rgb(var(--primary))]/5 flex items-center justify-center shadow-lg ${
                  isFullscreen ? 'w-32 h-32 text-6xl' : 'w-16 h-16 text-3xl'
                }`}
              >
                {getTypeIcon()}
              </div>

              {/* Track Details */}
              <div className={`flex-1 min-w-0 ${isFullscreen ? 'text-center' : ''}`}>
                <h2
                  className={`font-bold text-gray-900 dark:text-white mb-2 ${
                    isFullscreen ? 'text-3xl' : 'text-xl'
                  } truncate`}
                >
                  {track.title}
                </h2>
                <div className='flex items-center gap-3 mb-3 justify-center'>
                  <Badge
                    variant='outline'
                    className='bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] border-[rgb(var(--primary))]/20'
                  >
                    Audio
                  </Badge>
                </div>
                {!isFullscreen && (
                  <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                    <span>{track.language.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className='mb-6'>
              <div className='mb-3'>
                <Slider
                  value={[progressPercentage]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={0.1}
                  className='w-full'
                />
              </div>
              <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
                <span>{formatTime(playerState.currentTime)}</span>
                <span>{formatTime(playerState.duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div
              className={`flex items-center justify-center gap-6 mb-6 ${isFullscreen ? 'gap-8' : ''}`}
            >
              <Button
                size='sm'
                variant='ghost'
                onClick={() =>
                  setPlayerState((prev) => ({
                    ...prev,
                    isShuffle: !prev.isShuffle,
                  }))
                }
                className={`h-10 w-10 p-0 rounded-full ${
                  playerState.isShuffle
                    ? 'text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Shuffle className='h-4 w-4' />
              </Button>

              <Button
                size='sm'
                variant='ghost'
                onClick={onPrevious}
                disabled={!onPrevious}
                className={`${isFullscreen ? 'h-14 w-14' : 'h-12 w-12'} p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50`}
              >
                <SkipBack className={isFullscreen ? 'h-6 w-6' : 'h-5 w-5'} />
              </Button>

              <Button
                onClick={togglePlay}
                disabled={playerState.isLoading}
                className={`${isFullscreen ? 'h-20 w-20' : 'h-16 w-16'} p-0 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--primary-dark))] text-white hover:from-[rgb(var(--primary-dark))] hover:to-[rgb(var(--primary))] shadow-xl shadow-[rgb(var(--primary))]/25 transition-all duration-300 hover:scale-105 disabled:opacity-50`}
              >
                {playerState.isLoading ? (
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white' />
                ) : playerState.isPlaying ? (
                  <Pause className={isFullscreen ? 'h-10 w-10' : 'h-8 w-8'} />
                ) : (
                  <Play className={`${isFullscreen ? 'h-10 w-10' : 'h-8 w-8'} ml-1`} />
                )}
              </Button>

              <Button
                size='sm'
                variant='ghost'
                onClick={onNext}
                disabled={!onNext}
                className={`${isFullscreen ? 'h-14 w-14' : 'h-12 w-12'} p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50`}
              >
                <SkipForward className={isFullscreen ? 'h-6 w-6' : 'h-5 w-5'} />
              </Button>

              <Button
                size='sm'
                variant='ghost'
                onClick={() =>
                  setPlayerState((prev) => ({
                    ...prev,
                    isRepeat: !prev.isRepeat,
                  }))
                }
                className={`h-10 w-10 p-0 rounded-full ${
                  playerState.isRepeat
                    ? 'text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Repeat className='h-4 w-4' />
              </Button>
            </div>

            {/* Secondary Controls */}
            {(isExpanded || isFullscreen) && (
              <div className='flex items-center justify-between'>
                {/* Volume Control */}
                <div className='flex items-center gap-3 flex-1 max-w-xs'>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={toggleMute}
                    className='h-8 w-8 p-0 rounded-full'
                  >
                    {playerState.isMuted || playerState.volume === 0 ? (
                      <VolumeX className='h-4 w-4' />
                    ) : (
                      <Volume2 className='h-4 w-4' />
                    )}
                  </Button>
                  <Slider
                    value={[playerState.isMuted ? 0 : playerState.volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className='flex-1'
                  />
                  <span className='text-sm text-gray-500 dark:text-gray-400 w-8 text-right'>
                    {Math.round(playerState.isMuted ? 0 : playerState.volume)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-2'>
                  {/* Like functionality removed - not available in current data structure */}
                  <Button
                    size='sm'
                    variant='ghost'
                    className='h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  >
                    <Share2 className='h-4 w-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  >
                    <Download className='h-4 w-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  >
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}

            {/* Playlist (if expanded and fullscreen) */}
            {showPlaylist && playlist.length > 0 && isFullscreen && (
              <div className='mt-8 flex-1 overflow-hidden'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-4'>
                  Queue ({playlist.length} tracks)
                </h4>
                <div className='space-y-2 overflow-y-auto max-h-64'>
                  {playlist.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        item.id === track.id ? 'bg-[rgb(var(--primary))]/10' : ''
                      }`}
                    >
                      <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--primary))]/20 to-[rgb(var(--primary))]/5 flex items-center justify-center text-sm'>
                        {getTypeIcon()}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-gray-900 dark:text-white truncate'>
                          {item.title}
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                          {item.language.toUpperCase()} • {formatTime(item.duration)}
                        </p>
                      </div>
                      {item.id === track.id && (
                        <div className='flex items-center gap-1'>
                          <div className='w-1 h-3 bg-[rgb(var(--primary))] rounded-full animate-pulse' />
                          <div className='w-1 h-4 bg-[rgb(var(--primary))] rounded-full animate-pulse delay-100' />
                          <div className='w-1 h-2 bg-[rgb(var(--primary))] rounded-full animate-pulse delay-200' />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
