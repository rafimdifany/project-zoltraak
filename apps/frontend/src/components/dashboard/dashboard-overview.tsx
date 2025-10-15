'use client';

import { Loader2 } from 'lucide-react';

import { useDashboardOverview } from '@/hooks/use-dashboard';
import { AssetsSummary } from './assets-summary';
import { BudgetsSummary } from './budgets-summary';
import { OverviewCards } from './overview-cards';
import { RecentTransactions } from './recent-transactions';

export function DashboardOverview() {
  const { data, isLoading, isError } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-sm text-rose-500">
        Something went wrong while loading your dashboard. Try again shortly.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverviewCards totals={data.totals} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <RecentTransactions transactions={data.recentTransactions} />
        <AssetsSummary assets={data.assets} />
      </div>
      <BudgetsSummary budgets={data.budgets} />
    </div>
  );
}
