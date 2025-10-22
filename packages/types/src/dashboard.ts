import type { Asset } from './asset';
import type { BudgetWithProgress } from './budget';
import type { CurrencyCode } from './user';
import type { TransactionType } from './transaction';

export interface DashboardTotals {
  income: number;
  expense: number;
  net: number;
  assets: number;
  currency: CurrencyCode | null;
}

export interface DashboardTransaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  occurredAt: string;
  currency: CurrencyCode | null;
  description?: string | null;
}

export interface DashboardOverview {
  totals: DashboardTotals;
  recentTransactions: DashboardTransaction[];
  budgets: BudgetWithProgress[];
  assets: Asset[];
}
