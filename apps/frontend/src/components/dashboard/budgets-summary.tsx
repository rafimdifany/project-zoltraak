'use client';

import { useCurrencyFormatter } from '@/hooks/use-currency';
import type { BudgetWithProgress } from '@zoltraak/types';

type BudgetsSummaryProps = {
  budgets: BudgetWithProgress[];
};

export function BudgetsSummary({ budgets }: BudgetsSummaryProps) {
  const { format } = useCurrencyFormatter();

  if (!budgets.length) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
        Create a budget to monitor spending progress.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Active budgets</h2>
        <p className="text-sm text-muted-foreground">
          Track how close you are to the target amount for each budget period.
        </p>
      </div>
      <div className="grid gap-4">
        {budgets.map((budget) => {
          const progress = Math.min(100, Math.round((budget.spent / budget.targetAmount) * 100));
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{budget.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(budget.periodStart).toLocaleDateString()} —{' '}
                    {new Date(budget.periodEnd).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(budget.spent)}/{format(budget.targetAmount)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${progress > 90 ? 'bg-rose-500' : 'bg-primary'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
