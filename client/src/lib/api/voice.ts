import { supabase } from '@/lib/supabase';

// Get auth token
async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
}

// Voice API functions
export async function getVoiceClones() {
  const token = await getAuthToken();
  const response = await fetch('/api/voice-clones', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch voice clones');
  }

  return response.json();
}

export async function createVoiceClone(formData: FormData) {
  const token = await getAuthToken();
  const response = await fetch('/api/voice-clones', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create voice clone');
  }

  return response.json();
}

export async function createAudioContent(data: { prompt: string; language: string }) {
  const token = await getAuthToken();
  const response = await fetch('/api/audio-content', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function deleteVoiceClone() {
  const token = await getAuthToken();
  const response = await fetch('/api/voice-clones', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete voice clone');
  }

  return response.json();
}
