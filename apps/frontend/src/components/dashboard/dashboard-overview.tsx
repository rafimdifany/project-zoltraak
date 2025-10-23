'use client';

import { Loader2 } from 'lucide-react';

import { useDashboardOverview } from '@/hooks/use-dashboard';
import { AssetsSummary } from './assets-summary';
import { BudgetsSummary } from './budgets-summary';
import { CashflowChart } from './cashflow-chart';
import { OverviewCards } from './overview-cards';
import { RecentTransactions } from './recent-transactions';
import { SpendingCategories } from './spending-categories';

export function DashboardOverview() {
  const { data, isLoading, isError } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-border bg-card dark:border-white/5 dark:bg-[#141924]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground dark:text-slate-300" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 text-center text-sm text-rose-500 dark:border-white/5 dark:bg-[#141924] dark:text-rose-300">
        Something went wrong while loading your dashboard. Try again shortly.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverviewCards totals={data.totals} />
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <CashflowChart transactions={data.recentTransactions} />
        <SpendingCategories transactions={data.recentTransactions} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <RecentTransactions transactions={data.recentTransactions} />
        <AssetsSummary assets={data.assets} />
      </div>
      <BudgetsSummary budgets={data.budgets} />
    </div>
  );
}
