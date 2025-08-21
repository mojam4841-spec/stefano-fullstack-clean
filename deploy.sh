#!/bin/bash

# Stefano Restaurant Deployment Script
# Production deployment automation

set -e

echo "🚀 Starting Stefano Restaurant deployment..."

# Environment check
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to production"
    export NODE_ENV=production
fi

# Build application
echo "📦 Building application..."
npm run build

# Database migration
echo "🗄️  Pushing database schema..."
npm run db:push

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop existing application
echo "🛑 Stopping existing application..."
pm2 delete stefano-restaurant 2>/dev/null || true

# Start application with PM2
echo "🎯 Starting application..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup

# Health check
echo "🏥 Performing health check..."
sleep 5

if curl -f http://localhost:8080/api/health >/dev/null 2>&1; then
    echo "✅ Application is healthy!"
    pm2 monit
else
    echo "❌ Health check failed!"
    pm2 logs stefano-restaurant --lines 50
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs stefano-restaurant"