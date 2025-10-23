import { Banknote, PiggyBank, TrendingUp, Wallet } from 'lucide-react';

import { useCurrencyFormatter } from '@/hooks/use-currency';
import type { DashboardTotals } from '@zoltraak/types';
import { cn } from '@/lib/utils';

type OverviewCardsProps = {
  totals: DashboardTotals;
};

const overviewConfig = [
  {
    key: 'income' as const,
    label: 'Income',
    icon: TrendingUp,
    accent: 'text-emerald-500 dark:text-emerald-300',
    chip: '+12.4%',
    chipTone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
  },
  {
    key: 'expense' as const,
    label: 'Expenses',
    icon: Banknote,
    gradient: 'from-rose-500/25 via-rose-500/10 to-slate-950/60',
    accent: 'text-rose-300',
    chip: '-4.2%',
    chipTone: 'bg-rose-500/10 text-rose-300'
  },
  {
    key: 'net' as const,
    label: 'Net cashflow',
    icon: PiggyBank,
    gradient: 'from-blue-500/25 via-indigo-500/10 to-slate-950/60',
    accent: 'text-blue-300',
    chip: '+8.1%',
    chipTone: 'bg-blue-500/10 text-blue-300'
  },
  {
    key: 'assets' as const,
    label: 'Assets under watch',
    icon: Wallet,
    gradient: 'from-purple-500/25 via-purple-500/10 to-slate-950/60',
    accent: 'text-purple-300',
    chip: '+15 holdings',
    chipTone: 'bg-purple-500/10 text-purple-300'
  }
];

export function OverviewCards({ totals }: OverviewCardsProps) {
  const { format, currency: activeCurrency } = useCurrencyFormatter();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewConfig.map(({ key, label, icon: Icon, accent, chip, chipTone }) => {
        const formattedValue = format(totals[key]);
        const numericValue = formattedValue.replace(/[^\d.,\-]+/g, '');
        const digitCount = numericValue.replace(/\D/g, '').length;
        const valueSizeClass =
          digitCount >= 16 ? 'text-base' : digitCount >= 13 ? 'text-lg' : digitCount >= 10 ? 'text-xl' : 'text-2xl';
        const currencyLabel = (totals.currency ?? activeCurrency ?? '').toUpperCase();

        return (
          <div
            key={key}
            className={cn(
              'group relative overflow-hidden rounded-3xl border border-border bg-card p-5 transition dark:border-white/5 dark:bg-[#141924]'
            )}
          >
            <div className="absolute inset-px rounded-[22px] border border-border/70 group-hover:border-border dark:border-white/5 dark:group-hover:border-white/10" />
            <div className="relative flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground dark:text-slate-400">
                  {label}
                </p>
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  {currencyLabel ? (
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-400">
                      {currencyLabel}
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      'break-words font-semibold leading-tight tabular-nums',
                      valueSizeClass,
                      digitCount >= 16 && 'tracking-tight'
                    )}
                  >
                    {numericValue}
                  </span>
                </div>
              </div>
              <span className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60 dark:border-white/10 dark:bg-[#1c2230]">
                <Icon className={cn('h-5 w-5', accent)} />
              </span>
            </div>
            <div className="relative mt-6 flex items-center gap-2 text-xs text-muted-foreground dark:text-slate-300">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold',
                  chipTone
                )}
              >
                {chip}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                vs previous period
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
