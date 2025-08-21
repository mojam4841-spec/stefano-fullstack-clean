# Stefano Restaurant - PM2 Management Commands

## 📊 Basic PM2 Commands

### Process Management
```bash
# List all processes
pm2 list

# Start application
pm2 start ecosystem.config.js --env production

# Stop application
pm2 stop stefano-restaurant

# Restart application
pm2 restart stefano-restaurant

# Delete process
pm2 delete stefano-restaurant

# Reload application (zero-downtime)
pm2 reload stefano-restaurant
```

### Monitoring & Logs
```bash
# Live monitoring dashboard
pm2 monit

# Show recent logs (last 100 lines)
pm2 logs stefano-restaurant --lines 100

# Follow logs in real-time
pm2 logs stefano-restaurant --follow

# Show only error logs
pm2 logs stefano-restaurant --err

# Clear logs
pm2 flush stefano-restaurant
```

### Status & Information
```bash
# Show detailed process info
pm2 show stefano-restaurant

# Show process status
pm2 status

# Show memory usage
pm2 jlist

# Show process metrics
pm2 describe stefano-restaurant
```

## 🔧 Advanced PM2 Operations

### Cluster Management
```bash
# Scale to 4 instances
pm2 scale stefano-restaurant 4

# Scale to max CPU cores
pm2 scale stefano-restaurant max

# Scale down to 2 instances
pm2 scale stefano-restaurant 2
```

### Configuration Management
```bash
# Save current PM2 configuration
pm2 save

# Resurrect saved processes (after reboot)
pm2 resurrect

# Generate startup script
pm2 startup

# Disable startup script
pm2 unstartup
```

### Log Management
```bash
# Install log rotation
pm2 install pm2-logrotate

# Configure log rotation (daily, keep 7 days)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

## 📈 Performance Monitoring

### Real-time Metrics
```bash
# CPU and memory usage
pm2 monit

# Web-based monitoring (if keymetrics installed)
pm2 web

# Process performance
pm2 show stefano-restaurant
```

### Custom Monitoring
```bash
# Set memory limit (restart if exceeded)
pm2 start ecosystem.config.js --max-memory-restart 1G

# Set restart limit
pm2 start ecosystem.config.js --max-restarts 10

# Monitor file changes (development)
pm2 start ecosystem.config.js --watch
```

## 🚨 Troubleshooting

### Common Issues
```bash
# Application won't start
pm2 logs stefano-restaurant --lines 50
pm2 describe stefano-restaurant

# High memory usage
pm2 monit
pm2 restart stefano-restaurant

# Process keeps crashing
pm2 logs stefano-restaurant --err
pm2 show stefano-restaurant

# PM2 daemon issues
pm2 kill
pm2 resurrect
```

### Emergency Commands
```bash
# Force restart all processes
pm2 restart all

# Kill PM2 daemon (will restart automatically)
pm2 kill

# Reset all processes
pm2 delete all
pm2 resurrect
```

## 🔄 Production Workflows

### Deployment Update
```bash
# Zero-downtime deployment
pm2 reload stefano-restaurant

# Or restart with brief downtime
pm2 restart stefano-restaurant

# Verify deployment
pm2 status
pm2 logs stefano-restaurant --lines 20
```

### Health Checks
```bash
# Quick status check
pm2 list | grep stefano-restaurant

# Detailed health check
pm2 show stefano-restaurant | grep -E "(status|memory|cpu)"

# Log analysis
pm2 logs stefano-restaurant --lines 100 | grep -i error
```

### Backup Operations
```bash
# Save current configuration
pm2 save

# Export process list
pm2 jlist > pm2-processes-backup.json

# Dump logs before rotation
pm2 logs stefano-restaurant --lines 1000 > app-logs-$(date +%Y%m%d).log
```

## 📋 Makefile Integration

Add these to your daily workflow:

```bash
# Quick status check
make pm2-status

# View logs
make pm2-logs

# Restart application
make pm2-restart

# Monitor performance
make monitor
```

## 🎯 Production Best Practices

### 1. Regular Monitoring
```bash
# Check every hour
pm2 status && pm2 logs stefano-restaurant --lines 10

# Daily health check
pm2 show stefano-restaurant
```

### 2. Log Management
```bash
# Weekly log review
pm2 logs stefano-restaurant --lines 1000 | grep -i error

# Monthly log cleanup
pm2 flush stefano-restaurant
```

### 3. Performance Optimization
```bash
# Monitor memory usage
pm2 monit

# Adjust instances based on load
pm2 scale stefano-restaurant 4  # Scale up during high traffic
pm2 scale stefano-restaurant 2  # Scale down during low traffic
```

### 4. Automated Monitoring
```cron
# Add to crontab for automated monitoring
*/15 * * * * pm2 jlist | jq '.[] | select(.name=="stefano-restaurant") | .pm2_env.status' | grep -q "online" || /path/to/alert-script.sh
```

---

**PM2 Version**: Latest  
**Configuration**: ecosystem.config.js  
**Log Location**: ~/.pm2/logs/  
**Process Name**: stefano-restaurant