# STEFANO RESTAURANT - PRODUCTION ACCESS GUIDE

## 🔐 ADMIN ACCESS
- **URL**: https://twojadomena.com/admin
- **Password**: `stefano2025admin` 
- **⚠️ IMPORTANT**: Change password immediately after first login!

### Security Recommendations
1. Change default admin password in production
2. Enable 2FA if implementing user authentication
3. Use HTTPS only (HTTP automatically redirects)
4. Monitor admin access logs

## 🚦 HEALTH CHECKS

### Application Health
```bash
curl https://twojadomena.com/api/health
# Expected Response:
{
  "status": "OK",
  "timestamp": "2025-01-26T18:30:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Comprehensive Health Monitoring
```bash
# Application
curl -f https://twojadomena.com/api/health

# Database
curl -f https://twojadomena.com/api/db-status

# Admin Panel
curl -f https://twojadomena.com/admin

# API Endpoints
curl -f https://twojadomena.com/api/contacts
curl -f https://twojadomena.com/api/orders
curl -f https://twojadomena.com/api/loyalty/members
```

## 📊 MONITORING ENDPOINTS

### Application Metrics
- **Prometheus**: http://localhost:9090 (if monitoring enabled)
- **PM2 Dashboard**: `pm2 monit`
- **Container Stats**: `docker stats`

### Log Files
```bash
# Application logs
docker-compose logs -f app

# Nginx access logs
docker-compose logs -f nginx

# Database logs
docker-compose logs -f db

# PM2 logs
pm2 logs stefano-restaurant
```

## 🔧 PRODUCTION MANAGEMENT

### Start/Stop Services
```bash
# Start all services
./start-production.sh

# Check status
make status

# View logs
make logs

# Stop services
make stop
```

### Database Operations
```bash
# Create backup
make backup

# Access database shell
make db-shell

# Reset database (DESTRUCTIVE)
make db-reset
```

### SSL Certificate Management
```bash
# Generate self-signed certificate
make ssl

# Setup Let's Encrypt
make ssl-letsencrypt

# Check certificate expiry
openssl x509 -in ssl/fullchain.pem -text -noout | grep "Not After"
```

## 🚨 TROUBLESHOOTING

### Common Issues

1. **Application Won't Start**
   ```bash
   # Check container status
   docker-compose ps
   
   # View application logs
   docker-compose logs app
   
   # Check environment variables
   cat .env.production
   ```

2. **SSL Certificate Errors**
   ```bash
   # Verify certificate files
   ls -la ssl/
   
   # Test certificate
   openssl x509 -in ssl/fullchain.pem -text -noout
   
   # Regenerate if needed
   make ssl
   ```

3. **Database Connection Issues**
   ```bash
   # Check database status
   docker-compose exec db pg_isready -U stefano
   
   # View database logs
   docker-compose logs db
   
   # Test connection
   make db-shell
   ```

4. **High Memory Usage**
   ```bash
   # Check container resources
   docker stats
   
   # Restart application
   make restart-app
   
   # Clean unused resources
   make clean
   ```

### Emergency Procedures

**Complete System Restart:**
```bash
make stop
sleep 10
./start-production.sh
```

**Database Recovery:**
```bash
# Restore from latest backup
make stop
# Restore backup file manually
./start-production.sh
```

**SSL Certificate Renewal:**
```bash
# For Let's Encrypt (automated)
certbot renew

# For self-signed (manual)
make ssl
make restart
```

## 📈 PERFORMANCE MONITORING

### Key Metrics to Monitor
- Response time < 500ms
- Memory usage < 80%
- CPU usage < 70%
- Database connections < 100
- Error rate < 1%

### Performance Commands
```bash
# Real-time monitoring
pm2 monit

# Container resource usage
docker stats

# Application performance
curl -w "@curl-format.txt" -s https://twojadomena.com/

# Database performance
docker-compose exec db psql -U stefano -c "SELECT * FROM pg_stat_activity;"
```

## 🔒 SECURITY CHECKLIST

### Production Security
- [ ] Changed default admin password
- [ ] SSL certificates properly configured
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Regular backups configured
- [ ] Log monitoring enabled
- [ ] Security headers active
- [ ] Rate limiting functional

### Security Headers Verification
```bash
curl -I https://twojadomena.com | grep -E "(Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options)"
```

## 📞 SUPPORT CONTACTS

### Emergency Response
1. Check application health: `make health`
2. View recent logs: `make logs`
3. Restart if needed: `make restart`
4. Contact system administrator

### Maintenance Schedule
- **Daily**: Health checks, log review
- **Weekly**: Performance review, backup verification
- **Monthly**: Security updates, certificate renewal
- **Quarterly**: Full system audit, scaling review

---

**Last Updated**: June 26, 2025  
**Production Status**: ✅ Ready  
**Security Level**: Production Grade  
**Monitoring**: Active