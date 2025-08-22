import { CheckCircle, Circle } from 'lucide-react';

type Step = 'setup' | 'record' | 'review';

interface VoiceProgressIndicatorProps {
  currentStep: Step;
}

export function VoiceProgressIndicator({ currentStep }: VoiceProgressIndicatorProps) {
  const getStepIcon = (step: Step, currentStep: Step) => {
    const stepOrder = ['setup', 'record', 'review'];
    const currentStepIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    const isCompleted = stepIndex < currentStepIndex;
    const isCurrent = step === currentStep;

    if (isCompleted) {
      return <CheckCircle className='h-5 w-5 text-green-500' />;
    }
    if (isCurrent) {
      return (
        <Circle className='h-5 w-5 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400' />
      );
    }
    return <Circle className='h-5 w-5 text-gray-400 dark:text-gray-500' />;
  };

  return (
    <div className='flex items-center justify-center space-x-8'>
      <div className='flex items-center space-x-2'>
        {getStepIcon('setup', currentStep)}
        <span
          className={`font-medium ${currentStep === 'setup' ? 'text-purple-600 dark:text-purple-400' : currentStep === 'record' || currentStep === 'review' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          Setup
        </span>
      </div>
      <div className='h-px w-12 bg-gray-300 dark:bg-gray-600' />
      <div className='flex items-center space-x-2'>
        {getStepIcon('record', currentStep)}
        <span
          className={`font-medium ${currentStep === 'record' ? 'text-purple-600 dark:text-purple-400' : currentStep === 'review' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          Record
        </span>
      </div>
      <div className='h-px w-12 bg-gray-300 dark:bg-gray-600' />
      <div className='flex items-center space-x-2'>
        {getStepIcon('review', currentStep)}
        <span
          className={`font-medium ${currentStep === 'review' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          Review
        </span>
      </div>
    </div>
  );
}
