#!/bin/bash

# ============================================
# Stefano Restaurant Production Deployment
# Advanced DevOps Automation Script
# ============================================

set -e
set -o pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.simple.yml}"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
LOG_FILE="./logs/deployment.log"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Pre-deployment checks
pre_flight_checks() {
    log "🔍 Running pre-deployment checks..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker and try again."
    fi
    
    # Check if environment file exists
    if [ ! -f "$ENV_FILE" ]; then
        error "Environment file $ENV_FILE not found. Copy from .env.production.example and configure."
    fi
    
    # Check if SSL certificates exist (optional)
    if [ ! -f "./ssl/cert.pem" ] || [ ! -f "./ssl/key.pem" ]; then
        warn "SSL certificates not found. HTTPS will not work without proper certificates."
        read -p "Continue with HTTP only? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Deployment cancelled. Please provide SSL certificates."
        fi
    fi
    
    log "✅ Pre-flight checks completed"
}

# Database backup
backup_database() {
    log "💾 Creating database backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Create backup filename with timestamp
    BACKUP_FILE="$BACKUP_DIR/stefano_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Check if database container is running
    if docker-compose -f "$COMPOSE_FILE" ps db | grep -q "Up"; then
        docker-compose -f "$COMPOSE_FILE" exec -T db pg_dump -U stefano stefano > "$BACKUP_FILE"
        log "✅ Database backup created: $BACKUP_FILE"
    else
        warn "Database container not running. Skipping backup."
    fi
}

# Build and deploy
deploy() {
    log "🚀 Starting deployment process..."
    
    # Pull latest images
    log "📥 Pulling latest Docker images..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Build application
    log "🔨 Building application..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    # Stop existing containers
    log "🛑 Stopping existing containers..."
    docker-compose -f "$COMPOSE_FILE" down
    
    # Start new containers
    log "🚀 Starting new containers..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    log "✅ Containers started successfully"
}

# Health checks
health_check() {
    log "🏥 Performing health checks..."
    
    # Wait for containers to start
    sleep 30
    
    # Check application health endpoint
    for i in {1..10}; do
        if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
            log "✅ Application health check passed"
            break
        else
            warn "Health check attempt $i/10 failed, retrying in 10s..."
            sleep 10
            if [ $i -eq 10 ]; then
                error "Application health check failed after 10 attempts"
            fi
        fi
    done
}

# Main deployment function
main() {
    log "🎯 Starting Stefano Restaurant Production Deployment"
    
    case "${1:-deploy}" in
        "deploy")
            pre_flight_checks
            backup_database
            deploy
            health_check
            ;;
        "status")
            docker-compose -f "$COMPOSE_FILE" ps
            ;;
        "logs")
            docker-compose -f "$COMPOSE_FILE" logs -f
            ;;
        *)
            echo "Usage: $0 {deploy|status|logs}"
            exit 1
            ;;
    esac
    
    log "🎉 Deployment completed successfully!"
    info "Application URL: https://stefanogroup.pl"
    info "Admin Panel: https://stefanogroup.pl/admin"
}

# Run main function with all arguments
main "$@"