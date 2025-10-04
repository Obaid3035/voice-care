// DeviceSetupStep.tsx
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Cpu,
  Eye,
  EyeOff,
  Wifi,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DeviceCredentials } from '..';

interface DeviceSetupStepProps {
  data: DeviceCredentials;
  onChange: (data: DeviceCredentials) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  userId?: string;
}

export function DeviceSetupStep({
  data,
  onChange,
  onNext,
  onPrevious,
  isLoading,
}: DeviceSetupStepProps) {
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null);

  const handleChange = (field: keyof DeviceCredentials, value: string) => {
    onChange({ ...data, [field]: value });
  };

  // 🔹 Handle WiFi connection to ESP32
  const connectToWiFiHandler = async () => {
    if (data.wifiSSID === '' || data.wifiPassword === '') {
      setIsConnecting(false);
      toast.error('Please enter a valid WiFi network name and password');
      return;
    }

    try {
      setIsConnecting(true);

      // const response = await connectToWiFi(data.wifiSSID, data.wifiPassword, userId);

      let response = null;

      setTimeout(() => {
        response = { success: true };

        const success = response.success;

        setConnectionStatus(success ? 'success' : 'error');
        setIsConnecting(false);
      }, 500);
    } catch (_error) {
      setConnectionStatus('error');
      setIsConnecting(false);
    }
  };

  return (
    <Card className='border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
      <CardHeader className='text-center pb-6'>
        <div className='mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-green-500 to-blue-600 w-20 h-20 flex items-center justify-center'>
          <Cpu className='h-10 w-10 text-white' />
        </div>
        <CardTitle className='text-2xl font-bold text-[rgb(var(--text-primary))] mb-2'>
          Connect Your ESP32 Device
        </CardTitle>
        <p className='text-[rgb(var(--text-secondary))]'>
          Let's set up your Voice Care device for monitoring and response
        </p>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* WiFi Setup Section */}
        <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4'>
          <h3 className='font-semibold text-[rgb(var(--text-primary))] flex items-center gap-2'>
            <Wifi className='h-5 w-5' />
            WiFi Configuration
          </h3>

          <div className='space-y-3'>
            {/* 🔹 Network Name (SSID) */}
            <div>
              <Label
                htmlFor='wifiSSID'
                className='text-sm font-medium text-[rgb(var(--text-primary))]'
              >
                Network Name (SSID)
              </Label>
              <Input
                id='wifiSSID'
                type='text'
                placeholder='Your WiFi network name'
                value={data.wifiSSID || ''}
                onChange={(e) => handleChange('wifiSSID', e.target.value)}
                className='mt-1 h-10 border-2 focus:border-[rgb(var(--primary))] transition-colors'
              />
              <p className='text-xs text-gray-500 mt-1'>
                {/* 🔹 Instruction */}
                Enter the WiFi network name you want your ESP32 to connect to. Ideally, we would
                show a dropdown of available SSIDs from the ESP32 scan so you don’t have to type it
                manually.
              </p>
            </div>

            {/* 🔹 WiFi Password */}
            {data.wifiSSID && (
              <div className='relative'>
                <Label
                  htmlFor='wifiPassword'
                  className='text-sm font-medium text-[rgb(var(--text-primary))]'
                >
                  WiFi Password
                </Label>
                <div className='relative mt-1'>
                  <Input
                    id='wifiPassword'
                    type={showWifiPassword ? 'text' : 'password'}
                    placeholder='Your WiFi password'
                    value={data.wifiPassword || ''}
                    onChange={(e) => handleChange('wifiPassword', e.target.value)}
                    className='h-10 pr-10 border-2 focus:border-[rgb(var(--primary))] transition-colors'
                  />
                  <button
                    type='button'
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-secondary))]'
                  >
                    {showWifiPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 🔹 Connect button & feedback */}
          {data.wifiSSID && (
            <div className='pt-2'>
              <Button
                variant='outline'
                onClick={connectToWiFiHandler}
                disabled={isConnecting}
                className='w-full'
              >
                {isConnecting ? (
                  <>
                    <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
                    Connecting to WiFi...
                  </>
                ) : (
                  <>
                    <Wifi className='h-4 w-4 mr-2' />
                    Connect to WiFi
                  </>
                )}
              </Button>

              {connectionStatus === 'success' && (
                <div className='mt-2 p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-300'>
                  <CheckCircle className='h-4 w-4' />
                  <span className='text-sm'>
                    Connection successful! The device will now register with your account using its
                    MAC address. You can now switch back to your wifi network.
                  </span>
                </div>
              )}

              {connectionStatus === 'error' && (
                <div className='mt-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300'>
                  <AlertCircle className='h-4 w-4' />
                  <span className='text-sm'>Connection failed. Please check your credentials.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🔹 Quick Setup Tips */}
        <div className='bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800'>
          <h4 className='font-semibold text-blue-800 dark:text-blue-200 mb-2'>
            💡 Quick Setup Tips:
          </h4>
          <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
            <li>• Make sure your ESP32 is powered on and in setup mode</li>
            <li>• Device LED should blink slowly (setup mode)</li>
            <li>• Keep the device within range of your WiFi router</li>
            <li>• SSID should match your intended WiFi network exactly (case-sensitive)</li>
            <li>• After successful connection, device MAC will be attached to your account</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className='flex justify-between pt-6'>
          <Button
            variant='outline'
            onClick={onPrevious}
            disabled={isLoading || isConnecting}
            className='px-6 py-2 border-2'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Button>

          <Button
            onClick={onNext}
            disabled={isLoading || isConnecting || connectionStatus !== 'success'}
            className='px-6 py-2 bg-gradient-to-r from-[rgb(var(--primary))] to-blue-600 text-white hover:from-[rgb(var(--primary-dark))] hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                Setting up...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowRight className='h-4 w-4 ml-2' />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
