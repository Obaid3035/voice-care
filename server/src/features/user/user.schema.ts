import { z } from 'zod';

export const updateUserSchema = z.object({
  full_name: z.string().min(1, 'full_name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  onboarding: z.boolean().optional(),
});

export type OnboardUserInput = z.infer<typeof updateUserSchema>;
