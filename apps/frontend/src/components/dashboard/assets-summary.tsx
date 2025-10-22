'use client';

import type { Asset } from '@zoltraak/types';

type AssetsSummaryProps = {
  assets: Asset[];
};

export function AssetsSummary({ assets }: AssetsSummaryProps) {
  if (!assets.length) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-sm text-muted-foreground">
        Link your savings, investments, or other assets to see their value here.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Assets</h2>
        <p className="text-sm text-muted-foreground">Total value across all tracked assets.</p>
      </div>

      <ul className="space-y-3">
        {assets.map((asset) => (
          <li key={asset.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{asset.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{asset.group.name}</p>
            </div>
            <span className="font-semibold">
              {asset.currentValue.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD'
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
