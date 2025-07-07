# 🚀 Node.js + Typescript Starter Kit

A modular, scalable Node.js + TypeScript backend with clean architecture, Prisma ORM, Redis, Supertest, and admin/user separation — built for production-ready apps.

---

## 🗂️ Folder Structure

```
src/
├── api/              # Route entry points
├── constants/        # Global enums, messages
├── decorators/       # Route-level logging
├── domain/           # DDD: entities, value objects, interfaces
├── events/           # Emitters/listeners
├── jobs/             # Logging & async events
├── locales/          # i18n language support
├── middlewares/      # Auth/session/validation
├── repositories/     # Prisma DB access
├── requests/         # Zod validators
├── resources/        # Response formatting
├── routes/           
│   ├── admin/        # Admin route logic
│   └── user/         # User route logic
├── telemetry/        # Sentry, Prometheus
├── types/            # Extended Express types
├── utils/            # Caching, hashing, i18n
├── index.ts          # Entry file
└── server.ts         # Express bootstrap
```

---

## 🛠 Installation

Install project dependencies (including Jest for running tests):

```bash
npm install
```

---

## 🔐 Auth System

- User auth (register/login/OTP/forgot-password)
- Admin auth with session-based login
- Redis-backed session and OTP cache
- `express-session` + `connect-redis`

---

## ✅ Modules Implemented

### 👤 Users
- Register/Login
- OTP + Forgot Password
- Profile update, change password
- Notifications (list, mark read, clear)
- Logout (destroy session)

### 🧑‍💼 Admin
- Login
- Admin-only user management
- App Settings CRUD
- App Menu Links (e.g. Terms, Privacy)
- App Variables (dynamic keys)
- User Export (CSV/XLSX)

---

## 🧪 Testing

- Jest + Supertest setup (`tests/`)
- `ts-jest` with `.env.test`
- Test-ready seed script: `prisma/seed.ts`

```bash
npm run test
```

---

## 🔁 Run in Dev Mode

```bash
npm run dev
```

With `nodemon.json`:

```json
{
  "watch": ["src"],
  "exec": "ts-node src/index.ts"
}
```

---

## 🌱 Seed Sample Data

```bash
npm run seed
# Or
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

Create `.env` and `.env.test` from `.env.example`

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/smartinbox
REDIS_URL=redis://localhost:6379
SESSION_SECRET=mysecret
```

---

## 🔄 GitHub Actions CI

✅ Auto test on every push/PR via `ci.yml`:
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

---

## ✨ Built With

- TypeScript + Node.js
- Express
- Prisma ORM + PostgreSQL
- Redis
- Zod (validation)
- Supertest + Jest (testing)
- Sentry (telemetry-ready)
- Modular folder structure (DDD/clean arch)

---

> Built for scale. Designed for clarity.