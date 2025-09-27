#!/bin/bash

echo "🚀 Starting Vercel build process..."

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️  Running database migrations..."
npx prisma migrate deploy

echo "🏗️  Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
