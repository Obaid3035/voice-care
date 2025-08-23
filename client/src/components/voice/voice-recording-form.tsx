import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useRecordingContext } from '@/hooks/useRecordingContext';
import { VoiceProgressIndicator } from './voice-progress-indicator';
import { VoiceRecordingStep } from './voice-recording-step';
import { VoiceReviewStep } from './voice-review-step';
import { VoiceSetupStep } from './voice-setup-step';

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordedBlob: Blob | null;
  isPlaying: boolean;
  timeElapsed: number;
  finalDuration: number;
}

interface VoiceRecordingFormProps {
  onSubmit: (data: {
    name: string;
    file: File;
    language: string;
    duration: number;
    size: number;
  }) => void;
  isSubmitting?: boolean;
}

type Step = 'setup' | 'record' | 'review';

export function VoiceRecordingForm({ onSubmit, isSubmitting = false }: VoiceRecordingFormProps) {
  const { setIsRecording: setGlobalRecording } = useRecordingContext();
  const [currentStep, setCurrentStep] = useState<Step>('setup');
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordedBlob: null,
    isPlaying: false,
    timeElapsed: 0,
    finalDuration: 0,
  });

  const [formData, setFormData] = useState({
    name: '',
    language: 'en',
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener('ended', () => {
      setRecordingState((prev) => ({ ...prev, isPlaying: false }));
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', () => {});
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (recordingState.isRecording && !recordingState.isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingState((prev) => {
          const newTimeElapsed = prev.timeElapsed + 1;
          // Remove the automatic stop at 1 minute - let user control recording duration
          return { ...prev, timeElapsed: newTimeElapsed };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState.isRecording, recordingState.isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setRecordingState((prev) => ({
          ...prev,
          recordedBlob: blob,
          isRecording: false,
          isPaused: false,
          finalDuration: prev.timeElapsed,
        }));

        setGlobalRecording(false);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        setCurrentStep('review');
        toast.success('Recording completed!');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);

      setRecordingState((prev) => ({
        ...prev,
        isRecording: true,
        timeElapsed: 0,
        recordedBlob: null,
      }));

      setGlobalRecording(true);
      toast.success('Recording started! Begin reading the text.');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      if (recordingState.isPaused) {
        mediaRecorderRef.current.resume();
        setRecordingState((prev) => ({ ...prev, isPaused: false }));
        toast.info('Recording resumed');
      } else {
        mediaRecorderRef.current.pause();
        setRecordingState((prev) => ({ ...prev, isPaused: true }));
        toast.info('Recording paused');
      }
    }
  };

  const playRecording = () => {
    const audioBlob = recordingState.recordedBlob;
    if (audioBlob && audioRef.current) {
      if (recordingState.isPlaying) {
        audioRef.current.pause();
        setRecordingState((prev) => ({ ...prev, isPlaying: false }));
      } else {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setRecordingState((prev) => ({ ...prev, isPlaying: true }));
      }
    }
  };

  const resetRecording = () => {
    if (recordingState.isRecording) {
      stopRecording();
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setRecordingState({
      isRecording: false,
      isPaused: false,
      recordedBlob: null,
      isPlaying: false,
      timeElapsed: 0,
      finalDuration: 0,
    });

    setGlobalRecording(false);
    setCurrentStep('record');
    toast.info('Recording reset');
  };

  const handleSubmit = () => {
    const audioBlob = recordingState.recordedBlob;
    if (!audioBlob) {
      toast.error('No recording available');
      return;
    }

    // Ensure all required fields are present
    if (!formData.name.trim()) {
      toast.error('Please enter a voice name');
      return;
    }

    if (!formData.language) {
      toast.error('Please select a language');
      return;
    }

    const file = new File([audioBlob], `${formData.name}-voice.wav`, {
      type: 'audio/webm',
    });

    // Use finalDuration if available, otherwise fall back to timeElapsed
    const duration = recordingState.finalDuration || recordingState.timeElapsed;

    // Ensure we have valid duration and size
    if (duration <= 0) {
      toast.error('Invalid recording duration');
      return;
    }

    // Check if duration is at least 50 seconds
    const MINIMUM_DURATION_SECONDS = 50; // 50 seconds
    if (duration < MINIMUM_DURATION_SECONDS) {
      const secondsNeeded = MINIMUM_DURATION_SECONDS - duration;
      toast.error(
        `Recording duration must be at least 50 seconds. You need ${secondsNeeded} more seconds of recording.`
      );
      return;
    }

    if (file.size <= 0) {
      toast.error('Invalid file size');
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      file,
      language: formData.language,
      duration: duration,
      size: file.size,
    });
  };

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <VoiceProgressIndicator currentStep={currentStep} />
      {currentStep === 'setup' && (
        <VoiceSetupStep
          formData={formData}
          onFormDataChange={setFormData}
          onNext={() => setCurrentStep('record')}
        />
      )}

      {currentStep === 'record' && (
        <VoiceRecordingStep
          recordingState={recordingState}
          stream={streamRef.current}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onPauseRecording={pauseRecording}
        />
      )}

      {currentStep === 'review' && (
        <VoiceReviewStep
          formData={formData}
          recordingState={recordingState}
          isSubmitting={isSubmitting}
          onPlayRecording={playRecording}
          onResetRecording={resetRecording}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
