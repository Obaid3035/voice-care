import { CheckCircle, Pause, Play, RotateCcw, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatFileSize } from '../../lib/utils';

interface RecordingState {
  recordedBlob: Blob | null;
  isPlaying: boolean;
  timeElapsed: number;
}

interface VoiceReviewStepProps {
  formData: {
    name: string;
    language: string;
  };
  recordingState: RecordingState;
  isSubmitting: boolean;
  onPlayRecording: () => void;
  onResetRecording: () => void;
  onSubmit: () => void;
}

export function VoiceReviewStep({
  formData,
  recordingState,
  isSubmitting,
  onPlayRecording,
  onResetRecording,
  onSubmit,
}: VoiceReviewStepProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className='group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500'>
      <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-400/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500' />
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-8 animate-pulse' />
      </div>

      <CardContent className='relative p-8 z-10'>
        <div className='text-center mb-8'>
          <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl shadow-lg ring-4 ring-purple-500/20 mx-auto mb-4'>
            <CheckCircle className='h-10 w-10' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Review Your Recording
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Listen to your recording and create your voice clone
          </p>
        </div>

        {/* Recording Info */}
        <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {formData.name}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Voice Name</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {formatFileSize(recordingState.recordedBlob?.size || 0)}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>File Size</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                {formatTime(recordingState.timeElapsed)}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>Duration</div>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className='flex justify-center gap-4 mb-8'>
          <Button
            onClick={onPlayRecording}
            className='bg-gradient-to-r from-[#303c6c] to-[#4a5a8a] hover:from-[#4a5a8a] hover:to-[#303c6c] text-white px-6 py-3 h-12 shadow-sm'
          >
            {recordingState.isPlaying ? (
              <>
                <Pause className='h-5 w-5 mr-2' />
                Pause
              </>
            ) : (
              <>
                <Play className='h-5 w-5 mr-2' />
                Play Recording
              </>
            )}
          </Button>

          <Button
            onClick={onResetRecording}
            variant='outline'
            className='px-6 py-3 h-12 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm'
          >
            <RotateCcw className='h-5 w-5 mr-2' />
            Record Again
          </Button>
        </div>

        <Separator className='my-6' />

        {/* Submit Button */}
        <div className='flex justify-center'>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className='bg-gradient-to-r from-[#303c6c] to-[#4a5a8a] hover:from-[#4a5a8a] hover:to-[#303c6c] text-white px-12 py-4 text-xl h-16 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='h-6 w-6 mr-3 animate-spin' />
                Creating Voice Clone...
              </>
            ) : (
              <>
                <Upload className='h-6 w-6 mr-3' />
                Create Voice Clone
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
