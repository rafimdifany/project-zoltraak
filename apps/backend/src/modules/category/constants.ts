import type { CategoryType } from '@prisma/client';

export type DefaultCategoryConfig = {
  type: CategoryType;
  name: string;
  subcategories?: string[];
};

export const DEFAULT_CATEGORIES: DefaultCategoryConfig[] = [
  { type: 'EXPENSE', name: 'Food' },
  { type: 'EXPENSE', name: 'Social Life' },
  { type: 'EXPENSE', name: 'Pets', subcategories: ['Pet Food', 'Cat Litter', 'Grooming'] },
  { type: 'EXPENSE', name: 'Transport' },
  { type: 'EXPENSE', name: 'Culture' },
  { type: 'EXPENSE', name: 'Household' },
  { type: 'EXPENSE', name: 'Beauty' },
  { type: 'EXPENSE', name: 'Health' },
  { type: 'EXPENSE', name: 'Education' },
  { type: 'EXPENSE', name: 'Gift' },
  { type: 'EXPENSE', name: 'Installment' },
  { type: 'INCOME', name: 'Allowance' },
  { type: 'INCOME', name: 'Salary' },
  { type: 'INCOME', name: 'Petty Cash' },
  { type: 'INCOME', name: 'Bonus' },
  { type: 'INCOME', name: 'Other' }
];
