'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { useCurrencyFormatter } from '@/hooks/use-currency';
import type { DashboardTransaction } from '@zoltraak/types';

type RecentTransactionsProps = {
  transactions: DashboardTransaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { format } = useCurrencyFormatter();

  if (!transactions.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground dark:border-white/10 dark:bg-[#141924] dark:text-slate-400">
        No transactions yet. Start tracking your income and expenses to see them here.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 dark:border-white/5 dark:bg-[#141924]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent transactions</h2>
        <span className="rounded-full border border-border bg-transparent px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground dark:border-white/10 dark:text-slate-300">
          Last 5 records
        </span>
      </div>

      <ul className="space-y-4">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === 'INCOME';
          const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

          return (
            <li
              key={transaction.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted px-4 py-3 dark:border-white/5 dark:bg-[#181d29]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isIncome
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-300'
                      : 'bg-rose-500/10 text-rose-500 dark:text-rose-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    {new Date(transaction.occurredAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  isIncome ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                }`}
              >
                {`${isIncome ? '+' : '-'}${format(transaction.amount)}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
