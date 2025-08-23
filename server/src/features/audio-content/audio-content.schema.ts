import z from 'zod';

export const GenerateAudioSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
  language: z.enum([
    'en',
    'es',
    'fr',
    'de',
    'it',
    'pt',
    'nl',
    'pl',
    'ru',
    'ja',
    'ko',
    'zh',
    'ar',
    'hi',
    'tr',
  ]),
});
export type GenerateAudioInput = z.infer<typeof GenerateAudioSchema>;
