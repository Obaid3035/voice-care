import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface EventLogFilters {
  search: string;
  eventType: string;
  deviceId: string;
  dateRange: string;
}

interface EventLogFiltersProps {
  filters: EventLogFilters;
  onFiltersChange: (filters: EventLogFilters) => void;
  totalCount: number;
  filteredCount: number;
  availableDevices: string[];
}

const EVENT_TYPES = [
  { value: 'all', label: 'All Events' },
  { value: 'cry_detected', label: 'Cry Detected' },
  { value: 'content_played', label: 'Content Played' },
  { value: 'device_online', label: 'Device Online' },
  { value: 'device_offline', label: 'Device Offline' },
  { value: 'snapshot_taken', label: 'Snapshot Taken' },
  { value: 'voice_generated', label: 'Voice Generated' },
];

const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
];

export function EventLogFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
  availableDevices,
}: EventLogFiltersProps) {
  const handleFilterChange = (key: keyof EventLogFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      eventType: 'all',
      deviceId: 'all',
      dateRange: 'all',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.eventType !== 'all' ||
    filters.deviceId !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-lg font-semibold text-[rgb(var(--text-primary))]'>Event Logs</h2>
          <p className='text-sm text-[rgb(var(--text-secondary))]'>
            Showing {filteredCount} of {totalCount} events
          </p>
        </div>
        {hasActiveFilters && (
          <Button
            variant='outline'
            size='sm'
            onClick={clearFilters}
            className='text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[rgb(var(--text-muted))]' />
          <Input
            placeholder='Search events...'
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Event Type */}
        <Select
          value={filters.eventType}
          onValueChange={(value) => handleFilterChange('eventType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Event Type' />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Device */}
        <Select
          value={filters.deviceId}
          onValueChange={(value) => handleFilterChange('deviceId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Device' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Devices</SelectItem>
            {availableDevices.map((device) => (
              <SelectItem key={device} value={device}>
                {device}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Select
          value={filters.dateRange}
          onValueChange={(value) => handleFilterChange('dateRange', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Date Range' />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-sm text-[rgb(var(--text-secondary))]'>Active filters:</span>
          {filters.search && (
            <Badge variant='secondary' className='text-xs'>
              Search: "{filters.search}"
            </Badge>
          )}
          {filters.eventType !== 'all' && (
            <Badge variant='secondary' className='text-xs'>
              Type: {EVENT_TYPES.find((t) => t.value === filters.eventType)?.label}
            </Badge>
          )}
          {filters.deviceId !== 'all' && (
            <Badge variant='secondary' className='text-xs'>
              Device: {filters.deviceId}
            </Badge>
          )}
          {filters.dateRange !== 'all' && (
            <Badge variant='secondary' className='text-xs'>
              Date: {DATE_RANGES.find((d) => d.value === filters.dateRange)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
