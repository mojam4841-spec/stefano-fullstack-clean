#!/bin/bash

# Blue-Green Deployment Script for Stefano Enterprise
# Usage: ./blue-green-deploy.sh <image-tag>

set -euo pipefail

# Configuration
IMAGE_TAG=${1:-latest}
HEALTH_CHECK_URL="http://localhost:8080/health"
HEALTH_CHECK_TIMEOUT=300 # 5 minutes
ROLLBACK_ON_FAILURE=true

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running"
        exit 1
    fi
    
    # Check if image exists
    if ! docker image inspect stefano-app:${IMAGE_TAG} > /dev/null 2>&1; then
        error "Docker image stefano-app:${IMAGE_TAG} not found"
        exit 1
    fi
    
    # Check database connectivity
    if ! docker exec stefano-db pg_isready > /dev/null 2>&1; then
        warning "Database might not be ready"
    fi
    
    success "Pre-deployment checks passed"
}

# Determine current environment (blue or green)
get_current_env() {
    if docker ps --format "table {{.Names}}" | grep -q "stefano-blue"; then
        echo "blue"
    else
        echo "green"
    fi
}

# Get target environment
get_target_env() {
    if [ "$1" == "blue" ]; then
        echo "green"
    else
        echo "blue"
    fi
}

# Deploy to target environment
deploy_to_env() {
    local target_env=$1
    local container_name="stefano-${target_env}"
    local port
    
    if [ "$target_env" == "blue" ]; then
        port=8081
    else
        port=8082
    fi
    
    log "Deploying to ${target_env} environment on port ${port}..."
    
    # Stop existing container if running
    if docker ps -a --format "table {{.Names}}" | grep -q "$container_name"; then
        log "Stopping existing ${container_name} container..."
        docker stop $container_name > /dev/null 2>&1 || true
        docker rm $container_name > /dev/null 2>&1 || true
    fi
    
    # Start new container
    docker run -d \
        --name $container_name \
        --network stefano-network \
        -p ${port}:5000 \
        -e NODE_ENV=production \
        -e DATABASE_URL="${DATABASE_URL}" \
        -e REDIS_URL="redis://stefano-redis:6379" \
        -e PORT=5000 \
        --restart unless-stopped \
        stefano-app:${IMAGE_TAG}
    
    success "Container ${container_name} started"
}

# Health check for deployed container
health_check() {
    local container_name=$1
    local port=$2
    local start_time=$(date +%s)
    local health_url="http://localhost:${port}/health"
    
    log "Running health checks on ${container_name}..."
    
    while true; do
        if curl -f -s $health_url > /dev/null 2>&1; then
            success "Health check passed for ${container_name}"
            return 0
        fi
        
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        if [ $elapsed -gt $HEALTH_CHECK_TIMEOUT ]; then
            error "Health check timeout for ${container_name}"
            return 1
        fi
        
        log "Waiting for ${container_name} to be healthy... (${elapsed}s elapsed)"
        sleep 5
    done
}

# Run smoke tests
run_smoke_tests() {
    local port=$1
    log "Running smoke tests on port ${port}..."
    
    # Test homepage
    if ! curl -f -s "http://localhost:${port}/" > /dev/null; then
        error "Homepage test failed"
        return 1
    fi
    
    # Test API endpoints
    if ! curl -f -s "http://localhost:${port}/api/v1/menu" > /dev/null; then
        error "Menu API test failed"
        return 1
    fi
    
    # Test database connectivity
    if ! curl -f -s "http://localhost:${port}/api/v1/health/db" > /dev/null; then
        error "Database connectivity test failed"
        return 1
    fi
    
    success "All smoke tests passed"
}

# Switch traffic to new environment
switch_traffic() {
    local target_env=$1
    local target_port
    
    if [ "$target_env" == "blue" ]; then
        target_port=8081
    else
        target_port=8082
    fi
    
    log "Switching traffic to ${target_env} environment..."
    
    # Update nginx configuration
    cat > /etc/nginx/sites-available/stefano-upstream.conf <<EOF
upstream stefano_backend {
    server localhost:${target_port} max_fails=3 fail_timeout=30s;
}
EOF
    
    # Reload nginx
    nginx -t && nginx -s reload
    
    success "Traffic switched to ${target_env} environment"
}

# Rollback deployment
rollback() {
    local current_env=$1
    error "Deployment failed, rolling back to ${current_env} environment..."
    
    switch_traffic $current_env
    
    # Stop failed deployment
    local target_env=$(get_target_env $current_env)
    docker stop stefano-${target_env} > /dev/null 2>&1 || true
    
    success "Rollback completed"
}

# Cleanup old environment
cleanup_old_env() {
    local old_env=$1
    local grace_period=60
    
    log "Waiting ${grace_period}s before cleaning up ${old_env} environment..."
    sleep $grace_period
    
    log "Stopping ${old_env} environment..."
    docker stop stefano-${old_env} > /dev/null 2>&1 || true
    docker rm stefano-${old_env} > /dev/null 2>&1 || true
    
    success "Cleanup completed"
}

# Main deployment flow
main() {
    log "Starting Blue-Green deployment with image tag: ${IMAGE_TAG}"
    
    # Run pre-deployment checks
    pre_deployment_checks
    
    # Determine environments
    local current_env=$(get_current_env)
    local target_env=$(get_target_env $current_env)
    local target_port
    
    if [ "$target_env" == "blue" ]; then
        target_port=8081
    else
        target_port=8082
    fi
    
    log "Current environment: ${current_env}"
    log "Target environment: ${target_env}"
    
    # Deploy to target environment
    deploy_to_env $target_env
    
    # Health check
    if ! health_check "stefano-${target_env}" $target_port; then
        if [ "$ROLLBACK_ON_FAILURE" == "true" ]; then
            rollback $current_env
            exit 1
        fi
    fi
    
    # Run smoke tests
    if ! run_smoke_tests $target_port; then
        if [ "$ROLLBACK_ON_FAILURE" == "true" ]; then
            rollback $current_env
            exit 1
        fi
    fi
    
    # Switch traffic
    switch_traffic $target_env
    
    # Final verification
    sleep 5
    if ! curl -f -s $HEALTH_CHECK_URL > /dev/null 2>&1; then
        error "Final health check failed after traffic switch"
        rollback $current_env
        exit 1
    fi
    
    success "Deployment completed successfully!"
    
    # Cleanup old environment
    cleanup_old_env $current_env &
    
    # Log deployment metrics
    log "Deployment summary:"
    log "- Image: stefano-app:${IMAGE_TAG}"
    log "- Previous environment: ${current_env}"
    log "- New environment: ${target_env}"
    log "- Total deployment time: $(($(date +%s) - start_time))s"
}

# Record start time
start_time=$(date +%s)

# Run main deployment
main "$@"