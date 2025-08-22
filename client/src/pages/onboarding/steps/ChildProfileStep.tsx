import { ArrowLeft, ArrowRight, Baby, Calendar, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ChildData } from '../index';

interface ChildProfileStepProps {
  data: ChildData;
  onChange: (data: ChildData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ChildProfileStep({ data, onChange, onNext, onPrevious }: ChildProfileStepProps) {
  const handleChange = (field: keyof ChildData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.name.trim() !== '' && data.birthDate !== '';

  return (
    <Card className='border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
      <CardHeader className='text-center pb-6'>
        <div className='mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 w-20 h-20 flex items-center justify-center'>
          <Baby className='h-10 w-10 text-white' />
        </div>
        <CardTitle className='text-2xl font-bold text-[rgb(var(--text-primary))] mb-2'>
          Tell us about your little one
        </CardTitle>
        <p className='text-[rgb(var(--text-secondary))]'>
          This helps us personalize the Voice Care experience for your child
        </p>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Child Name */}
        <div className='space-y-2'>
          <Label
            htmlFor='childName'
            className='text-sm font-medium text-[rgb(var(--text-primary))] flex items-center gap-2'
          >
            <User className='h-4 w-4' />
            Child's Name
          </Label>
          <Input
            id='childName'
            type='text'
            placeholder="Enter your child's name"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className='h-12 text-lg border-2 focus:border-[rgb(var(--primary))] transition-colors'
          />
        </div>

        {/* Birth Date */}
        <div className='space-y-2'>
          <Label
            htmlFor='birthDate'
            className='text-sm font-medium text-[rgb(var(--text-primary))] flex items-center gap-2'
          >
            <Calendar className='h-4 w-4' />
            Birth Date
          </Label>
          <Input
            id='birthDate'
            type='date'
            value={data.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className='h-12 text-lg border-2 focus:border-[rgb(var(--primary))] transition-colors'
          />
        </div>

        {/* Gender Selection */}
        <div className='space-y-3'>
          <Label className='text-sm font-medium text-[rgb(var(--text-primary))]'>
            Gender (optional)
          </Label>
          <div className='grid grid-cols-3 gap-3'>
            {[
              { value: 'boy', label: 'Boy', emoji: '👦', color: 'blue' },
              { value: 'girl', label: 'Girl', emoji: '👧', color: 'pink' },
            ].map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handleChange('gender', option.value as 'boy' | 'girl')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                  data.gender === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-950/20`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className='text-2xl mb-1'>{option.emoji}</div>
                <div
                  className={`text-sm font-medium ${
                    data.gender === option.value
                      ? `text-${option.color}-700 dark:text-${option.color}-300`
                      : 'text-[rgb(var(--text-secondary))]'
                  }`}
                >
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Age Preview */}
        {data.birthDate && (
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800'>
            <div className='text-center'>
              <p className='text-sm text-[rgb(var(--text-secondary))] mb-1'>
                {data.name ? `${data.name} is` : 'Your child is'}
              </p>
              <p className='text-lg font-semibold text-[rgb(var(--text-primary))]'>
                {calculateAge(data.birthDate)} old
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className='flex justify-between pt-6'>
          <Button variant='outline' onClick={onPrevious} className='px-6 py-2 border-2'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className='px-6 py-2 bg-gradient-to-r from-[rgb(var(--primary))] to-blue-600 text-white hover:from-[rgb(var(--primary-dark))] hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Continue
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }
  if (months > 0) {
    return months === 1 ? '1 month' : `${months} months`;
  }
  const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  return days === 1 ? '1 day' : `${days} days`;
}
