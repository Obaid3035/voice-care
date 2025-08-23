import { Headphones, List, Music, Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AudioPlayer } from '@/components/content/AudioPlayer';
import { ContentFilters } from '@/components/content/ContentFilters';
import { ContentGrid } from '@/components/content/ContentGrid';
import { GenerateAudioDialog } from '@/components/content/GenerateAudioDialog';
import { PlayQueue } from '@/components/content/PlayQueue';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlayQueue } from '@/hooks/usePlayQueue';
import { deleteAudioContent, getAudioContent } from '@/lib/api/content';
import type { AudioContent, ContentFilters as ContentFiltersType } from '@/types';

export default function ContentLibrary() {
  const [content, setContent] = useState<AudioContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ContentFiltersType>({
    search: '',
    sortBy: 'recent',
  });
  const [openDialog, setOpenDialog] = useState(false);

  const {
    queue,
    currentTrack,
    isPlaying,
    isPlayerVisible,
    isQueueVisible,
    removeFromQueue,
    moveInQueue,
    clearQueue,
    playTrack,
    pauseTrack,
    hidePlayer,
    showPlayer,
    nextTrack,
    previousTrack,
    toggleQueueVisibility,
  } = usePlayQueue();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await getAudioContent();
      if (response.success && response.data) {
        setContent(response.data);
      }
    } catch (_error) {
      toast.error('Failed to load audio content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteAudioContent(id);
      setContent((prev) => prev.filter((item) => item.id !== id));
      toast.success('Content deleted successfully');
    } catch (_error) {
      toast.error('Failed to delete content');
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = useMemo(() => {
    const filtered = content.filter((item: AudioContent) => {
      const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    });

    switch (filters.sortBy) {
      case 'duration':
        filtered.sort((a: AudioContent, b: AudioContent) => (a.duration || 0) - (b.duration || 0));
        break;
      case 'alphabetical':
        filtered.sort((a: AudioContent, b: AudioContent) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort(
          (a: AudioContent, b: AudioContent) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return filtered;
  }, [content, filters]);

  const handleNext = () => {
    nextTrack();
  };

  const handlePrevious = () => {
    previousTrack();
  };

  const handleClosePlayer = () => {
    hidePlayer();
  };

  return (
    <DashboardLayout>
      <div className='space-y-8'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-[rgb(var(--text-primary))]'>Content Library</h1>
            <p className='mt-2 text-[rgb(var(--text-secondary))]'>
              Browse and manage your personalized audio content collection
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button onClick={toggleQueueVisibility} variant='outline' className='relative'>
              <List className='h-4 w-4 mr-2' />
              Queue
              {queue.length > 0 && (
                <Badge variant='secondary' className='ml-2 h-5 w-5 p-0 text-xs'>
                  {queue.length}
                </Badge>
              )}
            </Button>
            <GenerateAudioDialog
              openDialog={openDialog}
              closeDialog={() => setOpenDialog(!openDialog)}
              onContentGenerated={fetchContent}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-[rgb(var(--text-secondary))]'>
                Total Content
              </CardTitle>
              <Headphones className='h-4 w-4 text-[rgb(var(--text-muted))]' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-[rgb(var(--text-primary))]'>
                {content.length}
              </div>
              <p className='text-xs text-[rgb(var(--text-muted))]'>Audio files</p>
            </CardContent>
          </Card>

          <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-[rgb(var(--text-secondary))]'>
                Total Duration
              </CardTitle>
              <Music className='h-4 w-4 text-[rgb(var(--text-muted))]' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-[rgb(var(--text-primary))]'>
                {Math.round(content.reduce((sum, item) => sum + (item.duration || 0), 0) / 60)}
              </div>
              <p className='text-xs text-[rgb(var(--text-muted))]'>Minutes</p>
            </CardContent>
          </Card>
        </div>

        <ContentFilters
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={content.length}
          filteredCount={filteredContent.length}
        />

        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4' />
              <p className='text-gray-600 dark:text-gray-400'>Loading audio content...</p>
            </div>
          </div>
        ) : (
          <ContentGrid content={filteredContent} onDelete={handleDelete} />
        )}

        {currentTrack && (
          <AudioPlayer
            track={currentTrack}
            isVisible={isPlayerVisible}
            onClose={handleClosePlayer}
            onNext={filteredContent.length > 1 ? handleNext : undefined}
            onPrevious={filteredContent.length > 1 ? handlePrevious : undefined}
            playlist={filteredContent}
          />
        )}

        <PlayQueue
          queue={queue}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlay={playTrack}
          onPause={pauseTrack}
          onNext={nextTrack}
          onPrevious={previousTrack}
          onRemoveFromQueue={removeFromQueue}
          onMoveInQueue={moveInQueue}
          onClearQueue={clearQueue}
          isVisible={isQueueVisible}
          onClose={() => toggleQueueVisibility()}
        />

        {/* Mini Player Indicator - shows when audio is playing in background */}
        {currentTrack && !isPlayerVisible && (
          <div className='fixed bottom-4 left-4 z-50'>
            <Card className='shadow-2xl border-[rgb(var(--border))] bg-[rgb(var(--background))]/95 backdrop-blur-sm'>
              <CardContent className='p-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(var(--primary))]/20 to-[rgb(var(--primary))]/5 flex items-center justify-center text-sm'>
                    🎵
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-[rgb(var(--text-primary))] truncate text-sm'>
                      {currentTrack.title}
                    </p>
                    <p className='text-xs text-[rgb(var(--text-secondary))]'>
                      {isPlaying ? 'Playing' : 'Paused'}
                    </p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={isPlaying ? pauseTrack : () => playTrack(currentTrack)}
                      className='h-8 w-8 p-0'
                    >
                      {isPlaying ? <Pause className='h-3 w-3' /> : <Play className='h-3 w-3' />}
                    </Button>
                    <Button variant='ghost' size='sm' onClick={showPlayer} className='h-8 w-8 p-0'>
                      <List className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
