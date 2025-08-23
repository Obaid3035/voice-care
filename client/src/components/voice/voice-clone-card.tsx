import { Clock, Globe, HardDrive, Mic, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { IVoiceClone } from '@/types';

interface VoiceCloneCardProps {
  voiceClone: IVoiceClone;
  onDelete: (id: string) => void;
}

export function VoiceCloneCard({ voiceClone, onDelete }: VoiceCloneCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(voiceClone.id);
      toast.success('Voice clone deleted successfully');
    } catch {
      toast.error('Failed to delete voice clone');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-lg font-semibold flex items-center gap-2'>
              <Mic className='h-5 w-5 text-[#303c6c]' />
              {voiceClone.name}
            </CardTitle>
            <div className='flex items-center gap-2 mt-2'>
              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <Globe className='h-3 w-3' />
                {voiceClone.language}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Voice Clone Details */}
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <HardDrive className='h-4 w-4 text-muted-foreground' />
            <span className='text-muted-foreground'>Size:</span>
            <span className='font-medium'>{formatFileSize(voiceClone.size)}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <span className='text-muted-foreground'>Duration:</span>
            <span className='font-medium'>{formatDuration(voiceClone.duration)}</span>
          </div>
        </div>

        {/* Created Date */}
        <div className='text-xs text-muted-foreground'>
          Created: {new Date(voiceClone.created_at).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className='flex gap-2 pt-2'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size='sm'
                variant='outline'
                className='flex-1 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700'
              >
                <Trash2 className='h-4 w-4 mr-1' />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Voice Clone</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{voiceClone.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className='bg-red-600 hover:bg-red-700'
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
