## Zoltraak Monorepo

Phase 1 for the Zoltraak intelligent financial dashboard. This workspace hosts the PERN stack MVP: an Express + Prisma backend and a Next.js 15 frontend, alongside shared utility packages.

### Structure
- `apps/backend` – Express REST API, Prisma ORM, PostgreSQL datasource
- `apps/frontend` – Next.js 15 App Router web client with Tailwind CSS and React Query
- `packages/types` – Shared TypeScript contracts (transactions, budgets, etc.)
- `packages/utils` – Cross-cutting helpers (formatters, validation helpers)

### Toolchain
- Node.js 20+
- npm workspaces
- PostgreSQL + Redis via Docker Compose (`docker-compose.yml`)

### Getting Started
1. `npm install`
2. `npm run dev` – runs backend and frontend concurrently
3. Configure environment variables (`apps/backend/.env`, `apps/frontend/.env.local`)

See the backend and frontend README files (to be added) for detailed instructions.

Apps name : Lunaris
