# Stage 1 — Build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
RUN npm install -g prisma
RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2 — Run
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
# Copy the startup script
COPY start.sh .

ENV NODE_ENV=production

CMD ["node", "dist/index.js", "./start.sh"]
