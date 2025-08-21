#!/bin/bash

# SSL Certificate Setup for Stefano Restaurant
# Supports both self-signed and Let's Encrypt certificates

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[SSL] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Create SSL directory
mkdir -p ssl

case "${1:-self-signed}" in
    "self-signed")
        log "Creating self-signed certificate for development..."
        
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/privkey.pem \
            -out ssl/fullchain.pem \
            -subj "/C=PL/ST=Lodz/L=Belchatow/O=Stefano Restaurant/CN=stefanogroup.pl"
        
        log "✅ Self-signed certificate created"
        warn "This certificate is for development only!"
        ;;
        
    "letsencrypt")
        log "Setting up Let's Encrypt certificate..."
        
        if ! command -v certbot &> /dev/null; then
            log "Installing certbot..."
            sudo apt-get update
            sudo apt-get install -y certbot
        fi
        
        log "Obtaining certificate for stefanogroup.pl..."
        sudo certbot certonly --standalone \
            -d stefanogroup.pl \
            -d www.stefanogroup.pl \
            --email admin@stefanogroup.pl \
            --agree-tos \
            --non-interactive
        
        # Copy certificates to ssl directory (Let's Encrypt format)
        sudo cp /etc/letsencrypt/live/stefanogroup.pl/fullchain.pem ssl/fullchain.pem
        sudo cp /etc/letsencrypt/live/stefanogroup.pl/privkey.pem ssl/privkey.pem
        sudo chown $USER:$USER ssl/*.pem
        
        log "✅ Let's Encrypt certificate installed"
        ;;
        
    "import")
        log "Import your own certificate files..."
        echo "Place your certificate files as:"
        echo "  ssl/cert.pem - Your certificate"
        echo "  ssl/key.pem  - Your private key"
        ;;
        
    *)
        echo "Usage: $0 {self-signed|letsencrypt|import}"
        echo ""
        echo "Options:"
        echo "  self-signed  - Create self-signed certificate (development)"
        echo "  letsencrypt  - Get Let's Encrypt certificate (production)"
        echo "  import       - Instructions for importing your own certificate"
        exit 1
        ;;
esac

# Set proper permissions
chmod 600 ssl/key.pem 2>/dev/null || true
chmod 644 ssl/cert.pem 2>/dev/null || true

log "SSL setup completed!"
log "Certificate location: ./ssl/"