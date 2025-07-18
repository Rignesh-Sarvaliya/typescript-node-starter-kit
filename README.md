# 🚀 Node.js + TypeScript Starter Kit

This project is an open source template for building robust APIs with Node.js. It combines a clean architecture approach with TypeScript, Express and Prisma so teams can quickly bootstrap production ready services.

Designed to be modular and scalable, the kit includes Redis backed sessions, a testing setup with Jest and Supertest, and a complete admin/user separation out of the box.

---

## Directory Overview

```text
src/                     # Application source
├── api/                 # Swagger docs and route entry points
├── config/              # Environment helpers and global config
├── constants/           # App-wide enums and messages
├── decorators/          # Route decorators such as logging
├── domain/              # DDD entities, interfaces and value objects
├── events/              # Event emitters and listeners
├── jobs/                # BullMQ queues and processors
├── middlewares/         # Auth, rate limiting and validation
├── repositories/        # Database access via Prisma
├── requests/            # Zod request validators
├── resources/           # Response wrappers
├── routes/              # Route controllers (admin & user)
├── services/            # Business logic layer
├── telemetry/           # Sentry integration
├── templates/           # Email templates
├── types/               # Custom TypeScript types
├── utils/               # Helper utilities
├── index.ts             # App entry point
└── server.ts            # Express bootstrap

prisma/                  # Prisma schema, migrations and seeds
scripts/                 # Helper scripts (workers, CLI utilities)
tests/                   # Jest + Supertest suites
services/               # Independent microservice packages
  auth/
    src/
  users/
    src/
  notifications/
    src/
  gateway/
    src/
  common/
    src/
```

---

## 🛠 Installation

Install the dependencies:

```bash
npm install
```

---

## 🔐 Auth System

- User registration, login and OTP flow
- Admin login with session management
- Redis backed session and OTP cache
- Uses `express-session` and `connect-redis`

---

## ✅ Modules Implemented

### 👤 Users
- Register/Login
- OTP + Forgot Password
- Profile update & change password
- Notifications (list, mark read, clear)
- Logout (destroy session)

### 🧑‍💼 Admin
- Login
- User management
- App Settings CRUD
- App Menu Links
- App Variables
- User Export (CSV/XLSX)

---

## 🧪 Testing

- Jest + Supertest configured in `tests/`
- `ts-jest` with `.env.test`
- Seed script available at `prisma/seed.ts`

Run all tests:

```bash
npm run test
```

---

## 🔁 Run in Dev Mode

```bash
npm run dev
```

`nodemon.json` watches the `src` folder and runs `ts-node` on changes.

### Run All Microservices

```bash
npm run microservices
```

This starts the gateway, auth, users and notifications services on ports 3000-3003.

Each service relies on packages from the root `node_modules` folder. Run `npm install` once at the project root before starting the microservices.

When running locally you can access each service directly:

- Gateway: <http://localhost:3000>
- Auth: <http://localhost:3001>
- Users: <http://localhost:3002>
- Notifications: <http://localhost:3003>

Visiting the root URL of each service now returns a plain text message
indicating which service is running instead of "Cannot GET /".

---

## 🌱 Seed Sample Data

```bash
npm run seed
# or
ts-node prisma/seed.ts
```

---

## ⚙️ Prisma Commands

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

---

## 🌐 Environment Setup

Create `.env` and `.env.test` from `.env.example` and adjust the values:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/smartinbox
REDIS_URL=redis://localhost:6379
SESSION_SECRET=mysecret
```

`src/config/env.ts` exposes helpers like `isProduction` so code can check the runtime environment easily.

---

## 🔄 GitHub Actions CI

The `ci.yml` workflow runs tests on every push or PR:
- Spins up PostgreSQL & Redis
- Runs Prisma migrations
- Executes Jest + Supertest

---

## 📤 Export API

```http
GET /admin/export/users/csv
GET /admin/export/users/xlsx
```

---

## 📦 Build & Start Production

```bash
npm run build
npm start
```

### Health Check

The server exposes `/api/health` to report uptime and version information.

---

## ✨ Built With

- TypeScript + Node.js
- Express
- Prisma ORM + PostgreSQL
- Redis
- Zod (validation)
- Helmet & compression
- Supertest + Jest
- Sentry (telemetry ready)
- Modular directory structure

---

> Built for scale. Designed for clarity.
