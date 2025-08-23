import { useMemo, useState } from 'react';
import { Bell, Activity, Clock, AlertTriangle, TrendingUp, Calendar, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventLogCard } from '@/components/logs/EventLogCard';
import {
  EventLogFilters,
  type EventLogFilters as EventLogFiltersType,
} from '@/components/logs/EventLogFilters';
import { mockEventLogs } from '@/lib/mockData';

export default function EventLogs() {
  const [filters, setFilters] = useState<EventLogFiltersType>({
    search: '',
    eventType: 'all',
    deviceId: 'all',
    dateRange: 'all',
  });

  // Get unique devices for filter
  const availableDevices = useMemo(() => {
    const devices = new Set(mockEventLogs.map((log) => log.device_name).filter(Boolean));
    return Array.from(devices) as string[];
  }, []);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    const filtered = mockEventLogs.filter((event) => {
      // Search filter
      const matchesSearch =
        filters.search === '' ||
        event.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.device_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.content_title?.toLowerCase().includes(filters.search.toLowerCase());

      // Event type filter
      const matchesEventType =
        filters.eventType === 'all' || event.event_type === filters.eventType;

      // Device filter
      const matchesDevice = filters.deviceId === 'all' || event.device_name === filters.deviceId;

      // Date range filter
      let matchesDateRange = true;
      if (filters.dateRange !== 'all') {
        const eventDate = new Date(event.timestamp);
        const now = new Date();

        switch (filters.dateRange) {
          case 'today':
            matchesDateRange = eventDate.toDateString() === now.toDateString();
            break;
          case 'yesterday': {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            matchesDateRange = eventDate.toDateString() === yesterday.toDateString();
            break;
          }
          case 'week': {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDateRange = eventDate >= weekAgo;
            break;
          }
          case 'month': {
            const monthAgo = new Date(now);
            monthAgo.setDate(monthAgo.getDate() - 30);
            matchesDateRange = eventDate >= monthAgo;
            break;
          }
        }
      }

      return matchesSearch && matchesEventType && matchesDevice && matchesDateRange;
    });

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filtered;
  }, [filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalEvents = mockEventLogs.length;
    const cryEvents = mockEventLogs.filter((e) => e.event_type === 'cry_detected').length;
    const deviceIssues = mockEventLogs.filter((e) => e.event_type === 'device_offline').length;
    const recentEvents = mockEventLogs.filter((e) => {
      const eventDate = new Date(e.timestamp);
      const now = new Date();
      const dayAgo = new Date(now);
      dayAgo.setDate(dayAgo.getDate() - 1);
      return eventDate >= dayAgo;
    }).length;

    return { totalEvents, cryEvents, deviceIssues, recentEvents };
  }, []);

  return (
    <DashboardLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--primary))]/20 flex items-center justify-center'>
              <Bell className='h-6 w-6 text-[rgb(var(--primary))]' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-[rgb(var(--text-primary))]'>Event Logs</h1>
              <p className='text-[rgb(var(--text-secondary))]'>
                Monitor and track all system events and activities
              </p>
            </div>
          </div>

          {/* Quick Summary */}
          <div className='flex items-center gap-6 text-sm text-[rgb(var(--text-secondary))]'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span>Last 30 days</span>
            </div>
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4' />
              <span>Advanced filtering</span>
            </div>
            <div className='flex items-center gap-2'>
              <TrendingUp className='h-4 w-4' />
              <span>Real-time updates</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:shadow-lg transition-all duration-200 hover:border-[rgb(var(--primary))]/20'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-[rgb(var(--text-secondary))]'>
                Total Events
              </CardTitle>
              <div className='h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center'>
                <Activity className='h-4 w-4 text-blue-600 dark:text-blue-400' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-[rgb(var(--text-primary))]'>
                {stats.totalEvents}
              </div>
              <p className='text-xs text-[rgb(var(--text-muted))] mt-1'>All time events</p>
            </CardContent>
          </Card>

          <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:shadow-lg transition-all duration-200 hover:border-[rgb(var(--primary))]/20'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-[rgb(var(--text-secondary))]'>
                Cry Events
              </CardTitle>
              <div className='h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center'>
                <Bell className='h-4 w-4 text-red-600 dark:text-red-400' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-[rgb(var(--text-primary))]'>
                {stats.cryEvents}
              </div>
              <p className='text-xs text-[rgb(var(--text-muted))] mt-1'>Cry detections</p>
            </CardContent>
          </Card>

          <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:shadow-lg transition-all duration-200 hover:border-[rgb(var(--primary))]/20'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-[rgb(var(--text-secondary))]'>
                Device Issues
              </CardTitle>
              <div className='h-8 w-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center'>
                <AlertTriangle className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-[rgb(var(--text-primary))]'>
                {stats.deviceIssues}
              </div>
              <p className='text-xs text-[rgb(var(--text-muted))] mt-1'>Offline events</p>
            </CardContent>
          </Card>

          <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:shadow-lg transition-all duration-200 hover:border-[rgb(var(--primary))]/20'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-[rgb(var(--text-secondary))]'>
                Recent Events
              </CardTitle>
              <div className='h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center'>
                <Clock className='h-4 w-4 text-green-600 dark:text-green-400' />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-[rgb(var(--text-primary))]'>
                {stats.recentEvents}
              </div>
              <p className='text-xs text-[rgb(var(--text-muted))] mt-1'>Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <EventLogFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={mockEventLogs.length}
          filteredCount={filteredEvents.length}
          availableDevices={availableDevices}
        />

        {/* Event Logs */}
        <div className='space-y-4'>
          {filteredEvents.length === 0 ? (
            <Card className='border-2 border-dashed border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--background))] to-[rgb(var(--background-secondary))]'>
              <CardContent className='flex flex-col items-center justify-center py-24'>
                <div className='w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--primary))]/20 flex items-center justify-center'>
                  <Bell className='h-16 w-16 text-[rgb(var(--primary))]' />
                </div>
                <h3 className='text-3xl font-bold text-[rgb(var(--text-primary))] mb-4'>
                  No events found
                </h3>
                <p className='text-[rgb(var(--text-secondary))] text-center max-w-lg mb-8 leading-relaxed text-lg'>
                  Try adjusting your filters to see more events, or check back later for new
                  activity.
                </p>
                <div className='flex items-center gap-2 text-sm text-[rgb(var(--text-muted))]'>
                  <div className='w-2 h-2 bg-[rgb(var(--primary))] rounded-full animate-pulse'></div>
                  <span>Waiting for new events...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              {filteredEvents.map((event) => ( 
                <EventLogCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
