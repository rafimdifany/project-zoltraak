import { CurrencyCode } from '@prisma/client';
import { z } from 'zod';

export const updateCurrencySchema = z.object({
  currency: z.nativeEnum(CurrencyCode)
});

export type UpdateCurrencyInput = z.infer<typeof updateCurrencySchema>;
