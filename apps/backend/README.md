## Zoltraak Backend (Express + Prisma)

### Dev Commands
- `npm run dev --workspace apps/backend` – start the API with hot reload
- `npm run prisma:migrate --workspace apps/backend` – run pending migrations
- `npm run prisma:seed --workspace apps/backend` – populate demo data

### Environment Variables
Copy `.env.example` to `.env` and adjust the values.

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 4000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `ACCESS_TOKEN_TTL` / `REFRESH_TOKEN_TTL` | Lifetime for issued tokens |
| `REDIS_URL` | Optional Redis instance for caching/timeouts |

### Folder Highlights
- `src/modules/**` – feature modules grouped by domain
- `src/middleware` – shared Express middlewares (auth, validation, errors)
- `src/lib` – reusable helpers (`PrismaClient`, async handler, etc.)
- `prisma/schema.prisma` – data model for PostgreSQL

### API Surface (stubbed)
- `POST /api/v1/auth/register` / `login`
- `GET/POST/PUT/DELETE /api/v1/transactions`
- `GET/POST/PUT/DELETE /api/v1/budgets`
- `GET/POST/PUT/DELETE /api/v1/assets`
- `GET /api/v1/dashboard` – aggregate finance overview
