import Link from 'next/link';

const featureHighlights = [
  {
    title: 'Unified Cash Control',
    description:
      'Connect banking, cards, payroll, and treasury in minutes. Automate reconciliation while keeping every team on the same source of truth.',
    stat: '35+ native connectors',
  },
  {
    title: 'Intelligence On Demand',
    description:
      'Forecast liquidity, monitor risk exposure, and surface anomalies with real-time AI copilots tuned for finance teams.',
    stat: 'Predictive alerts every hour',
  },
  {
    title: 'Workflows That Scale',
    description:
      'Design approvals, close checklists, and vendor onboarding once - reuse them across entities without losing visibility.',
    stat: '8x faster month-end close',
  },
];

const operatingPillars = [
  {
    label: 'Plan',
    details: 'Scenario planning, rolling forecasts, OKR alignment, and board reporting - always current.',
  },
  {
    label: 'Operate',
    details: 'AR/AP automation, vendor health, spend controls, and global entity consolidation in one workspace.',
  },
  {
    label: 'Grow',
    details: 'Revenue intelligence, pricing simulations, and growth metrics backed by clean, trusted data.',
  },
];

const metricHighlights = [
  { metric: '99.99%', label: 'data uptime backed by SOC 2 and ISO compliance.' },
  { metric: '4.8/5', label: 'average rating from CFOs and controllers using Zoltraak.' },
  { metric: '<12 hrs', label: 'time to deploy your first automated workflow.' },
];

export default function HomePage() {
  return (
    <div className="pb-24 pt-16">
      <div className="mx-auto max-w-6xl space-y-24 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background via-background to-primary/10 p-10 shadow-sm sm:p-16">
          <div className="absolute inset-y-0 right-[-10%] hidden w-1/2 rounded-full bg-primary/20 blur-3xl lg:block" />
          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_minmax(0,0.9fr)] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-primary">
                Zoltraak Finance Cloud
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Orchestrate every dollar from a single financial command center.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Zoltraak unifies all of your financial apps into one intelligent platform, giving leaders live
                  visibility, teams automated workflows, and stakeholders real-time answers without spreadsheets.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Start free workspace
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Talk with finance expert
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span>Trusted by finance teams at</span>
                <span className="font-semibold text-foreground">Atlas Labs</span>
                <span className="font-semibold text-foreground">Northwind Commerce</span>
                <span className="font-semibold text-foreground">Aurora Ventures</span>
                <span className="font-semibold text-foreground">Sierra Medical</span>
              </div>
            </div>
            <div className="relative isolate">
              <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-2xl" />
              <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-xl">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Global cash position</span>
                  <span>Live</span>
                </div>
                <p className="text-3xl font-semibold text-foreground">$38,742,910</p>
                <div className="grid gap-3 rounded-xl border bg-background p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Working capital</span>
                    <span className="font-medium text-emerald-500">+$1,204,320</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Burn rate</span>
                    <span className="font-medium text-rose-500">$482,110</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Runway</span>
                    <span className="font-medium text-primary">18.4 months</span>
                  </div>
                </div>
                <div className="rounded-xl border bg-background p-4 text-sm">
                  <p className="font-semibold text-foreground">AI briefing</p>
                  <p className="text-muted-foreground">
                    Cash reserves increased 4.2% week-over-week. Vendor payments automated with new approval flow for
                    EMEA entities. Suggest reviewing Pricing Playbook scenario B.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A suite of financial apps that work in concert</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Build your financial operating system with modular apps that share the same data, governance, and AI
              layer. Adopt one product or the entire stack, then scale at your pace.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col justify-between gap-6 rounded-2xl border bg-card p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-wide text-primary">
                  {feature.stat}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 rounded-3xl border bg-card p-8 shadow-sm lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:p-12">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Operating system</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Built around how finance teams actually plan, operate, and grow.
            </h2>
            <p className="text-muted-foreground">
              Whether you run a high-growth startup or a multi-entity enterprise, Zoltraak adapts to your structure
              and scales governance automatically. Plug into the apps you already use, and expand into new modules
              without migrations.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {operatingPillars.map((pillar) => (
                <div key={pillar.label} className="rounded-2xl border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">{pillar.label}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{pillar.details}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Sits on top of</span>
              <span>NetSuite</span>
              <span>QuickBooks</span>
              <span>Workday</span>
              <span>Stripe</span>
              <span>Salesforce</span>
            </div>
          </div>
          <div className="space-y-6 rounded-2xl border bg-background p-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Security & Reliability</p>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade compliance, audit-ready logs, and granular permissions ensure every workflow is
                controlled and transparent.
              </p>
            </div>
            <dl className="grid gap-4">
              {metricHighlights.map((item) => (
                <div key={item.metric} className="rounded-xl border p-4">
                  <dt className="text-2xl font-semibold text-foreground">{item.metric}</dt>
                  <dd className="text-xs text-muted-foreground">{item.label}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
              SOC 2 Type II | GDPR | HIPAA-ready | Single sign-on | Regional hosting
            </div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1fr_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-6 rounded-3xl border bg-card p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Customer spotlight</p>
            <p className="text-lg text-muted-foreground">
              "With Zoltraak, our finance apps finally speak the same language. We close books in days, forecast in
              minutes, and answer investor questions before they hit our inbox."
            </p>
            <div>
              <p className="text-sm font-semibold text-foreground">Linh Carter</p>
              <p className="text-xs text-muted-foreground">CFO, Horizon Biotech</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-xs uppercase tracking-wide text-primary">
              47% faster board reporting - 23 countries consolidated - Zero spreadsheet macros
            </div>
          </div>
          <div className="space-y-4 text-left lg:text-right">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Launch your next finance initiative without replatforming.
            </h2>
            <p className="text-muted-foreground">
              Our solution architects partner with your finance, RevOps, and IT teams to ship value in the first
              week. Iterate quickly with modular apps and shared data models that stay audit-ready.
            </p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground lg:items-end">
              <div className="flex items-center gap-2 text-foreground">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                Guided onboarding playbooks for every industry segment.
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                Dedicated slack channel with finance operators and solution engineers.
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                Community of 2,500+ controllers sharing best practices.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-primary/10 p-10 text-center shadow-sm sm:p-16">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Get started</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to unify your financial stack?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Spin up a free workspace, connect your first data source, and invite your team. Prefer a guided tour?
            We'll tailor a demo to your KPIs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Create workspace
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Schedule demo
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
