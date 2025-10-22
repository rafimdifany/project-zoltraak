import type { CurrencyCode } from './user';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  currency?: CurrencyCode | null;
  category: string;
  amount: number;
  occurredAt: string;
  description?: string | null;
  budgetId?: string | null;
  createdAt: string;
  updatedAt: string;
}
