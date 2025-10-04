import { Baby, CheckCircle, Wifi } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { DeviceSetupStep } from './steps/DeviceSetupStep';
import { WelcomeStep } from './steps/WelcomeStep';

export interface DeviceCredentials {
  wifiSSID: string;
  wifiPassword: string;
}

const steps = [
  { id: 'welcome', title: 'Welcome', icon: Baby },
  { id: 'device', title: 'Device Setup', icon: Wifi },
  { id: 'complete', title: 'Complete', icon: CheckCircle },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);

  const [wifiCredentials, setWifiCredentials] = useState<DeviceCredentials>({
    wifiSSID: '',
    wifiPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { completeOnboarding, user } = useAuth();

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

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      const result = await completeOnboarding();

      if (result.success) {
        toast.success('Setup complete! Welcome to Voice Care!');
        navigate('/dashboard');
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
    if (!user) {
      return <div>Loading...</div>;
    }

    switch (currentStep) {
      case 0:
        return <WelcomeStep user={user} onNext={handleNext} />;
      case 1:
        return (
          <DeviceSetupStep
            data={wifiCredentials}
            userId={user.id}
            onChange={setWifiCredentials}
            onNext={handleComplete}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
      <div className='sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-4xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Baby className='h-8 w-8 text-[rgb(var(--primary))]' />
              <span className='text-xl font-semibold text-[rgb(var(--text-primary))]'>
                Voice Care Setup
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-2xl mx-auto px-4 py-6'>
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

        <div className='max-w-2xl mx-auto'>{renderStep()}</div>
      </div>
    </div>
  );
}
