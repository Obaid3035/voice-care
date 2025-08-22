import { Baby } from 'lucide-react';
import type { Device } from '@/components/device/types';
import { Card, CardContent } from '@/components/ui/card';

interface DeviceStatsProps {
  devices: Device[];
}

export function DeviceStats({ devices }: DeviceStatsProps) {
  const totalDevices = devices.length;

  return (
    <div className='grid grid-cols-1 gap-6 mb-8'>
      <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:shadow-md transition-shadow'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-[rgb(var(--text-secondary))]'>Total Devices</p>
              <p className='text-3xl font-bold text-[rgb(var(--text-primary))]'>{totalDevices}</p>
            </div>
            <div className='h-12 w-12 rounded-xl bg-[rgb(var(--primary))]/10 flex items-center justify-center'>
              <Baby className='h-6 w-6 text-[rgb(var(--primary))]' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
