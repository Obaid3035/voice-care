import { z } from 'zod';

export const provisionDeviceParamsSchema = z.object({
  user_id: z.string().uuid('Invalid user ID format'),
  mac_address: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format'),
});

export type ProvisionDeviceParams = z.infer<typeof provisionDeviceParamsSchema>;

