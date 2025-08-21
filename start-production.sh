#!/bin/bash

# Stefano Restaurant Production Startup Script
# Simplified version based on user's workflow

set -e

GREEN='\033[0;32m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[STEFANO] $1${NC}"
}

log "Stefano Restaurant - Production Startup"

# Ensure directories exist
mkdir -p ssl logs

# Generate SSL certificates (self-signed for quick setup)
if [ ! -f "ssl/fullchain.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
    log "Generating SSL certificates..."
    openssl req -x509 -newkey rsa:4096 -nodes -keyout ssl/privkey.pem \
      -out ssl/fullchain.pem -days 365 -subj "/CN=stefano-restaurant.com"
    chmod 600 ssl/privkey.pem
    chmod 644 ssl/fullchain.pem
fi

# Check environment file
if [ ! -f ".env.production" ]; then
    log "Creating .env.production from template..."
    cp .env.production.example .env.production
fi

# Start production stack with Docker
log "Starting production Docker stack..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for application to be ready
log "Waiting for application to start..."
sleep 20

# Health check
for i in {1..5}; do
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        log "Application is healthy!"
        break
    else
        sleep 10
    fi
done

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    npm install -g pm2
fi

# Start application monitoring with PM2
log "Starting PM2 monitoring..."
pm2 start ecosystem.config.js --env production

log "Production deployment completed!"
log "Access your application at: https://localhost"
log "Admin panel: https://localhost/admin"

# Start monitoring dashboard
pm2 monit