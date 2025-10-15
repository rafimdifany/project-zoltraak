import { z } from 'zod';

export const assetIdSchema = z.object({
  id: z.string().uuid()
});

export const createAssetSchema = z.object({
  name: z.string().min(1),
  category: z.string().max(100).optional(),
  currentValue: z.number().nonnegative()
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = createAssetSchema.partial();

export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
