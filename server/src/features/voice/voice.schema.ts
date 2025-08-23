import { z } from 'zod';

export const UploadVoiceSchema = z.object({
  name: z.string().min(1, 'name is required'),
  language: z.enum(['en']),
  duration: z
    .number()
    .min(1, 'duration is required')
    .transform((val) => Number(val)),
  size: z
    .number()
    .min(1, 'size is required')
    .transform((val) => Number(val)),
});

export type UploadVoiceInput = z.infer<typeof UploadVoiceSchema>;
