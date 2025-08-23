import { BarChart3, Calendar, Clock, Globe, HardDrive, Mic, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InfoWidget } from '@/components/voice/info-widget';
import { VoiceRecordingForm } from '@/components/voice/voice-recording-form';
import { createVoiceClone, deleteVoiceClone, getVoiceClones } from '@/lib/api';
import type { IVoiceClone } from '@/types';
import { formatDate, formatDuration, formatFileSize } from '../../lib/utils';

export default function VoiceClone() {
  const [voiceClone, setVoiceClone] = useState<IVoiceClone | null>(null);
  const [creatingClone, setCreatingClone] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);

  useEffect(() => {
    const fetchVoice = async () => {
      setLoadingVoice(true);
      const response = await getVoiceClones();
      if (response.success && response.data) {
        setVoiceClone(response.data);
      }
      setLoadingVoice(false);
    };

    fetchVoice();
  }, []);

  const handleCreateVoiceClone = async (data: {
    name: string;
    file: File;
    language: string;
    duration: number;
    size: number;
  }) => {
    setCreatingClone(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('language', data.language);
      formData.append('duration', data.duration.toString());
      formData.append('size', data.size.toString());
      formData.append('file', data.file);

      const response = await createVoiceClone(formData);
      if (response?.success && response?.data) {
        toast.success('Voice clone created successfully!');
        setVoiceClone(response.data);
        setShowCreateForm(false);
        window.location.reload();
      } else {
        toast.error(response.error || 'Failed to create voice clone');
      }
    } catch {
      toast.error('An error occurred while creating the voice clone');
    } finally {
      setCreatingClone(false);
    }
  };

  const handleDeleteVoiceClone = async () => {
    try {
      setLoadingVoice(true);
      const response = await deleteVoiceClone();
      if (response.success) {
        setVoiceClone(null);
        toast.success('Voice clone deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete voice clone');
      }
    } catch (_error) {
      toast.error('An error occurred while deleting the voice clone');
    } finally {
      setLoadingVoice(false);
    }
  };

  return (
    <DashboardLayout>
      <div className='space-y-8'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-[rgb(var(--text-primary))]'>Voice Clone</h1>
            <p className='mt-2 text-[rgb(var(--text-secondary))]'>
              Your personalized voice for generating content
            </p>
          </div>
        </div>

        {loadingVoice ? (
          <div className='flex justify-center items-center py-20'>
            <div className='flex flex-col items-center gap-4'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#303c6c]' />
              <p className='text-[rgb(var(--text-secondary))]'>Loading your voice clone...</p>
            </div>
          </div>
        ) : voiceClone ? (
          <div className='space-y-6'>
            <Card className='group relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1'>
              <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-400/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500' />
              <div className='absolute inset-0 opacity-5'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-8 animate-pulse' />
              </div>

              <CardContent className='relative p-8 z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                  <div className='lg:col-span-2 space-y-6'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl shadow-lg ring-4 ring-purple-500/20 group-hover:scale-110 transition-transform duration-300'>
                          <Mic className='h-10 w-10' />
                        </div>
                        <div>
                          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>
                            {voiceClone.name}
                          </h2>
                          <div className='flex items-center gap-3'>
                            <Badge className='bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/50'>
                              <BarChart3 className='h-3 w-3 mr-1' />
                              Voice Clone
                            </Badge>
                            <div className='flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400'>
                              <Globe className='h-4 w-4' />
                              {voiceClone.language}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-white'>
                          Voice Sample
                        </h3>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          {formatDuration(voiceClone.duration)}
                        </span>
                      </div>
                      <div className='flex items-end justify-center gap-1 h-16'>
                        {Array.from({ length: 20 }, (_, i) => (
                          <div
                            key={Date.now()}
                            className='bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse'
                            style={{
                              width: '3px',
                              height: `${Math.random() * 60 + 20}%`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                        About this voice
                      </h3>
                      <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                        This is your personalized voice clone created from your audio samples. It
                        captures your unique vocal characteristics and can be used to generate
                        natural-sounding content in your own voice.
                      </p>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <div className='space-y-4'>
                      <InfoWidget
                        icon={<Clock />}
                        label='Duration'
                        value={formatDuration(voiceClone.duration)}
                        iconBgColor='bg-blue-100 dark:bg-blue-900/30'
                        iconColor='text-blue-600 dark:text-blue-400'
                      />

                      <InfoWidget
                        icon={<HardDrive />}
                        label='File Size'
                        value={formatFileSize(voiceClone.size)}
                        iconBgColor='bg-green-100 dark:bg-green-900/30'
                        iconColor='text-green-600 dark:text-green-400'
                      />

                      <InfoWidget
                        icon={<Calendar />}
                        label='Created'
                        value={formatDate(voiceClone.created_at)}
                        iconBgColor='bg-purple-100 dark:bg-purple-900/30'
                        iconColor='text-purple-600 dark:text-purple-400'
                      />
                    </div>

                    <Separator />

                    <div className='space-y-3'>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant='outline'
                            className='w-full border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
                          >
                            <Trash2 className='h-4 w-4 mr-2' />
                            Delete Voice
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'>
                          <AlertDialogHeader>
                            <AlertDialogTitle className='text-gray-900 dark:text-white'>
                              Delete Voice Clone
                            </AlertDialogTitle>
                            <AlertDialogDescription className='text-gray-600 dark:text-gray-400'>
                              Are you sure you want to delete your voice clone "{voiceClone.name}"?
                              This action cannot be undone and will permanently remove your voice
                              from both ElevenLabs and our database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className='border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteVoiceClone}
                              className='bg-red-600 hover:bg-red-700 text-white'
                            >
                              Delete Voice
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : showCreateForm ? (
          <div>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
                <Plus className='h-4 w-4 text-white' />
              </div>
              <p className='text-xl font-bold text-gray-900 dark:text-white'>Create Voice Clone</p>
            </div>
            <VoiceRecordingForm onSubmit={handleCreateVoiceClone} isSubmitting={creatingClone} />
          </div>
        ) : (
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-center'>
              <div className='mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-6'>
                <Mic className='w-12 h-12 text-purple-600 dark:text-purple-400' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                No voice clone yet
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed'>
                Create your personalized voice clone to start generating content in your own voice.
                Upload a high-quality audio sample to get started.
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className='bg-gradient-to-r from-[#303c6c] to-[#4a5a8a] hover:from-[#4a5a8a] hover:to-[#303c6c] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3'
              >
                <Plus className='h-5 w-5 mr-2' />
                Create Voice Clone
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
