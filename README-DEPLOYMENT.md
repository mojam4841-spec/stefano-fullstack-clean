# Stefano Restaurant - Quick Deployment Guide

## 🚀 One-Click Deployment (Recommended)

For fresh servers, use the one-click deployment script:

```bash
# Download project and run
curl -sSL https://your-domain.com/one-click-deploy.sh | bash

# OR if you have the project locally
./one-click-deploy.sh
```

This script will:
- Detect your OS (RHEL/CentOS/Ubuntu/Debian)
- Install Docker and Docker Compose
- Configure firewall and permissions
- Deploy the application

## 🐳 Manual Docker Installation

### Red Hat / CentOS / RHEL
```bash
sudo yum install docker
sudo systemctl start docker
sudo usermod -aG docker $USER
./deploy.sh
```

### Ubuntu / Debian (Your Preferred Method)
```bash
sudo apt-get install docker.io
sudo systemctl start docker
sudo usermod -aG docker $USER
sudo apt install docker-compose
./deploy.sh
```

### Amazon Linux
```bash
sudo yum install docker
sudo service docker start
sudo usermod -aG docker $USER
./deploy.sh
```

## 📋 Alternative Deployment Methods

### Method 1: OS-Specific Scripts
```bash
./scripts/ubuntu-deploy.sh    # Ubuntu/Debian optimized
./scripts/install-docker.sh   # Universal Linux installer
```

### Method 2: Using Make Commands
```bash
make ssl        # Generate SSL certificates
make deploy     # Deploy application
make status     # Check status
```

### Method 3: Direct Scripts
```bash
./start-production.sh    # Main deployment script
./scripts/quick-deploy.sh # Enhanced deployment with checks
```

### Method 4: Docker Compose
```bash
# Simple deployment
docker-compose -f docker-compose.simple.yml up -d

# Full enterprise deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Setup
```bash
# Copy environment template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

### SSL Certificates
```bash
# Self-signed (development)
./scripts/ssl-setup.sh self-signed

# Let's Encrypt (production)
./scripts/ssl-setup.sh letsencrypt
```

## 📊 Management Commands

### Application Management
```bash
make status       # Check all services
make logs         # View application logs
make restart      # Restart application
make stop         # Stop all services
```

### PM2 Process Management
```bash
make pm2-list     # List PM2 processes
make pm2-logs     # View PM2 logs
make monitor      # PM2 monitoring dashboard
```

### Health Monitoring
```bash
make health       # Run health checks
make health-continuous  # Continuous monitoring
```

### Database Operations
```bash
make backup       # Create database backup
make db-shell     # Access database shell
```

## 🔍 Verification

### Check Application Status
```bash
# Container status
docker ps

# Application health
curl http://localhost:8080/api/health

# Web interface
curl http://localhost/
```

### Access Points
- **Website**: https://your-domain.com
- **Admin Panel**: https://your-domain.com/admin
- **Password**: `stefano2025admin` (change immediately!)

## 🛠️ Troubleshooting

### Docker Permission Issues
```bash
sudo usermod -aG docker $USER
newgrp docker
# OR logout and login again
```

### Service Not Starting
```bash
# Check logs
make logs

# Check container status
docker ps -a

# Restart services
make restart
```

### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tulpn | grep -E ':(80|443|8080)'

# Kill conflicting processes
sudo lsof -ti:80 | xargs sudo kill -9
```

## 📚 Documentation Files

- **DOCKER-INSTALLATION.md** - Detailed Docker setup guide
- **PRODUCTION-ACCESS.md** - Production access and monitoring
- **PM2-COMMANDS.md** - Complete PM2 management guide
- **DEVOPS-INFRASTRUCTURE.md** - Enterprise infrastructure docs

## 🎯 Quick Reference

### Essential Commands
```bash
# Deployment
./one-click-deploy.sh    # Full automated deployment
./start-production.sh    # Production deployment
make deploy             # Make-based deployment

# Management
make status             # Check everything
make monitor           # Live monitoring
make health            # Health checks
make logs              # View logs

# Troubleshooting
make restart           # Restart application
docker ps              # Check containers
make pm2-logs          # Check PM2 logs
```

### Default Credentials
- **Admin Password**: `stefano2025admin`
- **Database User**: `stefano`
- **Process Name**: `stefano-restaurant`

---

**Deployment Time**: ~5 minutes  
**System Requirements**: 2GB RAM, 10GB storage  
**Supported OS**: RHEL 7+, CentOS 7+, Ubuntu 18.04+, Amazon Linux 2