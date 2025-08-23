import { Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AudioContent } from '@/types';
import { ContentCard } from './ContentCard';

interface ContentGridProps {
  content: AudioContent[];
  onDelete: (id: string) => void;
}

export function ContentGrid({ content, onDelete }: ContentGridProps) {
  if (content.length === 0) {
    return (
      <Card className='border-2 border-dashed border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--background))] to-[rgb(var(--background-secondary))]'>
        <CardContent className='flex flex-col items-center justify-center py-20'>
          <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[rgb(var(--primary))]/10 to-[rgb(var(--primary))]/20 flex items-center justify-center'>
            <Headphones className='h-12 w-12 text-[rgb(var(--primary))]' />
          </div>
          <h3 className='text-2xl font-bold text-[rgb(var(--text-primary))] mb-3'>
            No content found
          </h3>
          <p className='text-[rgb(var(--text-secondary))] text-center max-w-md mb-8 leading-relaxed'>
            Start creating personalized audio content for your child. Generate lullabies, stories,
            and affirmations using your voice clone.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {content.map((item) => (
        <ContentCard key={item.id} content={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
