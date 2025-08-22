import { Lightbulb, Settings } from 'lucide-react';
import { useState } from 'react';
import type { Device } from '@/components/device/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface DeviceConfigSheetProps {
  device: Device;
}

export function DeviceConfigSheet({ device }: DeviceConfigSheetProps) {
  const [config, setConfig] = useState(device);

  return (
    <div className='h-full flex flex-col'>
      <SheetHeader className='px-6 py-6 border-b border-[rgb(var(--border))]'>
        <SheetTitle className='text-[rgb(var(--text-primary))] text-xl'>
          Configure {device.name}
        </SheetTitle>
        <SheetDescription className='text-[rgb(var(--text-secondary))] mt-2'>
          Adjust device settings and preferences for optimal performance.
        </SheetDescription>
      </SheetHeader>

      <div className='flex-1 overflow-y-auto px-6 py-6'>
        <div className='space-y-8'>
          {/* Basic Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-[rgb(var(--text-primary))] flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Basic Settings
            </h3>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label className='text-[rgb(var(--text-primary))] font-medium'>Device Name</Label>
                <Input
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className='bg-[rgb(var(--input))] border-[rgb(var(--input-border))] text-[rgb(var(--text-primary))] h-10'
                />
              </div>

              <div className='space-y-2'>
                <Label className='text-[rgb(var(--text-primary))] font-medium'>Location</Label>
                <Input
                  value={config.location}
                  onChange={(e) => setConfig({ ...config, location: e.target.value })}
                  className='bg-[rgb(var(--input))] border-[rgb(var(--input-border))] text-[rgb(var(--text-primary))] h-10'
                />
              </div>
            </div>
          </div>

          <Separator className='bg-[rgb(var(--border))]' />

          {/* Camera Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-[rgb(var(--text-primary))]'>
              Camera & Monitoring
            </h3>

            <div className='flex items-center justify-between py-2'>
              <div className='flex-1 pr-4'>
                <Label className='text-[rgb(var(--text-primary))] font-medium'>Camera</Label>
                <p className='text-sm text-[rgb(var(--text-secondary))] mt-1'>
                  Enable video monitoring and snapshots
                </p>
              </div>
              <Button
                variant={config.cameraEnabled ? 'default' : 'outline'}
                size='sm'
                onClick={() => setConfig({ ...config, cameraEnabled: !config.cameraEnabled })}
                className={`px-4 ${
                  config.cameraEnabled
                    ? 'bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-dark))]'
                    : 'text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
                }`}
              >
                {config.cameraEnabled ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          <Separator className='bg-[rgb(var(--border))]' />

          {/* Lighting Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-[rgb(var(--text-primary))] flex items-center gap-2'>
              <Lightbulb className='h-5 w-5' />
              Lighting
            </h3>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label className='text-[rgb(var(--text-primary))] font-medium'>Lighting Mode</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-between text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10 h-10'
                    >
                      {config.lightingMode.charAt(0).toUpperCase() + config.lightingMode.slice(1)}
                      <Lightbulb className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='bg-[rgb(var(--overlay))] border-[rgb(var(--border))] w-full'>
                    {['auto', 'night', 'day', 'off'].map((mode) => (
                      <DropdownMenuItem
                        key={mode}
                        onClick={() => setConfig({ ...config, lightingMode: mode })}
                        className='text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10'
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {config.lightingMode !== 'off' && (
                <div className='space-y-3'>
                  <Label className='text-[rgb(var(--text-primary))] font-medium'>
                    Brightness: {config.lightingBrightness}%
                  </Label>
                  <Input
                    type='range'
                    value={config.lightingBrightness}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        lightingBrightness: parseInt(e.target.value),
                      })
                    }
                    min='0'
                    max='100'
                    className='bg-[rgb(var(--input))] border-[rgb(var(--input-border))] accent-[rgb(var(--primary))]'
                  />
                </div>
              )}
            </div>
          </div>

          <Separator className='bg-[rgb(var(--border))]' />

          {/* Device Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-[rgb(var(--text-primary))]'>
              Device Information
            </h3>
            <div className='p-4 bg-[rgb(var(--background-secondary))] rounded-lg'>
              <div className='space-y-1'>
                <Label className='text-[rgb(var(--text-secondary))] text-xs font-medium'>
                  Firmware
                </Label>
                <p className='text-[rgb(var(--text-primary))] font-medium'>{device.firmware}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='px-6 py-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--background-secondary))]'>
        <div className='flex justify-end gap-3'>
          <Button
            variant='outline'
            className='text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10 px-6'
          >
            Cancel
          </Button>
          <Button className='bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-dark))] px-6'>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
