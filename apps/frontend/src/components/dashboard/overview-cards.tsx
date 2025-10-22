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
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    key: 'expense' as const,
    label: 'Expenses',
    icon: Banknote,
    accent: 'text-rose-500',
    bg: 'bg-rose-500/10'
  },
  {
    key: 'net' as const,
    label: 'Net Cashflow',
    icon: PiggyBank,
    accent: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    key: 'assets' as const,
    label: 'Assets',
    icon: Wallet,
    accent: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  }
];

export function OverviewCards({ totals }: OverviewCardsProps) {
  const { format } = useCurrencyFormatter();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewConfig.map(({ key, label, icon: Icon, accent, bg }) => (
        <div key={key} className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', bg)}>
              <Icon className={cn('h-4 w-4', accent)} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold">{format(totals[key])}</p>
        </div>
      ))}
    </div>
  );
}
