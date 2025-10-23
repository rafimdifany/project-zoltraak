'use client';

import { useCurrencyFormatter } from '@/hooks/use-currency';
import { cn } from '@/lib/utils';
import type { BudgetWithProgress } from '@zoltraak/types';

type BudgetsSummaryProps = {
  budgets: BudgetWithProgress[];
};

export function BudgetsSummary({ budgets }: BudgetsSummaryProps) {
  const { format } = useCurrencyFormatter();

  if (!budgets.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground dark:border-white/10 dark:bg-[#141924] dark:text-slate-400">
        Create a budget to monitor allocation and stay ahead of overspending.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 dark:border-white/5 dark:bg-[#141924]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Active budgets</h2>
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            Track how close you are to the target amount for each budget period.
          </p>
        </div>
        <span className="rounded-full border border-border bg-transparent px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground dark:border-white/10 dark:text-slate-300">
          {budgets.length} active
        </span>
      </div>
      <div className="grid gap-4">
        {budgets.map((budget) => {
          const progress = Math.min(100, Math.round((budget.spent / budget.targetAmount) * 100));
          const periodLabel = `${new Date(budget.periodStart).toLocaleDateString()} – ${new Date(
            budget.periodEnd
          ).toLocaleDateString()}`;

          return (
            <div
              key={budget.id}
              className="space-y-3 rounded-2xl border border-border bg-muted p-4 dark:border-white/5 dark:bg-[#181d29]"
            >
              <div className="flex items-center justify-between text-sm dark:text-slate-200">
                <div>
                  <p className="font-medium">{budget.name}</p>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">{periodLabel}</p>
                </div>
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground dark:bg-[#1f2534] dark:text-slate-200">
                  {format(budget.spent)}/{format(budget.targetAmount)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted-foreground/20 dark:bg-white/10">
                <div
                  className={cn(
                    'h-2 rounded-full bg-primary/60 dark:bg-[#2b3142]',
                    progress > 90 && 'bg-rose-500/70 dark:bg-[#3b222b]'
                  )}
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
