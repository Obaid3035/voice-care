import { supabase } from '../../config/services.config';

interface IAudioContent {
  userId: string;
  audioUrl: string;
  voiceId: string;
  title: string;
  prompt: string;
  language: string;
  duration: number;
}

export const insertAudioContent = async (audioContent: IAudioContent) => {
  const { data, error } = await supabase
    .from('audio_content')
    .insert({
      user_id: audioContent.userId,
      prompt: audioContent.prompt,
      audio_url: audioContent.audioUrl,
      voice_id: audioContent.voiceId,
      title: audioContent.title,
      language: audioContent.language,
      duration: audioContent.duration,
    })
    .select();
  if (error) {
    throw new Error(`Audio DB entry Failed  : ${error.message}`);
  }
  return data[0].id;
};

export async function addAudioUrl(publicUrl: string, voice_id: string, prompt: string) {
  const { data, error } = await supabase
    .from('audio_content')
    .insert({
      prompt: prompt,
      audio_url: publicUrl,
      voice_id: voice_id,
    })
    .select();
  if (error) {
    throw new Error(`Audio DB entry Failed  : ${error.message}`);
  }
  return data[0].id;
}

export const getAudioContent = async (user_id: string) => {
  const { data, error } = await supabase
    .from('audio_content')
    .select()
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch audio content: ${error.message}`);
  }

  return data;
};

export const deleteAudioContent = async (id: string, user_id: string) => {
  const { error } = await supabase
    .from('audio_content')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);
  if (error) {
    throw new Error(`Failed to delete audio content: ${error.message}`);
  }
};
