import { Baby, Camera, CameraOff, Volume2, VolumeX, Wifi } from 'lucide-react';
import type { Device } from '@/components/device/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDevices } from '@/lib/mockData';

interface DeviceStatusProps {
  device: Device;
}

function CompactDeviceCard({ device }: DeviceStatusProps) {
  return (
    <div className='flex items-center justify-between p-3 border border-[rgb(var(--border))] rounded-lg bg-[rgb(var(--background))] hover:shadow-sm transition-shadow'>
      <div className='flex items-center gap-3 flex-1 min-w-0'>
        <div className='h-8 w-8 rounded-lg bg-[rgb(var(--primary))]/10 flex items-center justify-center flex-shrink-0'>
          <Baby className='h-4 w-4 text-[rgb(var(--primary))]' />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <h4 className='font-medium text-[rgb(var(--text-primary))] text-sm truncate'>
              {device.name}
            </h4>
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
            />
          </div>
          <div className='flex items-center gap-3 text-xs text-[rgb(var(--text-secondary))]'>
            <span className='truncate'>{device.location}</span>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-1 flex-shrink-0'>
        <div
          className={`w-5 h-5 rounded flex items-center justify-center ${device.cameraEnabled ? 'bg-[rgb(var(--primary))]/10' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          {device.cameraEnabled ? (
            <Camera className='h-3 w-3 text-[rgb(var(--primary))]' />
          ) : (
            <CameraOff className='h-3 w-3 text-gray-400' />
          )}
        </div>
        <div
          className={`w-5 h-5 rounded flex items-center justify-center ${device.cryDetection ? 'bg-[rgb(var(--primary))]/10' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          {device.cryDetection ? (
            <Volume2 className='h-3 w-3 text-[rgb(var(--primary))]' />
          ) : (
            <VolumeX className='h-3 w-3 text-gray-400' />
          )}
        </div>
      </div>
    </div>
  );
}

export function LiveDeviceStatus() {
  return (
    <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg text-[rgb(var(--text-primary))] flex items-center gap-2'>
            <Wifi className='h-4 w-4' />
            Live Status
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        {mockDevices.map((device) => (
          <CompactDeviceCard key={device.id} device={device} />
        ))}

        {mockDevices.length === 0 && (
          <div className='text-center py-6'>
            <Baby className='h-8 w-8 text-[rgb(var(--text-muted))] mx-auto mb-2' />
            <p className='text-[rgb(var(--text-secondary))] text-sm'>No devices connected</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
