import { Check, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlayQueue } from '@/hooks/usePlayQueue';
import type { AudioContent } from '@/types';

interface QueueButtonProps {
  track: AudioContent;
  size?: 'sm' | 'default';
  variant?: 'ghost' | 'outline' | 'default';
}

export function QueueButton({ 
  track, 
  size = 'default', 
  variant = 'outline' 
}: QueueButtonProps) {
  const { queue, addToQueue } = usePlayQueue();
  
  const isInQueue = queue.some(item => item.id === track.id);

  const handleAddToQueue = () => {
    if (!isInQueue) {
      addToQueue(track);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToQueue}
      className={`relative h-12 px-4 transition-all duration-300 transform hover:scale-105 ${
        isInQueue 
          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30' 
          : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-[rgb(var(--primary))]/10 hover:border-[rgb(var(--primary))]/30 shadow-md'
      }`}
      disabled={isInQueue}
    >
      <div className="flex items-center gap-2">
        {isInQueue ? (
          <>
            <Check className="h-4 w-4" />
            <span className="font-medium">Added</span>
          </>
        ) : (
          <>
            <List className="h-4 w-4" />
            <span className="font-medium">Add to Queue</span>
          </>
        )}
      </div>
      
      {isInQueue && (
        <Badge 
          variant="secondary" 
          className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-green-500 text-white border-0"
        >
          ✓
        </Badge>
      )}
    </Button>
  );
}
