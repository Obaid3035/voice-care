import { ArrowRight, Baby, Heart, Shield, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '../../../types';

interface WelcomeStepProps {
  user: User | null;
  onNext: () => void;
}

export function WelcomeStep({ user, onNext }: WelcomeStepProps) {
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <Card className='border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
      <CardHeader className='text-center pb-4'>
        <div className='mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-[rgb(var(--primary))] to-blue-600 w-20 h-20 flex items-center justify-center'>
          <Baby className='h-10 w-10 text-white' />
        </div>
        <CardTitle className='text-3xl font-bold text-[rgb(var(--text-primary))] mb-2'>
          Welcome to Voice Care, {firstName}! 👋
        </CardTitle>
        <p className='text-[rgb(var(--text-secondary))] text-lg'>
          Let's set up your Voice Care system to keep your little one safe and sound.
        </p>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-3'>
          <div className='text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800'>
            <div className='mx-auto mb-2 p-2 rounded-full bg-blue-500 w-12 h-12 flex items-center justify-center'>
              <Shield className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-blue-700 dark:text-blue-300 mb-1'>Safe & Secure</h3>
            <p className='text-sm text-blue-600 dark:text-blue-400'>
              Advanced cry detection with instant response
            </p>
          </div>

          <div className='text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'>
            <div className='mx-auto mb-2 p-2 rounded-full bg-green-500 w-12 h-12 flex items-center justify-center'>
              <Heart className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-green-700 dark:text-green-300 mb-1'>Personalized</h3>
            <p className='text-sm text-green-600 dark:text-green-400'>
              Content tailored to your child's needs
            </p>
          </div>

          <div className='text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800'>
            <div className='mx-auto mb-2 p-2 rounded-full bg-purple-500 w-12 h-12 flex items-center justify-center'>
              <Zap className='h-6 w-6 text-white' />
            </div>
            <h3 className='font-semibold text-purple-700 dark:text-purple-300 mb-1'>Easy Setup</h3>
            <p className='text-sm text-purple-600 dark:text-purple-400'>
              Get started in just a few minutes
            </p>
          </div>
        </div>

        <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6'>
          <h3 className='font-semibold text-[rgb(var(--text-primary))] mb-3'>What we'll set up:</h3>
          <ul className='space-y-2 text-[rgb(var(--text-secondary))]'>
            <li className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-[rgb(var(--primary))]' />
              Create your child's profile
            </li>
            <li className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-[rgb(var(--primary))]' />
              Connect your ESP32 Voice Care device
            </li>
            <li className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-[rgb(var(--primary))]' />
              Configure room settings and preferences
            </li>
          </ul>
        </div>

        <div className='flex justify-center pt-4'>
          <Button
            onClick={onNext}
            size='lg'
            className='bg-gradient-to-r from-[rgb(var(--primary))] to-blue-600 text-white hover:from-[rgb(var(--primary-dark))] hover:to-blue-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
          >
            Let's Get Started
            <ArrowRight className='h-5 w-5 ml-2' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
