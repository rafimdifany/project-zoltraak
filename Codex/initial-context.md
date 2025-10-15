# 🪙 Project Zoltraak – Intelligent Financial Dashboard

## 🎯 Overview
**Zoltraak** adalah aplikasi **financial dashboard dan personal finance tracker** yang akan berkembang menjadi **SaaS platform** lintas platform (Web + Android + iOS).  
Tujuan: membantu pengguna mencatat, menganalisis, dan mengoptimalkan keuangan pribadi maupun bisnis kecil menggunakan AI dan realtime insight.

---

## 🧭 Product Phases

### 🏁 Phase 1 – MVP (Personal Expense Tracker)
- Stack: **PERN Monorepo (PostgreSQL, Express, React(Next.js), Node.js)**
- Fitur:
  - Catat pemasukan & pengeluaran
  - Budget bulanan dan aset
  - Dashboard overview (grafik, kategori, total)
  - Login & register user
- Semua fitur **gratis**
- Fokus:
  - MVP cepat jadi (1 monorepo)
  - Backend REST API ringan
  - Frontend modern (Next.js 15)
  - ORM: Prisma
  - Auth: JWT / OAuth2
  - Deployment: Vercel (frontend) + Zeabur / Railway (backend)

### 💡 Phase 2 – AI Financial Insight (Premium)
- Tambahan fitur **berbayar (subscription)**:
  - AI insight & rekomendasi budgeting
  - Prediksi arus kas & pengingat finansial
- Tambahkan **FastAPI (Python)** microservice untuk:
  - Analisis data transaksi
  - Generasi insight & rekomendasi
- Komunikasi antar service via REST / Message Broker (Kafka / NATS)

### 🏢 Phase 3 – Business Multi-Branch (SaaS)
- Target: bisnis kecil / UMKM
- Fitur:
  - Role admin owner & kasir
  - Pencatatan transaksi multi-cabang realtime
  - Dashboard monitoring live
  - Subscription billing per bisnis
- Tambahkan **Go (Fiber)** realtime service
- Gunakan Kafka / NATS / Redis Stream untuk broadcast event

---

## ⚙️ Backend Architecture (Phase 1 – PERN)

| Komponen | Teknologi | Deskripsi |
|-----------|------------|------------|
| **Runtime** | Node.js 22+ | Eksekusi backend |
| **Framework** | Express.js | REST API modular |
| **ORM** | Prisma | ORM untuk PostgreSQL |
| **Database** | PostgreSQL | Data utama transaksi & user |
| **Validation** | Zod / express-validator | Validasi input |
| **Auth** | JWT / OAuth2 (Google) | Login & session |
| **Caching** | Redis (optional) | Cache summary/dashboard |
| **Testing** | Jest / Supertest | Unit & integration test |
| **Docs** | Swagger / Redoc | API Documentation |
| **Deployment** | Zeabur / Railway | Dockerized |

---

## 🧩 Frontend (Phase 1 – Next.js)

| Komponen | Teknologi | Deskripsi |
|-----------|------------|------------|
| **Framework** | Next.js 15 (App Router) | SSR/SSG dashboard |
| **UI** | TailwindCSS + shadcn/ui | Dashboard modern |
| **State Management** | React Query | API caching & revalidation |
| **Auth** | NextAuth.js | Google/email login |
| **Charting** | Recharts / Chart.js | Visualisasi income & expense |
| **Deployment** | Vercel | CI/CD otomatis |

---

## 🧱 Monorepo Structure (Phase 1 – PERN)

```bash
zoltraak/
├── apps/
│   ├── backend/             # ExpressJS + Node.js + Prisma
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── transaction/
│   │   │   │   ├── budget/
│   │   │   │   ├── asset/
│   │   │   │   └── dashboard/
│   │   │   ├── middleware/
│   │   │   ├── config/
│   │   │   ├── server.ts
│   │   │   └── app.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/            # Next.js 15 Web App
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/
│       │   │   ├── dashboard/
│       │   │   ├── budget/
│       │   │   └── layout.tsx
│       │   ├── components/
│       │   ├── lib/
│       │   └── hooks/
│       ├── public/
│       ├── package.json
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       └── next.config.mjs
│
├── packages/
│   ├── types/               # Shared TypeScript interfaces (Transaction, User, Budget, etc)
│   └── utils/               # Shared helpers (formatters, constants)
│
├── docker-compose.yml
├── package.json             # Root workspace manager
├── tsconfig.base.json
└── README.md


##Shared Types Example
```bash
packages/types/Transaction.ts
export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  notes?: string;
}
```


## Infra & DevOps
- Docker + Docker Compose
- GitHub Actions (build-test-deploy)
- Cloudflare (DNS + SSL + CDN)
- Grafana + Axiom / Loki (logging & metrics)
- Zeabur / Vercel / Railway (hosting)
- Expo EAS (mobile CI/CD untuk future phase)

## Security & Multi-Tenant
- JWT / OAuth2 authentication
- RBAC roles: user / premium / admin / owner
- tenant_id isolation di DB
- Rate Limiter (Redis)
- Data encryption (pgcrypto)
- Scheduled backup (pg_dump → S3/R2)


## Roadmap Summary
| Phase | Fokus                      | Stack                                     |
| ----- | -------------------------- | ----------------------------------------- |
| **1** | MVP Personal Tracker       | **PERN (Postgres, Express, React, Node)** |
| **2** | AI Insight Premium         | + **FastAPI (Python)**                    |
| **3** | Multi-Branch Business SaaS | + **Go (Fiber)** Realtime                 |


## Notes
- Project name: Zoltraak
- Monorepo layout: backend (Express) + frontend (Next.js)
- Backend: Node.js + Express + Prisma
- Frontend: Next.js 15 + Tailwind
- DB: PostgreSQL + Redis
- AI Service (Phase 2): FastAPI (Python)
- Realtime Service (Phase 3): Go (Fiber)
- Current goal: Implement Phase 1 (PERN monorepo) → auth, transaction, budget, asset, dashboard API + Next.js frontend integration.
