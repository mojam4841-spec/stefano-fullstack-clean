#!/bin/bash

# Stefano Restaurant - Quick Production Deployment
# Based on user's deployment workflow

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DEPLOY] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

log "Starting Stefano Restaurant production deployment..."

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Generate SSL certificates
log "Generating SSL certificates..."
openssl req -x509 -newkey rsa:4096 -nodes -keyout ssl/privkey.pem \
  -out ssl/fullchain.pem -days 365 -subj "/CN=stefano-restaurant.com"

# Set proper permissions
chmod 600 ssl/privkey.pem
chmod 644 ssl/fullchain.pem

log "SSL certificates generated successfully"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    warn ".env.production not found, creating from template..."
    cp .env.production.example .env.production
    info "Please edit .env.production with your configuration"
fi

# Start production stack
log "Starting production Docker stack..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for containers to be ready
log "Waiting for containers to start..."
sleep 30

# Check if containers are running
FAILED_CONTAINERS=$(docker-compose -f docker-compose.prod.yml ps -q --filter "status=exited")
if [ -n "$FAILED_CONTAINERS" ]; then
    warn "Some containers failed to start:"
    docker-compose -f docker-compose.prod.yml ps
    exit 1
fi

# Health check
log "Performing health check..."
for i in {1..10}; do
    if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        log "Application is healthy!"
        break
    else
        info "Health check attempt $i/10, waiting..."
        sleep 5
        if [ $i -eq 10 ]; then
            warn "Health check failed after 10 attempts"
            docker-compose -f docker-compose.prod.yml logs app
        fi
    fi
done

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    npm install -g pm2
fi

# Start monitoring with PM2 (alternative monitoring)
log "Setting up PM2 monitoring..."
if pm2 list | grep -q "stefano-restaurant"; then
    pm2 restart stefano-restaurant
else
    pm2 start ecosystem.config.js --env production
fi

# Display deployment summary
log "Deployment completed successfully!"
info "=================================="
info "Application URL: https://localhost"
info "Admin Panel: https://localhost/admin"
info "Health Check: http://localhost:8080/api/health"
info "=================================="
info "Container status:"
docker-compose -f docker-compose.prod.yml ps
info "=================================="
info "PM2 monitoring:"
pm2 status
info "=================================="

# Start PM2 monitoring dashboard
log "Starting PM2 monitoring dashboard..."
pm2 monit