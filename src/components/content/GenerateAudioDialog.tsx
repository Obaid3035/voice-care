import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createAudioContent } from '../../lib/api';

export interface GenerateAudioData {
  prompt: string;
  language: string;
}

export function GenerateAudioDialog({
  openDialog,
  closeDialog,
  onContentGenerated,
}: {
  openDialog: boolean;
  closeDialog: () => void;
  onContentGenerated?: () => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<GenerateAudioData>({
    prompt: '',
    language: 'en',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!formData.language) {
      toast.error('Please select a language');
      return;
    }

    setIsGenerating(true);

    try {
      await createAudioContent({
        prompt: formData.prompt,
        language: formData.language,
      });

      toast.success('Audio generated successfully!');
      closeDialog();

      if (onContentGenerated) {
        onContentGenerated();
      }

      setFormData({
        prompt: '',
        language: 'en',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(errorMessage);
      closeDialog();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptChange = (value: string) => {
    setFormData((prev) => ({ ...prev, prompt: value }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, language: value }));
  };

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogTrigger asChild>
        <Button className='bg-gradient-to-r from-[#303c6c] to-[#4a5a8a] hover:from-[#4a5a8a] hover:to-[#303c6c] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
          <Sparkles className='h-4 w-4 mr-2' />
          Generate Audio
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-[600px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className='text-center'>
          <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg ring-4 ring-purple-500/20 mx-auto mb-4'>
            <Mic className='h-8 w-8' />
          </div>
          <DialogTitle className='text-2xl font-bold text-gray-900 dark:text-white'>
            Generate Audio Content
          </DialogTitle>
          <DialogDescription className='text-gray-600 dark:text-gray-400 text-base'>
            Create personalized audio content using your voice clone. Describe what you'd like to
            generate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Card className='border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'>
            <CardContent className='p-6 space-y-6'>
              {/* Language Selection */}
              <div className='space-y-3'>
                <Label
                  htmlFor='language'
                  className='text-base font-medium flex items-center gap-2 text-gray-900 dark:text-white'
                >
                  <Sparkles className='h-4 w-4' />
                  Language
                </Label>
                <Select value={formData.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className='h-12 text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500'>
                    <SelectValue placeholder='Select language' />
                  </SelectTrigger>
                  <SelectContent className='bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'>
                    <SelectItem value='en'>🇺🇸 English</SelectItem>
                    <SelectItem value='es'>🇪🇸 Spanish</SelectItem>
                    <SelectItem value='fr'>🇫🇷 French</SelectItem>
                    <SelectItem value='de'>🇩🇪 German</SelectItem>
                    <SelectItem value='it'>🇮🇹 Italian</SelectItem>
                    <SelectItem value='pt'>🇵🇹 Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prompt Input */}
              <div className='space-y-3'>
                <Label
                  htmlFor='prompt'
                  className='text-base font-medium flex items-center gap-2 text-gray-900 dark:text-white'
                >
                  <Sparkles className='h-4 w-4' />
                  What would you like to generate?
                </Label>
                <Textarea
                  id='prompt'
                  placeholder='Describe the audio content you want to create. For example: "A gentle lullaby about the moon and stars with soft melodies" or "A bedtime story about a little bear learning to sleep"'
                  value={formData.prompt}
                  onChange={(e) => handlePromptChange(e.target.value)}
                  className='min-h-[120px] text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none'
                />
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Be specific about the type of content, mood, and any special elements you'd like
                  included.
                </p>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className='flex flex-col sm:flex-row gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => closeDialog()}
              disabled={isGenerating}
              className='w-full sm:w-auto border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isGenerating || !formData.prompt.trim()}
              className='w-full sm:w-auto bg-gradient-to-r from-[#303c6c] to-[#4a5a8a] hover:from-[#4a5a8a] hover:to-[#303c6c] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50'
            >
              {isGenerating ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className='h-4 w-4 mr-2' />
                  Generate Audio
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
