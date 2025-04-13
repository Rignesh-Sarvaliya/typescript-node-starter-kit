# ✅ Smartinbox Backend Setup Guide (Step-by-Step)

---

## 1️⃣ Install Required Packages

```bash
npm init -y

# Base backend packages
npm install express dotenv cookie-parser cors helmet morgan express-session

# Prisma & PostgreSQL
npm install prisma @prisma/client
npx prisma init

# LLM/AI
npm install openai

# OAuth & Google API
npm install googleapis

# Redis + session storage
npm install redis connect-redis

# Validation & Types
npm install zod
npm install --save-dev typescript @types/node @types/express ts-node ts-node-dev

# Cron & Utility
npm install node-cron ioredis

# Testing
npm install --save-dev jest ts-jest @types/jest

# Linting (optional but recommended)
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## 2️⃣ Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "typeRoots": ["./src/types", "./node_modules/@types"]
  },
  "include": ["src"]
}
```

---

## 3️⃣ Set Up `.env`

```env
PORT=5000

DATABASE_URL=postgresql://user:password@localhost:5432/smartinbox

SESSION_SECRET=supersession
OPENAI_API_KEY=sk-...
LLM_PROVIDER=openai

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

REDIS_URL=redis://localhost:6379
```

---

## 4️⃣ Set Up Database Models

Edit `prisma/schema.prisma` and then run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 5️⃣ Create Project Folder Structure

Create these folders:

```
node-starter-kit/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│
│   ├── api/                       # Route files only
│   │   ├── auth.routes.ts
│   │   └── health.routes.ts
│
│   ├── config/
│   │   ├── redis.config.ts
│   │   ├── session.config.ts
│   │   └── cors.config.ts
│
│   ├── constants/
│   │   └── cacheKeys.ts
│
│   ├── domain/                    # Clean domain logic
│   │   ├── entities/
│   │   ├── valueObjects/
│   │   └── interfaces/
│
│   ├── repositories/              # Prisma or DB interaction
│   │   ├── user.repository.ts
│   │   └── base.repository.ts
│
│   ├── requests/                  # Zod validators
│   │   ├── auth.request.ts
│
│   ├── resources/                 # Response formatting
│   │   ├── user.resource.ts
│
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   ├── rateLimiter.ts
│   │   ├── errorHandler.ts
│   │   └── validateRequest.ts
│
│   ├── decorators/                # Optional: TS function decorators
│
│   ├── jobs/                      # Cron jobs
│
│   ├── events/                    # Event-driven emitters/listeners
│   │   ├── emitters/
│   │   └── listeners/
│
│   ├── telemetry/                 # Sentry/Prometheus
│   │   ├── sentry.ts
│   │   └── metrics.ts
│
│   ├── locales/
│   │   ├── en.json
│   │   ├── hi.json
│   │   └── index.ts
│
│   ├── types/
│   │   └── express.d.ts
│
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── cache.ts
│   │   ├── i18n.ts
│   │   └── zodSchemas.ts
│
│   ├── index.ts                  # Entry point
│   └── server.ts                 # Express bootstrap
│
├── tests/
│   ├── routes/
│   ├── utils/
│   ├── mocks/
│   └── factories/
│
├── .env
├── .env.example
├── docker-compose.yml
├── nodemon.json
├── tsconfig.json
├── package.json
├── .gitignore
├── README.md
```

---

## 6️⃣ Bootstrap the App

Create `src/index.ts` and `src/server.ts` with Express setup.

---

## 7️⃣ Add Routes & Controllers

Example: `src/api/email.routes.ts` + `src/controller/EmailController.ts`

---

## 8️⃣ Add Services & LLM Logic

Example: `src/services/emailService.ts` + `src/services/llm/index.ts`

---

## 9️⃣ Add Request Validation (Zod)

Create schemas under `src/requests/` and use middleware in routes.

---

## 🔟 Add Resources (Response Transformers)

Format DB output for frontend.

---

## 1️⃣1️⃣ Add Redis Cache & Session

Use `ioredis`, `connect-redis`, and custom `session.config.ts`.

---

## 1️⃣2️⃣ Add Cron Jobs

Use `node-cron` in `cronService.ts`, and schedule inbox sync & digests.

---

## ✅ Start the Server

```bash
npm run dev
```

---

You're ready to build Smartinbox 🚀!