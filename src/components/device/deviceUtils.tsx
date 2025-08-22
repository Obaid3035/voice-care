import { Signal, SignalHigh, SignalLow, SignalZero } from 'lucide-react';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'text-green-600 dark:text-green-400';
    case 'offline':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-yellow-600 dark:text-yellow-400';
  }
};

export const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-100 dark:bg-green-900/20';
    case 'offline':
      return 'bg-red-100 dark:bg-red-900/20';
    default:
      return 'bg-yellow-100 dark:bg-yellow-900/20';
  }
};

export const getSignalIcon = (strength: string) => {
  switch (strength) {
    case 'excellent':
      return <Signal className='h-4 w-4 text-green-600 dark:text-green-400' />;
    case 'good':
      return <SignalHigh className='h-4 w-4 text-green-600 dark:text-green-400' />;
    case 'poor':
      return <SignalLow className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />;
    default:
      return <SignalZero className='h-4 w-4 text-red-600 dark:text-red-400' />;
  }
};

export const getBatteryColor = (battery: number) => {
  if (battery > 50) return 'bg-green-500';
  if (battery > 20) return 'bg-yellow-500';
  return 'bg-red-500';
};
