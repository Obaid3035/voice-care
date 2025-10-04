import type { User } from '../../types';
import { supabase } from '../supabase';

async function getAuthToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log('session', session);
  return session?.access_token;
}

export const getUser = async (): Promise<User> => {
  const token = await getAuthToken();
  console.log('token', token);
  const response = await fetch('/api/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Get user error:', error);
    throw new Error(error.message);
  }

  const result = await response.json();
  console.log('result', result);
  return result.data;
};

export const updateUser = async (body: { onboarding: boolean }) => {
  const token = await getAuthToken();
  const response = await fetch('/api/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Update user error:', error);
    throw new Error(error.message);
  }

  return response.json();
};
