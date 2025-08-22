import { Plus } from 'lucide-react';
import { DeviceCard } from '@/components/device/DeviceCard';
import { DeviceStats } from '@/components/device/DeviceStats';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { mockDevices } from '@/lib/mockData';

export default function DeviceManagement() {
  return (
    <DashboardLayout>
      <div className='space-y-8'>
        <div className='px-2'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold text-[rgb(var(--text-primary))]'>
                Device Management
              </h1>
              <p className='text-[rgb(var(--text-secondary))]'>
                Manage and configure your connected devices.
              </p>
            </div>
            <Button className='bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-dark))] px-6 py-2 h-10'>
              <Plus className='h-4 w-4 mr-2' />
              Add Device
            </Button>
          </div>
        </div>

        {/* Device Stats */}
        <div className='px-2'>
          <DeviceStats devices={mockDevices} />
        </div>

        {/* Device Grid */}
        <div className='px-2'>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
            {mockDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>

        {/* Empty State for No Devices */}
        {mockDevices.length === 0 && (
          <div className='px-2'>
            <div className='text-center py-12'>
              <div className='mx-auto h-12 w-12 rounded-xl bg-[rgb(var(--primary))]/10 flex items-center justify-center mb-4'>
                <Plus className='h-6 w-6 text-[rgb(var(--primary))]' />
              </div>
              <h3 className='text-lg font-semibold text-[rgb(var(--text-primary))] mb-2'>
                No devices found
              </h3>
              <p className='text-[rgb(var(--text-secondary))] mb-6'>
                Get started by adding your first Voice Care device.
              </p>
              <Button className='bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-dark))]'>
                <Plus className='h-4 w-4 mr-2' />
                Add Your First Device
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
