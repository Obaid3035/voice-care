import { CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockMetrics } from '@/lib/mockData';

const getCardColor = (color?: string) => {
  switch (color) {
    case 'success':
      return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20';
    case 'warning':
      return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20';
    case 'danger':
      return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20';
    default:
      return 'border-[rgb(var(--border))] bg-[rgb(var(--background))]';
  }
};

const getIconColor = (color?: string) => {
  switch (color) {
    case 'success':
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
    case 'danger':
      return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
    default:
      return 'text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10';
  }
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className='h-3 w-3 text-green-500' />;
    case 'down':
      return <TrendingDown className='h-3 w-3 text-green-500' />;
    default:
      return <CheckCircle className='h-3 w-3 text-blue-500' />;
  }
};

export function OverviewCards() {
  return (
    <div className='grid grid-cols-2 gap-6'>
      {mockMetrics.map((metric) => (
        <Card
          key={metric.title}
          className={`${getCardColor(metric.color)} hover:shadow-md transition-all duration-200`}
        >
          <CardHeader className='flex flex-row items-center justify-between pb-3 space-y-0'>
            <CardTitle className='text-sm font-medium text-[rgb(var(--text-secondary))]'>
              {metric.title}
            </CardTitle>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${getIconColor(metric.color)}`}
            >
              <metric.icon className='h-4 w-4' />
            </div>
          </CardHeader>
          <CardContent className='pb-4'>
            <div className='space-y-2'>
              <div className='text-2xl font-bold text-[rgb(var(--text-primary))]'>
                {metric.value}
              </div>
              <div className='flex items-center gap-2'>
                {getTrendIcon(metric.trend)}
                <p className='text-xs text-[rgb(var(--text-secondary))]'>{metric.change}</p>
              </div>
              <p className='text-xs text-[rgb(var(--text-muted))]'>{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
