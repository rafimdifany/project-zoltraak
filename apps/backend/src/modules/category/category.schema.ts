import { z } from 'zod';

export const categoryIdSchema = z.object({
  id: z.string().uuid()
});

export const createCategorySchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    parentId: z.string().uuid().optional().nullable()
  })
  .refine(
    (input) => {
      if (input.parentId) {
        return true;
      }

      return Boolean(input.type);
    },
    {
      message: 'Category type is required for top-level categories',
      path: ['type']
    }
  );

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z
  .object({
    name: z.string().min(1, 'Name is required').optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required to update a category'
  });

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
