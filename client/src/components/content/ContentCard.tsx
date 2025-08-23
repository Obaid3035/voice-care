import { Calendar, Clock, MoreVertical, Pause, Play, Trash2, User } from 'lucide-react';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePlayQueue } from '@/hooks/usePlayQueue';
import type { AudioContent } from '@/types';
import { QueueButton } from './QueueButton';

interface ContentCardProps {
  content: AudioContent;
  onDelete: (id: string) => void;
}

const getTypeIcon = () => {
  return '🎵';
};

const getTypeGradient = () => {
  return 'from-blue-500/20 via-indigo-500/10 to-blue-400/20';
};

const getTypeBadgeColor = () => {
  return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export function ContentCard({ content, onDelete }: ContentCardProps) {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = usePlayQueue();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentTrackPlaying = currentTrack?.id === content.id && isPlaying;

  return (
    <Card
      className='group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getTypeGradient()} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
      />

      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-8 animate-pulse' />
      </div>

      {isCurrentTrackPlaying && (
        <div className='absolute top-4 right-4 z-20'>
          <div className='flex items-center gap-2 bg-red-500/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg'>
            <div className='flex items-center gap-0.5'>
              <div className='w-1 h-3 bg-white rounded-full animate-pulse' />
              <div className='w-1 h-4 bg-white rounded-full animate-pulse delay-100' />
              <div className='w-1 h-2 bg-white rounded-full animate-pulse delay-200' />
            </div>
            <span className='text-white text-xs font-semibold'>NOW PLAYING</span>
          </div>
        </div>
      )}

      <CardContent className='relative p-6 h-full flex flex-col z-10'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-14 h-14 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-300'>
              {getTypeIcon()}
            </div>
          </div>

          <div
            className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size='sm'
                  variant='ghost'
                  className='h-9 w-9 p-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-md border border-white/20'
                >
                  <MoreVertical className='h-4 w-4 text-gray-700 dark:text-gray-300' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl'>
                <DropdownMenuSeparator className='bg-gray-200/50 dark:bg-gray-700/50' />
                <DropdownMenuItem
                  onClick={() => onDelete(content.id)}
                  className='text-red-600 hover:bg-red-50/80 dark:hover:bg-red-950/20 focus:bg-red-50/80'
                >
                  <Trash2 className='h-4 w-4 mr-3' />
                  Delete content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className='mb-4 flex-1'>
          <h3 className='font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-[rgb(var(--primary))] transition-colors duration-300'>
            {content.title}
          </h3>
        </div>

        <div className='mb-4'>
          <Badge
            variant='outline'
            className={`text-xs font-semibold px-3 py-1 ${getTypeBadgeColor()} shadow-sm`}
          >
            Audio
          </Badge>
        </div>

        <div className='space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              <span className='font-medium'>
                {typeof content.duration === 'number'
                  ? `${Math.floor(content.duration / 60)}:${(content.duration % 60).toString().padStart(2, '0')}`
                  : content.duration}
              </span>
            </div>
            <div className='w-1 h-1 bg-gray-300 rounded-full' />
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span>{formatDate(content.created_at)}</span>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4' />
              <span>{content.language.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col gap-3'>
          <Button
            onClick={() => (isCurrentTrackPlaying ? pauseTrack() : playTrack(content))}
            className={`w-full h-12 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
              isCurrentTrackPlaying
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/30'
                : 'bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--primary-dark))] hover:from-[rgb(var(--primary-dark))] hover:to-[rgb(var(--primary))] text-white shadow-[rgb(var(--primary))]/30'
            }`}
          >
            <div className='flex items-center gap-3'>
              {isCurrentTrackPlaying ? <Pause className='h-6 w-6' /> : <Play className='h-6 w-6' />}
              <span>{isCurrentTrackPlaying ? 'Pause' : 'Play Now'}</span>
            </div>
          </Button>

          <QueueButton track={content} />
        </div>
      </CardContent>

      {/* Hover Glow Effect */}
      <div className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-[rgb(var(--primary))] to-transparent' />
    </Card>
  );
}
