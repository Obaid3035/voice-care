import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'testing', 'production']).default('production'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  PORT: z.string().optional(),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.string().optional(),

  ELEVENLABS_API_KEY: z.string().min(1, 'ELEVENLABS_API_KEY is required'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
});

type EnvConfig = z.infer<typeof envSchema>;

function loadEnvConfig(): EnvConfig & { EFFECTIVE_PORT: number } {
  const nodeEnv = process.env.NODE_ENV ?? 'production';
  const envFileName = nodeEnv === 'testing' ? '.env.test' : '.env';

  console.log('envFileName', envFileName);
  console.log('__dirname', path.join(__dirname, '..', '..', envFileName));
  const envPath = path.join(__dirname, '..', '..', envFileName);

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  const parsed = envSchema.parse(process.env);

  const EFFECTIVE_PORT = Number(parsed.PORT ?? parsed.API_PORT ?? 3000);

  return { ...parsed, EFFECTIVE_PORT };
}

export const env = loadEnvConfig();
