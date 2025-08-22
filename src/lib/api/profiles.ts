import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get auth token
async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
}

// Profiles API functions
export async function getProfiles() {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/profiles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }

  return response.json();
}

export async function createProfile(data: any) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/profiles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create profile');
  }

  return response.json();
}

export async function updateProfile(id: string, data: any) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/profiles/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
}

export async function deleteProfile(id: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/profiles/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete profile');
  }

  return response.json();
}
