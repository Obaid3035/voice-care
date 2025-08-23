import { Mic, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Extend Window interface for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface VoiceLevelVisualizerProps {
  isRecording: boolean;
  isPaused: boolean;
  stream: MediaStream | null;
}

interface AudioLevels {
  levels: number[];
  averageLevel: number;
  isSilent: boolean;
  isGoodLevel: boolean;
}

const BAR_COUNT = 20;
const SILENCE_THRESHOLD = 0.05;
const GOOD_LEVEL_THRESHOLD = 0.15;

export function VoiceLevelVisualizer({ isRecording, isPaused, stream }: VoiceLevelVisualizerProps) {
  const [audioLevels, setAudioLevels] = useState<AudioLevels>({
    levels: new Array(BAR_COUNT).fill(0),
    averageLevel: 0,
    isSilent: true,
    isGoodLevel: false,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!isRecording || !stream || isPaused) {
      // Reset levels when not recording or paused
      setAudioLevels({
        levels: new Array(BAR_COUNT).fill(0),
        averageLevel: 0,
        isSilent: true,
        isGoodLevel: false,
      });
      return;
    }

    const setupAudioAnalysis = async () => {
      try {
        // Create audio context
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

        // Create analyser node
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;

        // Create source from stream
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        // Create data array for frequency analysis
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        // Start animation loop
        updateAudioLevels();
      } catch (error) {
        console.error('Error setting up audio analysis:', error);
      }
    };

    setupAudioAnalysis();

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording, stream]);

  const updateAudioLevels = () => {
    if (!analyserRef.current || !dataArrayRef.current || !isRecording || isPaused) {
      return;
    }

    // Get frequency data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Calculate average level with focus on human speech frequencies (85Hz - 255Hz)
    // This helps filter out background noise and focus on voice
    const speechFrequencies = dataArrayRef.current.slice(2, 8); // Roughly 85Hz-255Hz range

    // Filter out very low values (background noise)
    const filteredFrequencies = speechFrequencies.filter((val) => val > 5); // Minimum threshold

    let averageLevel = 0;
    if (filteredFrequencies.length > 0) {
      const speechSum = filteredFrequencies.reduce((acc, val) => acc + val, 0);
      averageLevel = speechSum / filteredFrequencies.length / 255; // Normalize to 0-1
    }

    const smoothedLevel = Math.max(0, averageLevel - 0.02);

    const newLevels = new Array(BAR_COUNT).fill(0).map((_, index) => {
      if (!dataArrayRef.current) return 0;

      const startFreq = Math.floor((index / BAR_COUNT) * dataArrayRef.current.length);
      const endFreq = Math.floor(((index + 1) / BAR_COUNT) * dataArrayRef.current.length);

      // Calculate average level for this frequency range
      let sum = 0;
      let count = 0;
      for (let i = startFreq; i < endFreq && i < dataArrayRef.current.length; i++) {
        // Only count significant frequencies (filter out background noise)
        if (dataArrayRef.current[i] > 3) {
          sum += dataArrayRef.current[i];
          count++;
        }
      }

      const level = count > 0 ? sum / count / 255 : 0;

      // Add some smoothing and randomness for natural movement
      const smoothedLevel = level * 0.6 + Math.random() * 0.2;
      return Math.min(1, Math.max(0, smoothedLevel));
    });

    // Determine if audio is silent or at good level
    const isSilent = smoothedLevel < SILENCE_THRESHOLD;
    const isGoodLevel = smoothedLevel >= GOOD_LEVEL_THRESHOLD;

    setAudioLevels({
      levels: newLevels,
      averageLevel: smoothedLevel,
      isSilent,
      isGoodLevel,
    });

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(updateAudioLevels);
  };

  const getFeedbackMessage = () => {
    if (!isRecording) {
      return 'Click "Start Recording" to begin';
    }

    if (isPaused) {
      return 'Recording paused - click Resume to continue';
    }

    if (audioLevels.isSilent) {
      return 'Speak clearly - your voice is too quiet';
    }

    if (audioLevels.isGoodLevel) {
      return 'Perfect! Your voice is clear and audible';
    }

    return 'Good! Speak a bit more clearly';
  };

  const getFeedbackIcon = () => {
    if (!isRecording) {
      return <Mic className='h-5 w-5 text-gray-400' />;
    }

    if (isPaused) {
      return <Mic className='h-5 w-5 text-yellow-500' />;
    }

    if (audioLevels.isSilent) {
      return <VolumeX className='h-5 w-5 text-red-500' />;
    }

    if (audioLevels.isGoodLevel) {
      return <Volume2 className='h-5 w-5 text-green-500' />;
    }

    return <Volume2 className='h-5 w-5 text-yellow-500' />;
  };

  const getFeedbackColor = () => {
    if (!isRecording) {
      return 'text-gray-400';
    }

    if (isPaused) {
      return 'text-yellow-500';
    }

    if (audioLevels.isSilent) {
      return 'text-red-500';
    }

    if (audioLevels.isGoodLevel) {
      return 'text-green-500';
    }

    return 'text-yellow-500';
  };

  return (
    <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6'>
      <div className='flex items-center justify-between mb-4'>
        <span className='font-medium text-gray-900 dark:text-white flex items-center gap-2'>
          {getFeedbackIcon()}
          Voice Level
        </span>
        <div className={`text-sm font-medium ${getFeedbackColor()}`}>
          {Math.round(audioLevels.averageLevel * 100)}%
        </div>
      </div>

      {/* Audio Level Bars */}
      <div className='flex items-end justify-center gap-1 h-24 mb-4'>
        {audioLevels.levels.map((level) => {
          const getBarColor = () => {
            if (!isRecording) return 'from-gray-400 to-gray-500';
            if (isPaused) return 'from-yellow-400 to-yellow-500';
            if (level < SILENCE_THRESHOLD) return 'from-red-400 to-red-500';
            if (level >= GOOD_LEVEL_THRESHOLD) return 'from-green-400 to-green-500';
            return 'from-yellow-400 to-yellow-500';
          };

          return (
            <div
              key={Date.now()}
              className={`w-2 bg-gradient-to-t ${getBarColor()} rounded-full transition-all duration-75 ease-out`}
              style={{
                height: `${Math.max(4, level * 100)}%`,
                opacity: isRecording && !isPaused ? 0.8 + level * 0.2 : 0.3,
                transform:
                  isRecording && !isPaused ? `scaleY(${0.8 + level * 0.4})` : 'scaleY(0.3)',
              }}
            />
          );
        })}
      </div>

      {/* Feedback Message */}
      <div className={`text-center text-sm font-medium ${getFeedbackColor()}`}>
        {getFeedbackMessage()}
      </div>

      {/* Level Indicators */}
      <div className='flex justify-between items-center mt-3 text-xs text-gray-500'>
        <div className='flex items-center gap-1'>
          <div className='w-2 h-2 bg-red-400 rounded-full' />
          <span>Too Quiet</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-2 h-2 bg-yellow-400 rounded-full' />
          <span>Clear</span>
        </div>
        <div className='flex items-center gap-1'>
          <div className='w-2 h-2 bg-green-400 rounded-full' />
          <span>Perfect</span>
        </div>
      </div>
    </div>
  );
}
