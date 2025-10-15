import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="grid gap-10 py-12 lg:grid-cols-[1.3fr_minmax(0,1fr)] lg:items-center">
      <div className="space-y-6">
        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Phase 1 • Personal finance tracker
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Stay ahead of your money with realtime insights powered by Zoltraak.
        </h1>
        <p className="text-lg text-muted-foreground">
          Track income, expenses, budgets, and assets in one collaborative dashboard. Unlock premium AI
          forecasting, alerts, and multi-branch automation as we progress to the next phases.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Create free account
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-border px-4 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Explore dashboard
          </Link>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 transition group-hover:opacity-100" />
        <div className="grid gap-4 p-6">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total balance</span>
              <span>Last 30 days</span>
            </div>
            <p className="text-3xl font-semibold">$14,320.18</p>
          </div>
          <div className="grid gap-3 rounded-xl border bg-background p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Income</span>
              <span className="font-medium text-emerald-500">+$6,950.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expenses</span>
              <span className="font-medium text-rose-500">-$3,240.36</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Net cashflow</span>
              <span className="font-medium text-primary">+$3,709.64</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Coming soon: AI-powered insights, smart saving goals, cashflow predictions, and proactive alerts.
          </p>
        </div>
      </div>
    </div>
  );
}
