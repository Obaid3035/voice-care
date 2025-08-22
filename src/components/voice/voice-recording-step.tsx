import { Mic, MicOff, Volume2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VoiceLevelVisualizer } from './voice-level-visualizer';

const SAMPLE_PARAPHRASE = `Welcome to your personalized voice experience. This technology allows us to create a unique audio profile that captures the warmth and comfort of your voice. 

By reading this passage, you're helping us understand the nuances of how you speak - your rhythm, tone, and the gentle cadence that makes your voice special. This recording will be used to generate soothing lullabies and bedtime stories in your own voice, creating a comforting experience for your little one even when you can't be there in person.

Remember to speak naturally and at a comfortable pace. There's no need to rush or change your normal speaking voice. The technology works best when you sound relaxed and authentic, just as you would when reading to your child at bedtime.

Thank you for taking the time to create this special connection between you and your child through the power of your voice.`;

const RECORDING_DURATION = 60; // 1 minute in seconds (target duration)

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordedBlob: Blob | null;
  timeElapsed: number;
}

interface VoiceRecordingStepProps {
  recordingState: RecordingState;
  stream: MediaStream | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
}

export function VoiceRecordingStep({
  recordingState,
  stream,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
}: VoiceRecordingStepProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (recordingState.timeElapsed / RECORDING_DURATION) * 100;

  return (
    <Card className='group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500'>
      <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-400/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500' />
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-8 animate-pulse' />
      </div>

      <CardContent className='relative p-8 z-10'>
        <div className='text-center mb-8'>
          <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl shadow-lg ring-4 ring-purple-500/20 mx-auto mb-4'>
            <Mic className='h-10 w-10' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Record Your Voice
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Read the text below naturally and clearly for at least 50 seconds
          </p>
        </div>

        {/* Voice Level Visualizer */}
        <VoiceLevelVisualizer 
          isRecording={recordingState.isRecording} 
          isPaused={recordingState.isPaused}
          stream={stream} 
        />

        {/* Reading Text */}
        <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6'>
          <div className='flex items-center gap-2 mb-4'>
            <Volume2 className='h-5 w-5 text-purple-600 dark:text-purple-400' />
            <span className='font-medium text-gray-900 dark:text-white'>Text to Read</span>
          </div>
          <div className='text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-h-48 overflow-y-auto'>
            {SAMPLE_PARAPHRASE}
          </div>
        </div>

        {/* Recording Progress */}
        {(recordingState.isRecording || recordingState.recordedBlob) && (
          <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-purple-200 dark:border-purple-700 shadow-sm mb-6'>
            <div className='flex items-center justify-between mb-3'>
              <span className='font-medium text-gray-900 dark:text-white flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                Recording Progress
              </span>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {formatTime(recordingState.timeElapsed)} / {formatTime(RECORDING_DURATION)}
              </span>
            </div>
            <Progress value={progressPercentage} className='h-3 mb-3' />
            <div className='text-center'>
              {recordingState.isRecording && (
                <div className='flex items-center justify-center gap-2 text-red-600'>
                  <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse' />
                  {recordingState.isPaused ? 'Recording Paused' : 'Recording in Progress'}
                </div>
              )}
              {recordingState.timeElapsed > 0 && recordingState.timeElapsed < 50 && (
                <div className='text-sm text-amber-600 dark:text-amber-400 mt-2'>
                  ⚠️ Minimum 50 seconds required for voice clone creation
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recording Controls */}
        <div className='flex justify-center'>
          {!recordingState.isRecording && !recordingState.recordedBlob && (
            <Button
              onClick={onStartRecording}
              className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
            >
              <Mic className='h-6 w-6 mr-3' />
              Start Recording
            </Button>
          )}

          {recordingState.isRecording && (
            <div className='flex gap-4'>
              <Button
                onClick={onPauseRecording}
                variant='outline'
                className='px-6 py-3 h-12 border border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 shadow-sm'
              >
                {recordingState.isPaused ? (
                  <>
                    <Mic className='h-5 w-5 mr-2' />
                    Resume
                  </>
                ) : (
                  <>
                    <MicOff className='h-5 w-5 mr-2' />
                    Pause
                  </>
                )}
              </Button>

              <Button
                onClick={onStopRecording}
                className='bg-gradient-to-r from-[#303c6c] to-[#4a5a8a] hover:from-[#4a5a8a] hover:to-[#303c6c] text-white px-6 py-3 h-12 shadow-sm'
              >
                <MicOff className='h-5 w-5 mr-2' />
                Stop Recording
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
