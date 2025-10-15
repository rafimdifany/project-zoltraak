import { z } from 'zod';

export const transactionIdSchema = z.object({
  id: z.string().uuid()
});

export const createTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  amount: z.number().positive(),
  occurredAt: z.coerce.date(),
  description: z.string().max(500).optional(),
  budgetId: z.string().uuid().nullable().optional()
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema.partial();

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
