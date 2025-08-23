import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Music, Wifi, WifiOff, Camera, Mic2, Clock, User } from 'lucide-react';
import type { EventLog } from '@/lib/mockData';

interface EventLogCardProps {
  event: EventLog;
}

const getEventIcon = (eventType: EventLog['event_type']) => {
  switch (eventType) {
    case 'cry_detected':
      return <Baby className='h-4 w-4' />;
    case 'content_played':
      return <Music className='h-4 w-4' />;
    case 'device_online':
      return <Wifi className='h-4 w-4' />;
    case 'device_offline':
      return <WifiOff className='h-4 w-4' />;
    case 'snapshot_taken':
      return <Camera className='h-4 w-4' />;
    case 'voice_generated':
      return <Mic2 className='h-4 w-4' />;
    default:
      return <Clock className='h-4 w-4' />;
  }
};

const getEventColor = (eventType: EventLog['event_type']) => {
  switch (eventType) {
    case 'cry_detected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700/50';
    case 'content_played':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700/50';
    case 'device_online':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700/50';
    case 'device_offline':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/50';
    case 'snapshot_taken':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700/50';
    case 'voice_generated':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/50';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-700/50';
  }
};

const getEventTitle = (eventType: EventLog['event_type']) => {
  switch (eventType) {
    case 'cry_detected':
      return 'Cry Detected';
    case 'content_played':
      return 'Content Played';
    case 'device_online':
      return 'Device Online';
    case 'device_offline':
      return 'Device Offline';
    case 'snapshot_taken':
      return 'Snapshot Taken';
    case 'voice_generated':
      return 'Voice Generated';
    default:
      return 'Event';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

const getIntensityColor = (intensity?: number) => {
  if (!intensity) return '';

  if (intensity >= 8) return 'bg-red-500';
  if (intensity >= 6) return 'bg-orange-500';
  if (intensity >= 4) return 'bg-yellow-500';
  return 'bg-green-500';
};

export function EventLogCard({ event }: EventLogCardProps) {
  return (
    <Card className='hover:shadow-lg transition-all duration-200 border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:border-[rgb(var(--primary))]/20 group'>
      <CardContent className='p-6'>
        <div className='flex items-start gap-4'>
          {/* Event Icon */}
          <div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--primary))]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
            {getEventIcon(event.event_type)}
          </div>

          {/* Event Details */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-3 mb-3'>
              <div className='flex items-center gap-3'>
                <Badge
                  variant='outline'
                  className={`text-xs font-semibold px-3 py-1.5 ${getEventColor(event.event_type)}`}
                >
                  {getEventTitle(event.event_type)}
                </Badge>
                {event.intensity && (
                  <div className='flex items-center gap-2 px-2 py-1 bg-[rgb(var(--background-secondary))] rounded-full'>
                    <div className={`w-2 h-2 rounded-full ${getIntensityColor(event.intensity)}`} />
                    <span className='text-xs text-[rgb(var(--text-secondary))] font-medium'>
                      Intensity: {event.intensity}/10
                    </span>
                  </div>
                )}
              </div>
              <span className='text-xs text-[rgb(var(--text-secondary))] whitespace-nowrap font-medium'>
                {formatTimestamp(event.timestamp)}
              </span>
            </div>

            {/* Device and Content Info */}
            <div className='space-y-2 mb-3'>
              {event.device_name && (
                <div className='flex items-center gap-2 text-sm'>
                  <div className='w-6 h-6 rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center'>
                    <User className='h-3 w-3 text-[rgb(var(--primary))]' />
                  </div>
                  <span className='text-[rgb(var(--text-primary))] font-semibold'>
                    {event.device_name}
                  </span>
                </div>
              )}
              {event.content_title && (
                <div className='flex items-center gap-2 text-sm'>
                  <div className='w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
                    <Music className='h-3 w-3 text-green-600 dark:text-green-400' />
                  </div>
                  <span className='text-[rgb(var(--text-primary))] font-medium'>
                    "{event.content_title}"
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <p className='text-sm text-[rgb(var(--text-secondary))] leading-relaxed bg-[rgb(var(--background-secondary))] p-3 rounded-lg'>
                {event.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
