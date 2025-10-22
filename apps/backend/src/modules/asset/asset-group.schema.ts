import { z } from 'zod';

export const createAssetGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
});

export type CreateAssetGroupInput = z.infer<typeof createAssetGroupSchema>;
