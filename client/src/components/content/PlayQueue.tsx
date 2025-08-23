import { List, Music, Pause, Play, SkipBack, SkipForward, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AudioContent } from '@/types';

interface PlayQueueProps {
  queue: AudioContent[];
  currentTrack: AudioContent | null;
  isPlaying: boolean;
  onPlay: (track: AudioContent) => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRemoveFromQueue: (index: number) => void;
  onMoveInQueue: (fromIndex: number, toIndex: number) => void;
  onClearQueue: () => void;
  isVisible: boolean;
  onClose: () => void;
}

export function PlayQueue({
  queue,
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onRemoveFromQueue,
  onClearQueue,
  isVisible,
}: PlayQueueProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = () => '🎵';

  return (
    <div className='fixed bottom-20 right-4 z-50 w-80'>
      <Card className='shadow-2xl border-[rgb(var(--border))] bg-[rgb(var(--background))]/95 backdrop-blur-sm'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <List className='h-4 w-4 text-[rgb(var(--primary))]' />
              <CardTitle className='text-sm font-semibold'>Play Queue</CardTitle>
              <Badge variant='secondary' className='text-xs'>
                {queue.length}
              </Badge>
            </div>
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsExpanded(!isExpanded)}
                className='h-6 w-6 p-0'
              >
                {isExpanded ? <X className='h-3 w-3' /> : <List className='h-3 w-3' />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className='pt-0'>
            {/* Current Track */}
            {currentTrack && (
              <div className='mb-4'>
                <div className='text-xs font-medium text-[rgb(var(--text-secondary))] mb-2'>
                  Now Playing
                </div>
                <div className='flex items-center gap-3 p-3 rounded-lg bg-[rgb(var(--primary))]/5 border border-[rgb(var(--primary))]/10'>
                  <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(var(--primary))]/20 to-[rgb(var(--primary))]/5 flex items-center justify-center text-sm'>
                    {getTypeIcon()}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-[rgb(var(--text-primary))] truncate text-sm'>
                      {currentTrack.title}
                    </p>
                    <p className='text-xs text-[rgb(var(--text-secondary))]'>
                      {currentTrack.language.toUpperCase()} • {formatTime(currentTrack.duration)}
                    </p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button variant='ghost' size='sm' onClick={onPrevious} className='h-6 w-6 p-0'>
                      <SkipBack className='h-3 w-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={isPlaying ? onPause : () => onPlay(currentTrack)}
                      className='h-6 w-6 p-0'
                    >
                      {isPlaying ? <Pause className='h-3 w-3' /> : <Play className='h-3 w-3' />}
                    </Button>
                    <Button variant='ghost' size='sm' onClick={onNext} className='h-6 w-6 p-0'>
                      <SkipForward className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Queue List */}
            {queue.length > 0 && (
              <>
                <Separator className='mb-3' />
                <div className='space-y-2 max-h-64 overflow-y-auto'>
                  {queue.map((track, index) => (
                    <div
                      key={`${track.id}-${index}`}
                      className='flex items-center gap-3 p-2 rounded-lg hover:bg-[rgb(var(--background-secondary))] transition-colors group'
                    >
                      <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--primary))]/20 to-[rgb(var(--primary))]/5 flex items-center justify-center text-xs'>
                        {getTypeIcon()}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-[rgb(var(--text-primary))] truncate text-sm'>
                          {track.title}
                        </p>
                        <p className='text-xs text-[rgb(var(--text-secondary))]'>
                          {track.language.toUpperCase()} • {formatTime(track.duration)}
                        </p>
                      </div>
                      <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onPlay(track)}
                          className='h-6 w-6 p-0'
                        >
                          <Play className='h-3 w-3' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onRemoveFromQueue(index)}
                          className='h-6 w-6 p-0 text-red-500 hover:text-red-600'
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Queue Actions */}
                <Separator className='my-3' />
                <div className='flex justify-between items-center'>
                  <Button variant='outline' size='sm' onClick={onClearQueue} className='text-xs'>
                    Clear Queue
                  </Button>
                  <div className='text-xs text-[rgb(var(--text-secondary))]'>
                    {queue.length} track{queue.length !== 1 ? 's' : ''} in queue
                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {queue.length === 0 && !currentTrack && (
              <div className='text-center py-8'>
                <Music className='h-8 w-8 text-[rgb(var(--text-secondary))] mx-auto mb-2' />
                <p className='text-sm text-[rgb(var(--text-secondary))]'>Queue is empty</p>
                <p className='text-xs text-[rgb(var(--text-secondary))] mt-1'>
                  Add tracks from your library to start listening
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
