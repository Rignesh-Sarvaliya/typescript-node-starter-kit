#!/bin/sh

echo "📦 Running DB migrations..."
npx prisma migrate deploy

echo "🚀 Starting app..."
node dist/index.js
