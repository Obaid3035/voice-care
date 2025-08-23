import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import type { Database } from '../types/supabase';
import { env } from './env.config';

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});
export const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export const elevenLabsClient = new ElevenLabsClient({
  apiKey: env.ELEVENLABS_API_KEY,
});
