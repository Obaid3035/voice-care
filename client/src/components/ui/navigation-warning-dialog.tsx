import { AlertTriangle, Mic } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NavigationWarningDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function NavigationWarningDialog({
  isOpen,
  onConfirm,
  onCancel,
}: NavigationWarningDialogProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className='max-w-md'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2 text-red-600'>
            <AlertTriangle className='h-5 w-5' />
            Recording in Progress
          </AlertDialogTitle>
          <AlertDialogDescription className='space-y-3'>
            <div className='flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg'>
              <Mic className='h-4 w-4' />
              <span className='text-sm font-medium'>You're currently recording your voice</span>
            </div>
            <p className='text-gray-600'>
              If you navigate away now, your current recording will be lost and you'll need to start
              over.
            </p>
            <p className='text-gray-600 font-medium'>Are you sure you want to leave this page?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='gap-2'>
          <AlertDialogCancel
            onClick={onCancel}
            className='bg-gray-100 hover:bg-gray-200 text-gray-700'
          >
            Stay on Page
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className='bg-red-600 hover:bg-red-700 text-white'>
            Leave Page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
