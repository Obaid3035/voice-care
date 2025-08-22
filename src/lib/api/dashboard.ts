import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get auth token
async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token;
}

// Dashboard API functions
export async function getDashboardData() {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}

export async function getLogs() {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }

  return response.json();
}

export async function getSnapshots() {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/snapshots`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch snapshots');
  }

  return response.json();
}

export async function deleteSnapshot(id: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/snapshots/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete snapshot');
  }

  return response.json();
}
