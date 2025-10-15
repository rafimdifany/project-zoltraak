import type { Asset } from './asset';
import type { BudgetWithProgress } from './budget';
import type { TransactionType } from './transaction';

export interface DashboardTotals {
  income: number;
  expense: number;
  net: number;
  assets: number;
}

export interface DashboardTransaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  occurredAt: string;
  description?: string | null;
}

export interface DashboardOverview {
  totals: DashboardTotals;
  recentTransactions: DashboardTransaction[];
  budgets: BudgetWithProgress[];
  assets: Asset[];
}
