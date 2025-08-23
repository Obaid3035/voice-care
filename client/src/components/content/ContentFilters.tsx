import { Search, SortAsc, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { ContentFilters as ContentFiltersType } from '@/types';

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'duration', label: 'Duration' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

interface ContentFiltersComponentProps {
  filters: ContentFiltersType;
  onFiltersChange: (filters: ContentFiltersType) => void;
  totalCount: number;
  filteredCount: number;
}

export function ContentFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: ContentFiltersComponentProps) {
  const hasActiveFilters = filters.search;

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      sortBy: 'recent',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Search and Main Controls */}
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Search by title...'
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className='pl-10 h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[rgb(var(--primary))]/20 focus:border-[rgb(var(--primary))]'
          />
          {filters.search && (
            <Button
              size='sm'
              variant='ghost'
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <X className='h-3 w-3' />
            </Button>
          )}
        </div>

        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='h-11 gap-2'>
              <SortAsc className='h-4 w-4' />
              <span className='hidden sm:inline'>Sort:</span>
              <span className='font-medium'>
                {sortOptions.find((s) => s.value === filters.sortBy)?.label}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl'>
            <DropdownMenuLabel className='text-gray-700 dark:text-gray-300'>
              Sort By
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    sortBy: option.value as 'recent' | 'duration' | 'alphabetical',
                  })
                }
                className='hover:bg-gray-50 dark:hover:bg-gray-800'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${filters.sortBy === option.value ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))]' : 'border-gray-300'}`}
                  >
                    {filters.sortBy === option.value && (
                      <div className='w-full h-full rounded-full bg-white scale-50' />
                    )}
                  </div>
                  {option.label}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters and Results */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 flex-wrap'>
          {/* Results Count */}
          <div className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
            {filteredCount === totalCount ? (
              <span>Showing all {totalCount} items</span>
            ) : (
              <span>
                Showing {filteredCount} of {totalCount} items
              </span>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearAllFilters}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-7 px-3 text-xs'
            >
              Clear all filters
            </Button>
          )}
        </div>

        {/* Active Filter Pills */}
        <div className='flex items-center gap-2 flex-wrap'>
          {filters.search && (
            <Badge
              variant='outline'
              className='bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))] border-[rgb(var(--primary))]/20 gap-1'
            >
              Search: "{filters.search}"
              <button
                type='button'
                onClick={() => onFiltersChange({ ...filters, search: '' })}
                className='ml-1 hover:bg-[rgb(var(--primary))]/20 rounded-full p-0.5'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
