#!/bin/bash

# Stefano Restaurant - Docker Installation Script
# Universal installer for different Linux distributions

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DOCKER] $1${NC}"
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

# Detect OS
detect_os() {
    if [ -f /etc/redhat-release ]; then
        OS="rhel"
        if grep -q "CentOS" /etc/redhat-release; then
            OS="centos"
        elif grep -q "Amazon Linux" /etc/redhat-release; then
            OS="amazon"
        fi
    elif [ -f /etc/debian_version ]; then
        OS="debian"
        if grep -q "Ubuntu" /etc/os-release; then
            OS="ubuntu"
        fi
    else
        error "Unsupported operating system"
    fi
    
    log "Detected OS: $OS"
}

# Install Docker based on OS
install_docker() {
    case $OS in
        "rhel"|"centos")
            log "Installing Docker on RHEL/CentOS..."
            sudo yum update -y
            sudo yum install -y docker
            ;;
        "amazon")
            log "Installing Docker on Amazon Linux..."
            sudo yum update -y
            sudo yum install -y docker
            ;;
        "ubuntu"|"debian")
            log "Installing Docker on Ubuntu/Debian..."
            sudo apt-get update
            sudo apt-get install -y docker.io
            ;;
        *)
            error "Unsupported OS for automatic Docker installation"
            ;;
    esac
}

# Start and enable Docker service
configure_docker_service() {
    log "Configuring Docker service..."
    
    case $OS in
        "rhel"|"centos"|"ubuntu"|"debian")
            sudo systemctl start docker
            sudo systemctl enable docker
            ;;
        "amazon")
            sudo service docker start
            sudo chkconfig docker on
            ;;
    esac
}

# Add user to docker group
configure_docker_permissions() {
    log "Adding user to docker group..."
    sudo usermod -aG docker $USER
    
    info "You may need to logout and login again, or run: newgrp docker"
}

# Install Docker Compose
install_docker_compose() {
    log "Installing Docker Compose..."
    
    if command -v docker-compose &> /dev/null; then
        log "Docker Compose already installed: $(docker-compose --version)"
        return 0
    fi
    
    case $OS in
        "ubuntu"|"debian")
            # Preferred method for Ubuntu/Debian
            log "Installing docker-compose via apt..."
            sudo apt-get update
            sudo apt-get install -y docker-compose
            ;;
        "rhel"|"centos"|"amazon")
            # Download method for RHEL/CentOS
            log "Installing docker-compose via download..."
            sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            
            # Create symlink if needed
            if [ ! -f /usr/bin/docker-compose ]; then
                sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
            fi
            ;;
        *)
            # Fallback to pip installation
            warn "Trying pip installation as fallback..."
            
            # Install pip if not available
            case $OS in
                "rhel"|"centos"|"amazon")
                    sudo yum install -y python3-pip
                    ;;
                "ubuntu"|"debian")
                    sudo apt-get install -y python3-pip
                    ;;
            esac
            
            # Install docker-compose via pip
            pip3 install --user docker-compose
            
            # Add to PATH if needed
            export PATH="$HOME/.local/bin:$PATH"
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
            ;;
    esac
}

# Configure firewall
configure_firewall() {
    log "Configuring firewall..."
    
    if command -v firewall-cmd &> /dev/null; then
        # RHEL/CentOS with firewalld
        sudo firewall-cmd --permanent --add-port=80/tcp
        sudo firewall-cmd --permanent --add-port=443/tcp
        sudo firewall-cmd --permanent --add-port=8080/tcp
        sudo firewall-cmd --reload
        info "Firewall configured with firewalld"
    elif command -v ufw &> /dev/null; then
        # Ubuntu with ufw
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw allow 8080/tcp
        sudo ufw --force enable
        info "Firewall configured with ufw"
    else
        warn "No supported firewall found. Please configure manually:"
        warn "  Ports to open: 80, 443, 8080"
    fi
}

# Verify installation
verify_installation() {
    log "Verifying Docker installation..."
    
    # Check Docker version
    if docker --version &> /dev/null; then
        log "✅ Docker installed successfully: $(docker --version)"
    else
        error "Docker installation failed"
    fi
    
    # Check Docker Compose version
    if docker-compose --version &> /dev/null; then
        log "✅ Docker Compose installed successfully: $(docker-compose --version)"
    else
        warn "Docker Compose installation may have failed"
    fi
    
    # Test Docker (without sudo)
    if docker ps &> /dev/null; then
        log "✅ Docker permissions configured correctly"
    else
        warn "Docker permissions not yet active. Run: newgrp docker"
    fi
}

# Main installation function
main() {
    log "Starting Docker installation for Stefano Restaurant..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        error "Please run this script as a regular user (not root)"
    fi
    
    detect_os
    install_docker
    configure_docker_service
    configure_docker_permissions
    install_docker_compose
    configure_firewall
    verify_installation
    
    log "Docker installation completed!"
    info "Next steps:"
    info "1. Run: newgrp docker (or logout/login)"
    info "2. Test: docker run hello-world"
    info "3. Deploy: ./start-production.sh"
}

# Run main function
main "$@"