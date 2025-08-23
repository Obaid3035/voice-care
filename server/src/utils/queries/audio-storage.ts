import { supabase } from '../../config/services.config';

export async function uploadAudioToStorage(fileName: string, audioBuffer: Buffer) {
  const { data, error } = await supabase.storage.from('audio').upload(fileName, audioBuffer, {
    contentType: 'audio/mpeg',
    upsert: false,
  });
  if (error) {
    throw new Error(`Failed to upload audio to Storage : ${error.message}`);
  }
  return data;
}
export async function getAudioUrlFromStorage(fileName: string) {
  const publicUrl = await supabase.storage.from('audio').getPublicUrl(fileName);
  return publicUrl.data.publicUrl;
}
