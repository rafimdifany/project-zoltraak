'use client';

import { useMemo } from 'react';
import type { DashboardTransaction } from '@zoltraak/types';

type SpendingCategoriesProps = {
  transactions: DashboardTransaction[];
};

export function SpendingCategories({ transactions }: SpendingCategoriesProps) {
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
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        Expense categories will appear here after recording transactions.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Top spending categories</h2>
        <p className="text-sm text-muted-foreground">
          Track where your money is going and adjust budgets before overspending.
        </p>
      </div>

      <div className="space-y-4">
        {rankedCategories.map((entry) => {
          const percent = totalExpense > 0 ? Math.round((entry.value / totalExpense) * 100) : 0;
          const safePercent = Math.min(100, percent);
          return (
            <div key={entry.category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium">{entry.category}</p>
                <p className="text-xs text-muted-foreground">{percent}%</p>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: `${safePercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {entry.value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
