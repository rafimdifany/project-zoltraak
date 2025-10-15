import { DashboardOverview } from '@/components/dashboard/dashboard-overview';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard overview</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your latest cashflow, budgets, and assets at a glance.
        </p>
      </div>
      <DashboardOverview />
    </section>
  );
}
