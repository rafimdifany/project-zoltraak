import { z } from 'zod';

export const budgetIdSchema = z.object({
  id: z.string().uuid()
});

export const createBudgetSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date()
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

export const updateBudgetSchema = createBudgetSchema.partial();

export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
