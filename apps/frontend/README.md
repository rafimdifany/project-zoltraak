## Zoltraak Frontend (Next.js 15)

### Commands
- `pnpm --filter @zoltraak/frontend dev` - start Next.js with the App Router
- `pnpm --filter @zoltraak/frontend build` - production build
- `pnpm --filter @zoltraak/frontend lint` - run ESLint (`next lint`)
- `pnpm --filter @zoltraak/frontend typecheck` - TypeScript project check

### Features
- App Router with route groups for authenticated vs public flows
- Tailwind CSS + shadcn-inspired UI primitives (`button`, `input`, `card`)
- React Query setup for data fetching with shared API client
- Dashboard scaffolding (totals cards, recent transactions, budgets, assets)
- Auth pages (login/register) with React Hook Form + Zod validation

### Environment Variables
Copy `.env.example` to `.env.local`.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Points to the Express API (`http://localhost:4000/api/v1`) |
| `NEXTAUTH_SECRET` | Secret for NextAuth (for future integration) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth credentials (Phase 2+) |

Extend components and hooks to integrate with the backend endpoints as they are implemented.
