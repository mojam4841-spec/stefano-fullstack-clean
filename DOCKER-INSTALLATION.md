# Stefano Restaurant - Docker Installation Guide

## 🐳 Docker Installation by OS

### Red Hat / CentOS / RHEL
```bash
# Install Docker
sudo yum install -y docker

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Reload groups (or logout/login)
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

### Ubuntu / Debian
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Reload groups
newgrp docker

# Verify installation
docker --version
```

### Amazon Linux
```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker

# Start Docker service
sudo service docker start
sudo chkconfig docker on

# Add user to docker group
sudo usermod -aG docker $USER

# Verify installation
docker --version
```

## 🔧 Docker Compose Installation

### Ubuntu / Debian (Recommended)
```bash
# Update package index
sudo apt-get update

# Install docker-compose via package manager
sudo apt install docker-compose

# Verify installation
docker-compose --version
```

### Red Hat / CentOS / RHEL
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Create symlink
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify installation
docker-compose --version
```

### Alternative: Install via pip (fallback)
```bash
# Install pip if not available
sudo yum install -y python3-pip  # RHEL/CentOS
sudo apt-get install -y python3-pip  # Ubuntu/Debian

# Install docker-compose
pip3 install docker-compose

# Verify installation
docker-compose --version
```

## 🚀 Stefano Restaurant Deployment

### Quick Deployment
```bash
# Clone or download project
git clone <your-repo-url> stefano-restaurant
cd stefano-restaurant

# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Manual Step-by-Step
```bash
# 1. Generate SSL certificates
./scripts/ssl-setup.sh self-signed

# 2. Configure environment
cp .env.production.example .env.production
nano .env.production

# 3. Deploy with Docker
./start-production.sh
```

## 🔧 Post-Installation Setup

### Configure Docker (optional optimizations)
```bash
# Create Docker daemon configuration
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# Restart Docker
sudo systemctl restart docker
```

### Firewall Configuration
```bash
# For RHEL/CentOS with firewalld
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

# For Ubuntu with ufw
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw enable
```

## 🔍 Troubleshooting

### Docker Permission Issues
```bash
# If you get permission denied errors
sudo usermod -aG docker $USER
newgrp docker

# Or logout and login again
exit
# Then ssh back in
```

### Docker Service Issues
```bash
# Check Docker status
sudo systemctl status docker

# Start Docker if stopped
sudo systemctl start docker

# View Docker logs
sudo journalctl -u docker.service
```

### Port Conflicts
```bash
# Check if ports are in use
sudo netstat -tulpn | grep -E ':(80|443|8080|5432)'

# Kill processes using ports if needed
sudo lsof -ti:80 | xargs sudo kill -9
```

### Disk Space Issues
```bash
# Clean Docker resources
docker system prune -f
docker volume prune -f
docker image prune -a -f

# Check disk usage
df -h
docker system df
```

## 📋 Verification Commands

### Test Docker Installation
```bash
# Basic Docker test
docker run hello-world

# Test Docker Compose
docker-compose --version

# Test with our application
cd stefano-restaurant
docker-compose -f docker-compose.simple.yml config
```

### Health Check Commands
```bash
# Application health
curl http://localhost:8080/api/health

# Container status
docker ps

# View logs
docker-compose logs app
```

## 🎯 Production Checklist

Before deploying to production:

- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] User added to docker group
- [ ] Firewall configured for ports 80, 443, 8080
- [ ] SSL certificates generated or obtained
- [ ] Environment variables configured
- [ ] Disk space sufficient (>5GB recommended)
- [ ] Network connectivity verified

### Quick Deployment Test
```bash
# Test deployment on clean system
./scripts/quick-deploy.sh

# Check if everything is running
make status

# Perform health check
make health
```

---

**Supported Systems**: RHEL 7+, CentOS 7+, Ubuntu 18.04+, Amazon Linux 2  
**Docker Version**: 20.10+ recommended  
**Docker Compose Version**: 1.29+ recommended