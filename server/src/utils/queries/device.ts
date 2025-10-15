import { supabase } from '../../config/services.config';

export const checkUserExists = async (user_id: string) => {
  const { data, error } = await supabase.from('users').select('id').eq('id', user_id).single();

  if (error) {
    return null;
  }

  return data;
};

export const checkMacAddressExists = async (mac_address: string) => {
  const { data, error } = await supabase
    .from('devices')
    .select('id, mac_address')
    .eq('mac_address', mac_address)
    .single();

  if (error) {
    return null;
  }

  return data;
};

export const createDevice = async (user_id: string, mac_address: string) => {
  const { data, error } = await supabase
    .from('devices')
    .insert({
      user_id,
      mac_address: mac_address,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create device: ${error.message}`);
  }

  return data;
};

export const createDeviceToken = async (
  device_id: string,
  token: string,
  expires_at: string,
  user_id: string
) => {
  console.log('Creating device token', device_id, token, expires_at);
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      device_id,
      token,
      expires_at,
      user_id,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create device token: ${error.message}`);
  }

  return data;
};
