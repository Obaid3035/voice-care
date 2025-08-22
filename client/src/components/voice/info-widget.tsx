import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoWidgetProps {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export function InfoWidget({
  icon,
  label,
  value,
  iconBgColor = 'bg-blue-100 dark:bg-blue-900/30',
  iconColor = 'text-blue-600 dark:text-blue-400',
  className,
}: InfoWidgetProps) {
  return (
    <Card
      className={cn(
        'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50',
        className
      )}
    >
      <CardContent className='p-4'>
        <div className='flex items-center gap-3'>
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBgColor)}>
            <div className={cn('h-5 w-5', iconColor)}>{icon}</div>
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{label}</p>
            <p className='font-semibold text-gray-900 dark:text-white'>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
