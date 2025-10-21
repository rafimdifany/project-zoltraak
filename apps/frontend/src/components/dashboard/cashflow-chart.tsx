'use client';

import { useMemo, useState } from 'react';
import type { DashboardTransaction } from '@zoltraak/types';

type CashflowChartProps = {
  transactions: DashboardTransaction[];
};

type ChartPoint = {
  label: string;
  dateLabel: string;
  income: number;
  expense: number;
};

const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

const RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 }
] as const;

export function CashflowChart({ transactions }: CashflowChartProps) {
  const [rangeDays, setRangeDays] = useState<(typeof RANGE_OPTIONS)[number]['value']>(7);

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

  const points = useMemo<ChartPoint[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const basePoints = Array.from({ length: rangeDays }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (rangeDays - 1 - index));
      const key = date.toISOString();
      return {
        key,
        label: rangeDays > 14 ? dateFormatter.format(date) : dayFormatter.format(date),
        dateLabel: dateFormatter.format(date),
        income: 0,
        expense: 0
      };
    });

    const byKey = Object.fromEntries(basePoints.map((point) => [point.key.slice(0, 10), point]));

    transactions.forEach((transaction) => {
      const occurred = new Date(transaction.occurredAt);
      occurred.setHours(0, 0, 0, 0);
      const key = occurred.toISOString().slice(0, 10);
      const matched = byKey[key];
      if (!matched) {
        return;
      }
      if (transaction.type === 'INCOME') {
        matched.income += transaction.amount;
      } else {
        matched.expense += transaction.amount;
      }
    });

    return basePoints.map((point) => ({
      label: point.label,
      dateLabel: point.dateLabel,
      income: point.income,
      expense: point.expense
    }));
  }, [transactions, rangeDays]);

  const totalIncome = useMemo(
    () => points.reduce((sum, point) => sum + point.income, 0),
    [points]
  );
  const totalExpense = useMemo(
    () => points.reduce((sum, point) => sum + point.expense, 0),
    [points]
  );
  const net = totalIncome - totalExpense;

  const maxValue = Math.max(
    1,
    ...points.map((point) => Math.max(point.income, point.expense))
  );

  const chartWidth = rangeDays <= 14 ? '100%' : `${rangeDays * 56}px`;

  return (
    <div className="min-w-0 w-full rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold">Cashflow (last {rangeDays} days)</h2>
          <p className="text-sm text-muted-foreground">
            Income vs expenses aggregated by day. Keep an eye on spending spikes.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Income</p>
            <p className="text-base font-semibold text-emerald-500">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Expense</p>
            <p className="text-base font-semibold text-rose-500">
              {formatCurrency(totalExpense)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Net</p>
            <p
              className="text-base font-semibold"
              style={{ color: net >= 0 ? 'rgb(34 197 94)' : 'rgb(239 68 68)' }}
            >
              {formatCurrency(net)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        <div className="flex items-center gap-2 rounded-full border bg-background px-1 py-1 text-xs shadow-sm">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRangeDays(option.value)}
              className={`rounded-full px-3 py-1 font-medium transition ${
                option.value === rangeDays
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full overflow-x-auto">
        <div
          className="grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns:
              rangeDays <= 14
                ? `repeat(${rangeDays}, minmax(0, 1fr))`
                : `repeat(${rangeDays}, minmax(56px, 1fr))`,
            minWidth: '100%',
            width: chartWidth
          }}
        >
          {points.map((point) => (
            <div key={point.dateLabel} className="flex flex-col items-center gap-3">
              <div className="flex h-40 w-full items-end gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-4">
                <div className="flex h-full flex-1 items-end overflow-hidden rounded-lg bg-emerald-500/20">
                  <div
                    className="w-full rounded-lg bg-emerald-500 transition-all duration-300"
                    style={{ height: `${(point.income / maxValue) * 100}%` }}
                    aria-label={`Income ${formatCurrency(point.income)}`}
                  />
                </div>
                <div className="flex h-full flex-1 items-end overflow-hidden rounded-lg bg-rose-500/20">
                  <div
                    className="w-full rounded-lg bg-rose-500 transition-all duration-300"
                    style={{ height: `${(point.expense / maxValue) * 100}%` }}
                    aria-label={`Expense ${formatCurrency(point.expense)}`}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase text-muted-foreground">{point.label}</p>
                <p className="text-[11px] text-muted-foreground/80">{point.dateLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Income
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Expenses
        </div>
        <p className="ml-auto text-muted-foreground/70">
          Values update automatically as new transactions sync.
        </p>
      </div>
    </div>
  );
}
