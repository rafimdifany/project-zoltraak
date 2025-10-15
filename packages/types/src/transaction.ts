export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  occurredAt: string;
  description?: string | null;
  budgetId?: string | null;
  createdAt: string;
  updatedAt: string;
}
