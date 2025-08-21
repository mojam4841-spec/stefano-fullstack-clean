#!/bin/bash

# Stefano Restaurant - One-Click Production Deployment
# Based on user's preferred workflow: install Docker + deploy

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Detect OS for package manager
detect_package_manager() {
    if command -v yum &> /dev/null; then
        PKG_MANAGER="yum"
        INSTALL_CMD="sudo yum install -y"
    elif command -v apt-get &> /dev/null; then
        PKG_MANAGER="apt"
        INSTALL_CMD="sudo apt-get install -y"
    else
        error "Unsupported package manager. Manual Docker installation required."
    fi
    
    log "Detected package manager: $PKG_MANAGER"
}

# Install Docker based on system
install_docker() {
    log "Installing Docker..."
    
    if command -v docker &> /dev/null; then
        log "Docker already installed: $(docker --version)"
        return 0
    fi
    
    case $PKG_MANAGER in
        "yum")
            # Red Hat / CentOS / Amazon Linux
            sudo yum update -y
            $INSTALL_CMD docker
            ;;
        "apt")
            # Ubuntu / Debian
            sudo apt-get update
            $INSTALL_CMD docker.io
            ;;
    esac
    
    log "Docker installation completed"
}

# Start Docker service
start_docker() {
    log "Starting Docker service..."
    
    if systemctl is-active docker &> /dev/null; then
        log "Docker service already running"
    else
        if command -v systemctl &> /dev/null; then
            sudo systemctl start docker
            sudo systemctl enable docker
        else
            # For older systems
            sudo service docker start
        fi
    fi
    
    log "Docker service started"
}

# Configure Docker permissions
configure_docker_permissions() {
    log "Configuring Docker permissions..."
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    # Try to activate group membership immediately
    if command -v newgrp &> /dev/null; then
        exec newgrp docker
    fi
    
    info "Docker permissions configured. You may need to logout/login if commands fail."
}

# Install Docker Compose
install_docker_compose() {
    log "Installing Docker Compose..."
    
    if command -v docker-compose &> /dev/null; then
        log "Docker Compose already installed: $(docker-compose --version)"
        return 0
    fi
    
    case $PKG_MANAGER in
        "apt")
            # Ubuntu/Debian - preferred method via apt
            log "Installing docker-compose via apt..."
            sudo apt-get update
            sudo apt-get install -y docker-compose
            ;;
        "yum")
            # RHEL/CentOS - download method
            log "Installing docker-compose via download..."
            if command -v curl &> /dev/null; then
                DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
                sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                sudo chmod +x /usr/local/bin/docker-compose
                
                # Create symlink for easier access
                sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
            else
                warn "curl not available, trying pip fallback..."
                $INSTALL_CMD python3-pip
                pip3 install --user docker-compose
            fi
            ;;
    esac
    
    log "Docker Compose installation completed"
}

# Verify Docker installation
verify_docker() {
    log "Verifying Docker installation..."
    
    # Check Docker
    if ! docker --version &> /dev/null; then
        error "Docker installation verification failed"
    fi
    
    # Check Docker Compose
    if ! docker-compose --version &> /dev/null; then
        error "Docker Compose installation verification failed"
    fi
    
    # Test Docker permissions (may fail initially)
    if docker ps &> /dev/null; then
        log "✅ Docker is ready"
    else
        warn "Docker permissions not yet active. Continuing with deployment..."
    fi
}

# Deploy Stefano Restaurant
deploy_application() {
    log "Deploying Stefano Restaurant..."
    
    # Check if deployment script exists
    if [ -f "./deploy.sh" ]; then
        DEPLOY_SCRIPT="./deploy.sh"
    elif [ -f "./start-production.sh" ]; then
        DEPLOY_SCRIPT="./start-production.sh"
    elif [ -f "./scripts/quick-deploy.sh" ]; then
        DEPLOY_SCRIPT="./scripts/quick-deploy.sh"
    else
        error "No deployment script found. Please ensure you're in the project directory."
    fi
    
    log "Using deployment script: $DEPLOY_SCRIPT"
    
    # Make script executable
    chmod +x "$DEPLOY_SCRIPT"
    
    # Run deployment
    log "Starting application deployment..."
    $DEPLOY_SCRIPT
}

# Main deployment function
main() {
    log "Stefano Restaurant - One-Click Deployment Starting..."
    log "=============================================="
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        error "Please run this script as a regular user (not root)"
    fi
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] && [ ! -f "docker-compose.yml" ] && [ ! -f "docker-compose.prod.yml" ]; then
        error "Please run this script from the Stefano Restaurant project directory"
    fi
    
    # Installation and deployment steps
    detect_package_manager
    install_docker
    start_docker
    configure_docker_permissions
    install_docker_compose
    verify_docker
    deploy_application
    
    log "=============================================="
    log "🎉 Deployment completed successfully!"
    log "=============================================="
    info "Application URLs:"
    info "  • Website: https://localhost"
    info "  • Admin Panel: https://localhost/admin"
    info "  • Health Check: http://localhost:8080/api/health"
    info ""
    info "Management Commands:"
    info "  • make status      # Check application status"
    info "  • make logs        # View application logs"
    info "  • make monitor     # PM2 monitoring dashboard"
    info "  • make health      # Run health checks"
    info ""
    info "If Docker commands fail, run: newgrp docker"
}

# Run main function
main "$@"