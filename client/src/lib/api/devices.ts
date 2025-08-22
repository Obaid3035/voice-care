import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get auth token
async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
}

// Devices API functions
export async function getDevices() {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }

  return response.json();
}

export async function updateDevice(id: string, data: unknown) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/devices/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update device');
  }

  return response.json();
}

export async function deleteDevice(id: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/devices/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete device');
  }

  return response.json();
}
