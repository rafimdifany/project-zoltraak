'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import type { DashboardTransaction } from '@zoltraak/types';

type RecentTransactionsProps = {
  transactions: DashboardTransaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions.length) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
        No transactions yet. Start tracking your income and expenses to see them here.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent transactions</h2>
        <span className="text-xs text-muted-foreground">Last 5 records</span>
      </div>

      <ul className="space-y-4">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === 'INCOME';
          const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

          return (
            <li key={transaction.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isIncome ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.occurredAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  isIncome ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {`${isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
