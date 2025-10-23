import { ArrowUpRight, CalendarDays, Download } from 'lucide-react';

import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { Button } from '@/components/ui/button';

const segments = ['Overview', 'Budgets', 'Assets'];

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-border bg-card px-5 py-5 dark:border-white/5 dark:bg-[#141924] sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground dark:text-slate-400">
              executive summary
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Financial overview</h1>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Track performance, review portfolio health, and act on opportunities instantly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              className="border border-border bg-transparent text-foreground hover:bg-muted/70 dark:border-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Monthly
            </Button>
            <Button
              type="button"
              className="border border-border bg-transparent text-foreground hover:bg-muted/70 dark:border-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Export report
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {segments.map((segment) => (
              <button
                key={segment}
                type="button"
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  segment === 'Overview'
                    ? 'border border-border bg-muted text-foreground dark:border-white/10 dark:bg-white/10 dark:text-slate-100'
                    : 'border border-border bg-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100'
                }`}
              >
                {segment}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-transparent px-4 py-1 text-xs text-muted-foreground dark:border-white/5 dark:text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span className="text-foreground dark:text-slate-300">
              Portfolio up 12.4% this quarter
            </span>
            <ArrowUpRight className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
          </div>
        </div>
      </div>
      <DashboardOverview />
    </section>
  );
}
