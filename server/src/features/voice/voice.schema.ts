import { z } from 'zod';

export const UploadVoiceSchema = z.object({
  name: z.string().min(1, 'name is required'),
  language: z.enum(['en']),
  duration: z.coerce.number().min(1, 'duration is required'),
  size: z.coerce.number().min(1, 'size is required'),
});

export type UploadVoiceInput = z.infer<typeof UploadVoiceSchema>;
