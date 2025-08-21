#!/bin/bash

# Stefano Restaurant - Health Monitoring Script
# Continuous health monitoring with alerts

DOMAIN="${DOMAIN:-localhost}"
PROTOCOL="${PROTOCOL:-http}"
WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
EMAIL="${ALERT_EMAIL:-}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ERROR: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] WARNING: $1${NC}"
}

# Send alert function
send_alert() {
    local message="$1"
    local severity="$2"
    
    echo "[ALERT] $message"
    
    # Log to file
    echo "$(date): [$severity] $message" >> logs/alerts.log
    
    # Send to Slack if webhook configured
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 Stefano Restaurant Alert: $message\"}" \
            "$WEBHOOK_URL" 2>/dev/null
    fi
}

# Health check functions
check_application() {
    if curl -f -s "$PROTOCOL://$DOMAIN:8080/api/health" > /dev/null; then
        log "✅ Application health check passed"
        return 0
    else
        error "❌ Application health check failed"
        send_alert "Application is not responding on $PROTOCOL://$DOMAIN:8080/api/health" "CRITICAL"
        return 1
    fi
}

check_nginx() {
    if curl -f -s "$PROTOCOL://$DOMAIN/" > /dev/null; then
        log "✅ Nginx health check passed"
        return 0
    else
        error "❌ Nginx health check failed"
        send_alert "Nginx is not responding on $PROTOCOL://$DOMAIN/" "CRITICAL"
        return 1
    fi
}

check_database() {
    if docker-compose -f docker-compose.prod.yml exec -T db pg_isready -U stefano > /dev/null 2>&1; then
        log "✅ Database health check passed"
        return 0
    else
        error "❌ Database health check failed"
        send_alert "Database is not responding" "CRITICAL"
        return 1
    fi
}

check_ssl_expiry() {
    if [ -f "ssl/fullchain.pem" ]; then
        EXPIRY_DATE=$(openssl x509 -in ssl/fullchain.pem -noout -enddate | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
        CURRENT_EPOCH=$(date +%s)
        DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
        
        if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
            warn "⚠️ SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
            send_alert "SSL certificate expires in $DAYS_UNTIL_EXPIRY days" "WARNING"
        else
            log "✅ SSL certificate valid for $DAYS_UNTIL_EXPIRY days"
        fi
    fi
}

check_disk_space() {
    DISK_USAGE=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 90 ]; then
        error "❌ Disk usage is ${DISK_USAGE}%"
        send_alert "Disk usage is critically high: ${DISK_USAGE}%" "CRITICAL"
    elif [ "$DISK_USAGE" -gt 80 ]; then
        warn "⚠️ Disk usage is ${DISK_USAGE}%"
        send_alert "Disk usage is high: ${DISK_USAGE}%" "WARNING"
    else
        log "✅ Disk usage is ${DISK_USAGE}%"
    fi
}

check_memory_usage() {
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [ "$MEMORY_USAGE" -gt 90 ]; then
        error "❌ Memory usage is ${MEMORY_USAGE}%"
        send_alert "Memory usage is critically high: ${MEMORY_USAGE}%" "CRITICAL"
    elif [ "$MEMORY_USAGE" -gt 80 ]; then
        warn "⚠️ Memory usage is ${MEMORY_USAGE}%"
    else
        log "✅ Memory usage is ${MEMORY_USAGE}%"
    fi
}

# Main monitoring loop
monitor_continuous() {
    log "Starting continuous health monitoring..."
    
    while true; do
        log "--- Health Check Cycle ---"
        
        check_application
        check_nginx
        check_database
        check_ssl_expiry
        check_disk_space
        check_memory_usage
        
        log "Health check cycle completed. Next check in 60 seconds."
        sleep 60
    done
}

# One-time health check
monitor_once() {
    log "Running one-time health check..."
    
    check_application
    check_nginx
    check_database
    check_ssl_expiry
    check_disk_space
    check_memory_usage
    
    log "Health check completed."
}

# Main script
case "${1:-once}" in
    "continuous"|"watch"|"monitor")
        monitor_continuous
        ;;
    "once"|"check"|"")
        monitor_once
        ;;
    "ssl")
        check_ssl_expiry
        ;;
    "disk")
        check_disk_space
        ;;
    "memory")
        check_memory_usage
        ;;
    *)
        echo "Usage: $0 {once|continuous|ssl|disk|memory}"
        echo ""
        echo "Commands:"
        echo "  once        - Run single health check (default)"
        echo "  continuous  - Run continuous monitoring"
        echo "  ssl         - Check SSL certificate expiry"
        echo "  disk        - Check disk space"
        echo "  memory      - Check memory usage"
        exit 1
        ;;
esac