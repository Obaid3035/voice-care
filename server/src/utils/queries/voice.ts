import { supabase } from '../../config/services.config';
import type { TablesInsert } from '../../types/supabase';

type VoiceInsert = TablesInsert<'voices'>;

export const createVoice = async (
  elevenlabs_voice_id: string,
  user_id: string,
  name: string,
  language: string,
  duration: number,
  size: number
): Promise<void> => {
  const voiceData: VoiceInsert = {
    elevenlabs_voice_id,
    user_id,
    name,
    language,
    duration,
    size,
  };

  const { error } = await supabase.from('voices').insert(voiceData);

  if (error) {
    throw new Error(`Failed to insert voice in database: ${error.message}`);
  }
};

export const voiceExist = async (user_id: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('voices')
    .select('id')
    .eq('user_id', user_id)
    .limit(1);

  if (error) {
    throw new Error(`Error checking user_id exist in voices table: ${error.message}`);
  }

  return data && data.length > 0;
};

export const getVoiceByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from('voices')
    .select()
    .eq('user_id', user_id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get voice of user_id: ${error.message}`);
  }

  return data;
};

export const deleteVoice = async (user_id: string): Promise<void> => {
  const { error } = await supabase.from('voices').delete().eq('user_id', user_id);

  if (error) {
    throw new Error(`Failed to delete voice from database: ${error.message}`);
  }
};
