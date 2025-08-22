import { Baby, CheckCircle, Wifi } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/hooks/useAuth';
import { ChildProfileStep } from './steps/ChildProfileStep';
import { CompletionStep } from './steps/CompletionStep';
import { DeviceSetupStep } from './steps/DeviceSetupStep';
import { WelcomeStep } from './steps/WelcomeStep';

export interface ChildData {
  name: string;
  birthDate: string;
  gender: 'boy' | 'girl';
}

export interface DeviceData {
  name: string;
  deviceId: string;
  location: string;
  wifiSSID?: string;
}

const steps = [
  { id: 'welcome', title: 'Welcome', icon: Baby },
  { id: 'child', title: 'Child Profile', icon: Baby },
  { id: 'device', title: 'Device Setup', icon: Wifi },
  { id: 'complete', title: 'Complete', icon: CheckCircle },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [childData, setChildData] = useState<ChildData>({
    name: '',
    birthDate: '',
    gender: 'boy',
  });
  const [deviceData, setDeviceData] = useState<DeviceData>({
    name: '',
    deviceId: '',
    location: '',
    wifiSSID: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { completeOnboarding, skipOnboarding, user } = useAuth();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    skipOnboarding();
    toast.success('Welcome to Voice Care! You can set up your device later.');
    navigate('/dashboard');
  };

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      const result = await completeOnboarding(childData, {
        ...deviceData,
        status: 'online',
        battery: 100,
        signalStrength: 'excellent',
        cameraEnabled: true,
        cryDetection: true,
        lastActive: new Date().toISOString(),
        firmware: '1.0.0',
        playbackDelay: 0,
        fallbackMode: 'default',
        lightingMode: 'auto',
        lightingBrightness: 50,
      });

      if (result.success) {
        setCurrentStep(3); // Move to completion step
        setTimeout(() => {
          toast.success('Setup complete! Welcome to Voice Care!');
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error(result.error || 'Setup failed. Please try again.');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep user={user} onNext={handleNext} />;
      case 1:
        return (
          <ChildProfileStep
            data={childData}
            onChange={setChildData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <DeviceSetupStep
            data={deviceData}
            onChange={setDeviceData}
            onNext={handleComplete}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      case 3:
        return <CompletionStep childName={childData.name} />;
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      {/* Header */}
      <div className='sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-4xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Baby className='h-8 w-8 text-[rgb(var(--primary))]' />
              <span className='text-xl font-semibold text-[rgb(var(--text-primary))]'>
                Voice Care Setup
              </span>
            </div>
            <Button
              variant='ghost'
              onClick={handleSkip}
              className='text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
            >
              Skip Setup
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='max-w-4xl mx-auto px-4 py-6'>
        <div className='flex items-center justify-between mb-8'>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className='flex items-center'>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                        ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-white'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className='h-5 w-5' /> : <Icon className='h-5 w-5' />}
                </div>
                <div className='ml-3 hidden sm:block'>
                  <p
                    className={`text-sm font-medium ${
                      isActive || isCompleted
                        ? 'text-[rgb(var(--text-primary))]'
                        : 'text-[rgb(var(--text-secondary))]'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 h-0.5 mx-4 transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className='max-w-2xl mx-auto'>{renderStep()}</div>
      </div>
    </div>
  );
}
