'use client';

import { useMemo } from 'react';
import { useCurrencyFormatter } from '@/hooks/use-currency';
import type { DashboardTransaction } from '@zoltraak/types';

type SpendingCategoriesProps = {
  transactions: DashboardTransaction[];
};

export function SpendingCategories({ transactions }: SpendingCategoriesProps) {
  const { format } = useCurrencyFormatter();

  const { rankedCategories, totalExpense } = useMemo(() => {
    const expenses = transactions.filter((transaction) => transaction.type === 'EXPENSE');

    const totals = expenses.reduce<Record<string, number>>((acc, transaction) => {
      const key = transaction.category || 'Uncategorized';
      acc[key] = (acc[key] ?? 0) + transaction.amount;
      return acc;
    }, {});

    const entries = Object.entries(totals)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const total = entries.reduce((sum, entry) => sum + entry.value, 0);

    return {
      rankedCategories: entries,
      totalExpense: total
    };
  }, [transactions]);

  if (!rankedCategories.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground dark:border-white/10 dark:bg-[#141924] dark:text-slate-400">
        Expense categories will appear once transactions start flowing in.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 dark:border-white/5 dark:bg-[#141924]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Top spending categories</h2>
        <p className="text-sm text-muted-foreground dark:text-slate-400">
          Track where your money is going and adjust budgets before overspending.
        </p>
      </div>

      <div className="space-y-4">
        {rankedCategories.map((entry) => {
          const percent = totalExpense > 0 ? Math.round((entry.value / totalExpense) * 100) : 0;
          const safePercent = Math.min(100, percent);
          return (
            <div
              key={entry.category}
              className="space-y-2 rounded-2xl border border-border bg-muted p-4 dark:border-white/5 dark:bg-[#181d29]"
            >
              <div className="flex items-center justify-between text-sm text-foreground dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 dark:bg-rose-400" />
                  <p className="font-medium">{entry.category}</p>
                </div>
                <p className="text-xs text-muted-foreground dark:text-slate-400">{percent}% of spend</p>
              </div>
              <div className="h-2 rounded-full bg-muted-foreground/20 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-rose-400/80 dark:bg-[#3b222b]"
                  style={{ width: `${safePercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                {format(entry.value)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
