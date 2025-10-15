import { z } from 'zod';

export const dashboardQuerySchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional()
  })
  .refine(
    ({ from, to }) => {
      if (from && to) {
        return from <= to;
      }
      return true;
    },
    { message: '`from` must be earlier than `to`' }
  );

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
