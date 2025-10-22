#!/bin/sh

# Wait for DB to be ready (simple check)
echo "⏳ Waiting for MySQL at db:3306..."
until nc -z db 3306; do
  sleep 1
done
echo "✅ Database is ready."

# Generate Prisma client (again, to be safe at runtime)
npx prisma generate

# Apply any pending migrations
# npx prisma migrate deploy
npx prisma migrate dev --name init

# Seed the database
npm run seed

# Start the app (in dev mode)
npm run dev
