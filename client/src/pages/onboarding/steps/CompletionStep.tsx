import { Baby, CheckCircle, Heart, Sparkles } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompletionStepProps {
  childName: string;
}

export function CompletionStep({ childName }: CompletionStepProps) {
  return (
    <Card className='border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
      <CardHeader className='text-center pb-6'>
        <div className='mx-auto mb-4 relative'>
          {/* Success Icon with Animation */}
          <div className='p-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 w-24 h-24 flex items-center justify-center animate-bounce'>
            <CheckCircle className='h-12 w-12 text-white' />
          </div>
          {/* Sparkles Animation */}
          <div className='absolute -top-2 -right-2 animate-pulse'>
            <Sparkles className='h-6 w-6 text-yellow-500' />
          </div>
          <div className='absolute -bottom-2 -left-2 animate-pulse delay-300'>
            <Sparkles className='h-4 w-4 text-blue-500' />
          </div>
          <div className='absolute -top-1 left-1/2 animate-pulse delay-500'>
            <Sparkles className='h-5 w-5 text-purple-500' />
          </div>
        </div>

        <CardTitle className='text-3xl font-bold text-[rgb(var(--text-primary))] mb-2'>
          🎉 Setup Complete!
        </CardTitle>
        <p className='text-[rgb(var(--text-secondary))] text-lg'>
          {childName
            ? `${childName}'s Voice Care system is ready!`
            : 'Your Voice Care system is ready!'}
        </p>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Success Message */}
        <div className='text-center space-y-4'>
          <div className='bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Baby className='h-6 w-6 text-green-600 dark:text-green-400' />
              <h3 className='text-lg font-semibold text-green-800 dark:text-green-200'>
                Everything is set up perfectly!
              </h3>
            </div>
            <p className='text-green-700 dark:text-green-300 text-sm'>
              Your ESP32 device is configured and ready to monitor.
              {childName &&
                ` ${childName} is now protected with intelligent cry detection and soothing responses.`}
            </p>
          </div>

          {/* What's Next */}
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-2 h-2 rounded-full bg-blue-500' />
                <h4 className='font-semibold text-blue-800 dark:text-blue-200 text-sm'>
                  Monitor Live
                </h4>
              </div>
              <p className='text-blue-700 dark:text-blue-300 text-xs'>
                View real-time device status and activity
              </p>
            </div>

            <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-2 h-2 rounded-full bg-purple-500' />
                <h4 className='font-semibold text-purple-800 dark:text-purple-200 text-sm'>
                  Generate Content
                </h4>
              </div>
              <p className='text-purple-700 dark:text-purple-300 text-xs'>
                Create personalized lullabies and stories
              </p>
            </div>

            <div className='p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-2 h-2 rounded-full bg-green-500' />
                <h4 className='font-semibold text-green-800 dark:text-green-200 text-sm'>
                  View Analytics
                </h4>
              </div>
              <p className='text-green-700 dark:text-green-300 text-xs'>
                Track sleep patterns and response times
              </p>
            </div>

            <div className='p-4 rounded-lg bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-2 h-2 rounded-full bg-pink-500' />
                <h4 className='font-semibold text-pink-800 dark:text-pink-200 text-sm'>
                  Manage Devices
                </h4>
              </div>
              <p className='text-pink-700 dark:text-pink-300 text-xs'>
                Add more devices and customize settings
              </p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className='bg-gradient-to-r from-[rgb(var(--primary))]/10 to-blue-500/10 rounded-lg p-6 border border-[rgb(var(--primary))]/20'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <Heart className='h-5 w-5 text-[rgb(var(--primary))]' />
              <h3 className='text-lg font-semibold text-[rgb(var(--text-primary))]'>
                Welcome to Voice Care
              </h3>
            </div>
            <p className='text-[rgb(var(--text-secondary))] text-sm'>
              You're all set! We're redirecting you to your dashboard where you can start
              monitoring, creating content, and ensuring peaceful nights for your family.
            </p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className='flex justify-center items-center pt-4'>
          <div className='flex items-center gap-2 text-[rgb(var(--text-secondary))]'>
            <div className='flex gap-1'>
              <div className='w-2 h-2 bg-[rgb(var(--primary))] rounded-full animate-pulse' />
              <div className='w-2 h-2 bg-[rgb(var(--primary))] rounded-full animate-pulse delay-100' />
              <div className='w-2 h-2 bg-[rgb(var(--primary))] rounded-full animate-pulse delay-200' />
            </div>
            <span className='text-sm'>Taking you to your dashboard...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
