import { AlertTriangle, Baby, Eye, Mic, Power, Settings, Speaker, Video, Wifi } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { DeviceConfigSheet } from '@/components/device/DeviceConfigSheet';
import { LiveVideoModal } from '@/components/device/LiveVideoModal';
import type { Device } from '@/components/device/types';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsConfigOpen(true);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsConfigOpen(true);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoModalOpen(true);
  };

  return (
    <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen}>
      <button
        type='button'
        className='w-full text-left border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-[rgb(var(--primary))]/20 rounded-xl border shadow-sm'
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
      >
        <CardHeader className='pb-4 px-6 pt-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--primary))]/10 p-3'>
                <Baby className='h-6 w-6 text-[rgb(var(--primary))]' />
              </div>
              <div>
                <CardTitle className='text-lg text-[rgb(var(--text-primary))] mb-1'>
                  {device.name}
                </CardTitle>
                <CardDescription className='text-[rgb(var(--text-secondary))]'>
                  {device.location}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4 px-6 pb-6'>
          <div className='space-y-3'>
            <h4 className='text-sm font-medium text-[rgb(var(--text-primary))] mb-2'>
              Device Features
            </h4>

            <div className='flex items-center justify-between p-3 bg-[rgb(var(--background-secondary))] rounded-lg'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
                  <Video className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <p className='text-sm font-medium text-[rgb(var(--text-primary))]'>Live Camera</p>
                  <p className='text-xs text-[rgb(var(--text-secondary))]'>
                    Real-time video monitoring
                  </p>
                </div>
              </div>
              <Button
                size='sm'
                variant='outline'
                onClick={handleViewClick}
                className='text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
              >
                <Eye className='h-4 w-4 mr-2' />
                View
              </Button>
            </div>

            <div className='flex items-center justify-between p-3 bg-[rgb(var(--background-secondary))] rounded-lg'>
              <div className='flex items-center gap-3'>
                <div className='h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
                  <Mic className='h-4 w-4 text-green-600 dark:text-green-400' />
                </div>
                <div>
                  <p className='text-sm font-medium text-[rgb(var(--text-primary))]'>Live Audio</p>
                  <p className='text-xs text-[rgb(var(--text-secondary))]'>
                    Two-way voice communication
                  </p>
                </div>
              </div>
              <Button
                size='sm'
                variant='outline'
                onClick={handleButtonClick}
                className='text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
              >
                <Speaker className='h-4 w-4 mr-2' />
                Talk
              </Button>
            </div>
          </div>

          <div className='flex gap-3 pt-2'>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                onClick={handleButtonClick}
                className='flex-1 text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
              >
                <Settings className='h-4 w-4 mr-2' />
                Configure
              </Button>
            </SheetTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size='icon'
                  variant='outline'
                  onClick={handleButtonClick}
                  className='text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
                >
                  <Power className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-[rgb(var(--overlay))] border-[rgb(var(--border))]'>
                <DropdownMenuItem className='text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10'>
                  <Power className='h-4 w-4 mr-2' />
                  Restart Device
                </DropdownMenuItem>
                <DropdownMenuItem className='text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10'>
                  <Wifi className='h-4 w-4 mr-2' />
                  Test Connection
                </DropdownMenuItem>
                <DropdownMenuItem className='text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10'>
                  <AlertTriangle className='h-4 w-4 mr-2' />
                  Factory Reset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </button>
      <SheetContent className='bg-[rgb(var(--background))] border-[rgb(var(--border))] w-full sm:max-w-lg'>
        <DeviceConfigSheet device={device} />
      </SheetContent>

      <LiveVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        deviceName={device.name}
      />
    </Sheet>
  );
}
