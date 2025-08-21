#!/bin/bash

# Stefano Restaurant - Ubuntu/Debian Quick Deployment
# Based on: sudo apt install docker-compose && ./deploy.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[UBUNTU-DEPLOY] $1${NC}"
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

# Check if running on Ubuntu/Debian
check_os() {
    if [ ! -f /etc/debian_version ]; then
        error "This script is designed for Ubuntu/Debian systems only"
    fi
    
    if grep -q "Ubuntu" /etc/os-release; then
        OS_NAME="Ubuntu"
    else
        OS_NAME="Debian"
    fi
    
    log "Detected OS: $OS_NAME"
}

# Install Docker
install_docker() {
    log "Installing Docker..."
    
    if command -v docker &> /dev/null; then
        log "Docker already installed: $(docker --version)"
    else
        # Update package index
        sudo apt-get update
        
        # Install Docker
        sudo apt-get install -y docker.io
        
        # Start and enable Docker service
        sudo systemctl start docker
        sudo systemctl enable docker
        
        log "Docker installation completed"
    fi
}

# Install Docker Compose (your preferred method)
install_docker_compose() {
    log "Installing Docker Compose via apt..."
    
    if command -v docker-compose &> /dev/null; then
        log "Docker Compose already installed: $(docker-compose --version)"
    else
        # Update package index
        sudo apt-get update
        
        # Install docker-compose via apt (your preferred method)
        sudo apt install -y docker-compose
        
        log "Docker Compose installation completed: $(docker-compose --version)"
    fi
}

# Configure Docker permissions
configure_docker_permissions() {
    log "Configuring Docker permissions..."
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    info "Docker permissions configured. You may need to run: newgrp docker"
}

# Configure firewall (UFW on Ubuntu)
configure_firewall() {
    log "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        # Enable UFW if not already enabled
        sudo ufw --force enable
        
        # Allow required ports
        sudo ufw allow 80/tcp comment "HTTP"
        sudo ufw allow 443/tcp comment "HTTPS"
        sudo ufw allow 8080/tcp comment "Stefano App"
        
        # Show status
        sudo ufw status
        
        log "Firewall configured successfully"
    else
        warn "UFW not found. Please configure firewall manually for ports: 80, 443, 8080"
    fi
}

# Run deployment script
run_deployment() {
    log "Running deployment script..."
    
    # Check for deployment scripts
    if [ -f "./deploy.sh" ]; then
        DEPLOY_SCRIPT="./deploy.sh"
    elif [ -f "./start-production.sh" ]; then
        DEPLOY_SCRIPT="./start-production.sh"
    else
        error "No deployment script found (deploy.sh or start-production.sh)"
    fi
    
    # Make script executable
    chmod +x "$DEPLOY_SCRIPT"
    
    log "Executing: $DEPLOY_SCRIPT"
    
    # Run deployment
    $DEPLOY_SCRIPT
}

# Verify installation
verify_installation() {
    log "Verifying installation..."
    
    # Check Docker
    if ! docker --version &> /dev/null; then
        error "Docker verification failed"
    fi
    
    # Check Docker Compose
    if ! docker-compose --version &> /dev/null; then
        error "Docker Compose verification failed"
    fi
    
    # Test Docker permissions (may require newgrp)
    if docker ps &> /dev/null; then
        log "✅ Docker permissions working"
    else
        warn "Docker permissions not yet active. Run: newgrp docker"
    fi
    
    log "✅ Installation verification completed"
}

# Main function
main() {
    log "Stefano Restaurant - Ubuntu/Debian Deployment"
    log "============================================="
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        error "Please run this script as a regular user (not root)"
    fi
    
    # Check if we're in the project directory
    if [ ! -f "package.json" ] && [ ! -f "docker-compose.yml" ]; then
        error "Please run this script from the Stefano Restaurant project directory"
    fi
    
    # Installation steps
    check_os
    install_docker
    install_docker_compose
    configure_docker_permissions
    configure_firewall
    verify_installation
    run_deployment
    
    log "============================================="
    log "🎉 Ubuntu/Debian deployment completed!"
    log "============================================="
    info "Application URLs:"
    info "  • Website: https://localhost"
    info "  • Admin Panel: https://localhost/admin"
    info "  • Health Check: http://localhost:8080/api/health"
    info ""
    info "If Docker commands fail, run: newgrp docker"
    info "Then check status with: docker ps"
}

# Execute main function
main "$@"