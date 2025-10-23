'use client';

import { useCurrencyFormatter } from '@/hooks/use-currency';
import type { Asset } from '@zoltraak/types';

type AssetsSummaryProps = {
  assets: Asset[];
};

export function AssetsSummary({ assets }: AssetsSummaryProps) {
  const { format } = useCurrencyFormatter();

  if (!assets.length) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground dark:border-white/10 dark:bg-[#141924] dark:text-slate-400">
        Link your savings, investments, or other assets to surface portfolio value here.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 dark:border-white/5 dark:bg-[#141924]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Assets under watch</h2>
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            Diversify across accounts and monitor value shifts in real-time.
          </p>
        </div>
        <span className="rounded-full border border-border bg-transparent px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground dark:border-white/10 dark:text-slate-300">
          {assets.length} holdings
        </span>
      </div>

      <ul className="space-y-3">
        {assets.map((asset) => (
          <li
            key={asset.id}
            className="flex items-center justify-between rounded-2xl border border-border bg-muted px-4 py-3 text-sm dark:border-white/10 dark:bg-[#181d29] dark:text-slate-200"
          >
            <div>
              <p className="font-medium">{asset.name}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground dark:text-slate-400">
                {asset.group.name}
              </p>
            </div>
            <span className="rounded-lg bg-background px-3 py-1 font-semibold dark:bg-[#1f2534]">
              {format(asset.currentValue)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
