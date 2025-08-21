# Stefano Restaurant - Production Management Makefile

.PHONY: help install dev build deploy ssl status logs stop clean backup

# Default target
help:
        @echo "Stefano Restaurant - Available Commands:"
        @echo ""
        @echo "Development:"
        @echo "  make install    - Install dependencies"
        @echo "  make dev        - Start development server"
        @echo "  make build      - Build application for production"
        @echo ""
        @echo "Production:"
        @echo "  make ssl        - Generate SSL certificates"
        @echo "  make deploy     - Deploy to production"
        @echo "  make status     - Check deployment status"
        @echo "  make logs       - View application logs"
        @echo "  make stop       - Stop production services"
        @echo ""
        @echo "PM2 Management:"
        @echo "  make pm2-list   - List PM2 processes"
        @echo "  make pm2-logs   - Show last 100 log lines"
        @echo "  make pm2-status - Show PM2 status"
        @echo "  make monitor    - Live PM2 monitoring"
        @echo ""
        @echo "Health Monitoring:"
        @echo "  make health     - Run health checks"
        @echo "  make health-continuous - Continuous monitoring"
        @echo ""
        @echo "Maintenance:"
        @echo "  make backup     - Create database backup"
        @echo "  make clean      - Clean unused Docker resources"

# Development commands
install:
        npm install

dev:
        npm run dev

build:
        npm run build

# Production deployment
ssl:
        ./scripts/ssl-setup.sh self-signed

deploy:
        ./start-production.sh

quick-deploy:
        ./scripts/quick-deploy.sh

# Monitoring and management
status:
        @echo "=== Docker Containers ==="
        docker-compose -f docker-compose.prod.yml ps
        @echo ""
        @echo "=== PM2 Status ==="
        pm2 status || echo "PM2 not running"
        @echo ""
        @echo "=== Application Health ==="
        curl -f http://localhost:8080/api/health 2>/dev/null && echo "✅ Healthy" || echo "❌ Unhealthy"

logs:
        docker-compose -f docker-compose.prod.yml logs -f

logs-app:
        docker-compose -f docker-compose.prod.yml logs -f app

logs-nginx:
        docker-compose -f docker-compose.prod.yml logs -f nginx

logs-db:
        docker-compose -f docker-compose.prod.yml logs -f db

# Stop services
stop:
        docker-compose -f docker-compose.prod.yml down
        pm2 delete stefano-restaurant || true

stop-all:
        docker-compose -f docker-compose.prod.yml down --volumes
        pm2 delete all || true

# Maintenance
backup:
        mkdir -p backups
        docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U stefano stefano > backups/stefano_backup_$(shell date +%Y%m%d_%H%M%S).sql
        @echo "Backup created in backups/ directory"

clean:
        docker system prune -f
        docker volume prune -f

# Restart services
restart:
        docker-compose -f docker-compose.prod.yml restart
        pm2 restart stefano-restaurant || true

restart-app:
        docker-compose -f docker-compose.prod.yml restart app
        pm2 restart stefano-restaurant || true

# Database operations
db-shell:
        docker-compose -f docker-compose.prod.yml exec db psql -U stefano -d stefano

db-reset:
        docker-compose -f docker-compose.prod.yml down -v
        docker-compose -f docker-compose.prod.yml up -d db
        sleep 10
        npm run db:push

# SSL certificate management
ssl-letsencrypt:
        ./scripts/ssl-setup.sh letsencrypt

ssl-import:
        ./scripts/ssl-setup.sh import

# Monitoring
monitor:
        pm2 monit

# PM2 Management
pm2-list:
        pm2 list

pm2-status:
        pm2 status

pm2-logs:
        pm2 logs stefano-restaurant --lines 100

pm2-logs-follow:
        pm2 logs stefano-restaurant --follow

pm2-logs-error:
        pm2 logs stefano-restaurant --err

pm2-restart:
        pm2 restart stefano-restaurant

pm2-reload:
        pm2 reload stefano-restaurant

pm2-stop:
        pm2 stop stefano-restaurant

pm2-show:
        pm2 show stefano-restaurant

# Health Monitoring
health:
        ./scripts/health-monitor.sh once

health-continuous:
        ./scripts/health-monitor.sh continuous

health-ssl:
        ./scripts/health-monitor.sh ssl

health-disk:
        ./scripts/health-monitor.sh disk

health-memory:
        ./scripts/health-monitor.sh memory