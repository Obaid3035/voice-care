import { Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VoiceSetupStepProps {
  formData: {
    name: string;
    language: string;
  };
  onFormDataChange: (data: { name: string; language: string }) => void;
  onNext: () => void;
}

export function VoiceSetupStep({ formData, onFormDataChange, onNext }: VoiceSetupStepProps) {
  const canProceed = formData.name.trim() && formData.language;

  return (
    <Card className='group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500'>
      <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-400/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500' />
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-8 animate-pulse' />
      </div>

      <CardContent className='relative p-8 z-10'>
        <div className='text-center mb-8'>
          <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl shadow-lg ring-4 ring-purple-500/20 mx-auto mb-4'>
            <User className='h-10 w-10' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Voice Clone Setup
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Let's start by setting up your voice clone details
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <Label
              htmlFor='name'
              className='text-base font-medium flex items-center gap-2 text-gray-900 dark:text-white'
            >
              <User className='h-4 w-4' />
              Voice Clone Name
            </Label>
            <Input
              id='name'
              placeholder="e.g., Mom's Voice, Dad's Voice"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              className='h-12 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500'
            />
          </div>

          <div className='space-y-3'>
            <Label
              htmlFor='language'
              className='text-base font-medium flex items-center gap-2 text-gray-900 dark:text-white'
            >
              <Globe className='h-4 w-4' />
              Language
            </Label>
            <Select
              value={formData.language}
              onValueChange={(value: string) => onFormDataChange({ ...formData, language: value })}
            >
              <SelectTrigger className='h-12 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500'>
                <SelectValue placeholder='Select language' />
              </SelectTrigger>
              <SelectContent className='bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'>
                <SelectItem value='en'>🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex justify-center pt-8'>
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className='bg-gradient-to-r from-[#303c6c] to-[#4a5a8a] hover:from-[#4a5a8a] hover:to-[#303c6c] text-white px-8 py-3 text-lg h-12 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'
          >
            Continue to Recording
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
