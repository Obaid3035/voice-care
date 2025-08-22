import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get auth token
async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
}

export async function deleteAudioContent(id: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/audio-content/${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/audio-content`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('response', response);
  if (!response.ok) {
    throw new Error('Failed to fetch audio content');
  }

  return response.json();
}
