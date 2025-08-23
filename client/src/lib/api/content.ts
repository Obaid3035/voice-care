import { supabase } from '@/lib/supabase';

// Get auth token
async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
}

export async function deleteAudioContent(id: string) {
  const token = await getAuthToken();
  const response = await fetch(`/api/audio-content/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete content');
  }

  return response.json();
}

export async function getAudioContent() {
  const token = await getAuthToken();
  const response = await fetch('/api/audio-content', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch audio content');
  }

  return response.json();
}
