import { supabase } from '../../config/services.config';
import type { TablesUpdate } from '../../types/supabase';

type UserUpdateData = TablesUpdate<'users'>;

export const getUserById = async (user_id: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', user_id).single();

  if (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }

  return data;
};

export const updateUser = async (user_id: string, updateData: UserUpdateData) => {
  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined)
  );

  if (Object.keys(filteredUpdateData).length === 0) {
    throw new Error('No valid fields provided for update');
  }

  console.log('filteredUpdateData', filteredUpdateData);
  console.log('user_id', user_id);

  const { data, error } = await supabase.from('users').update(filteredUpdateData).eq('id', user_id);

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
};
