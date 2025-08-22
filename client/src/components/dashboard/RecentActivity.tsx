import {
  AlertCircle,
  Baby,
  Bell,
  Camera,
  CheckCircle,
  Clock,
  Info,
  Mic,
  Music,
  Play,
  Settings,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ActivityEvent, mockActivities } from '@/lib/mockData';

const getActivityIcon = (type: ActivityEvent['type']) => {
  switch (type) {
    case 'cry':
      return Bell;
    case 'content':
      return Music;
    case 'device':
      return Settings;
    case 'voice':
      return Mic;
    case 'snapshot':
      return Camera;
    default:
      return Info;
  }
};

const getPriorityColor = (priority: ActivityEvent['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
    default:
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
  }
};

const getStatusIcon = (status: ActivityEvent['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className='h-4 w-4 text-green-500' />;
    case 'failed':
      return <AlertCircle className='h-4 w-4 text-red-500' />;
    default:
      return <Clock className='h-4 w-4 text-blue-500' />;
  }
};

export function RecentActivity() {
  return (
    <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg text-[rgb(var(--text-primary))] flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Recent Activity
          </CardTitle>
          <Button
            variant='outline'
            size='sm'
            className='text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {mockActivities.map((activity, index) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <div
              key={activity.id}
              className={`flex items-start gap-4 p-4 rounded-lg border border-[rgb(var(--border))] hover:shadow-sm transition-shadow ${index === 0 ? 'bg-[rgb(var(--accent))]/5' : 'bg-[rgb(var(--background))]/50'}`}
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${getPriorityColor(activity.priority)}`}
              >
                <IconComponent className='h-5 w-5' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h4 className='font-medium text-[rgb(var(--text-primary))] text-sm'>
                    {activity.title}
                  </h4>
                  {getStatusIcon(activity.status)}
                </div>
                <p className='text-sm text-[rgb(var(--text-secondary))] mb-2'>
                  {activity.description}
                </p>
                <div className='flex items-center gap-2'>
                  {activity.device && (
                    <Badge variant='outline' className='text-xs'>
                      <Baby className='h-3 w-3 mr-1' />
                      {activity.device}
                    </Badge>
                  )}
                  <span className='text-xs text-[rgb(var(--text-muted))]'>
                    {activity.timestamp}
                  </span>
                </div>
              </div>
              {activity.type === 'cry' && activity.status === 'failed' && (
                <Button
                  size='sm'
                  variant='outline'
                  className='text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/10'
                >
                  <Play className='h-3 w-3 mr-1' />
                  Retry
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
