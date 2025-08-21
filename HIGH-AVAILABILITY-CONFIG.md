# Stefano Enterprise - High Availability Configuration

## Architecture Overview

```
                     ┌─────────────────┐
                     │  Load Balancer  │
                     │   (HAProxy)     │
                     └────────┬────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────┴──────┐            ┌──────┴──────┐
         │   Nginx 1   │            │   Nginx 2   │
         │  (Primary)  │            │ (Secondary) │
         └──────┬──────┘            └──────┬──────┘
                │                           │
    ┌───────────┼───────────────────────────┼───────────┐
    │           │                           │           │
┌───┴───┐   ┌───┴───┐   ┌───────┐   ┌───┴───┐   ┌───┴───┐
│ App 1 │   │ App 2 │   │ App 3 │   │ App 4 │   │ App 5 │
│ Blue  │   │ Green │   │ Blue  │   │ Green │   │ Blue  │
└───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘   └───┬───┘
    │           │           │           │           │
    └───────────┴───────────┼───────────┴───────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
         ┌──────┴──────┐         ┌──────┴──────┐
         │ PostgreSQL  │         │ PostgreSQL  │
         │  Primary    │────────►│  Replica    │
         └─────────────┘         └─────────────┘
                │
         ┌──────┴──────┐
         │   Redis     │
         │  Cluster    │
         └─────────────┘
```

## Component Configuration

### 1. Load Balancer (HAProxy)

```haproxy
# /etc/haproxy/haproxy.cfg
global
    maxconn 50000
    log /dev/log local0
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    mode http
    log global
    option httplog
    option dontlognull
    timeout connect 5000
    timeout client 50000
    timeout server 50000
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 503 /etc/haproxy/errors/503.http

frontend stefano_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/stefano.pem
    redirect scheme https if !{ ssl_fc }
    
    # Rate limiting
    stick-table type ip size 100k expire 30s store http_req_rate(10s)
    http-request track-sc0 src
    http-request deny if { sc_http_req_rate(0) gt 100 }
    
    default_backend stefano_backend

backend stefano_backend
    balance roundrobin
    option httpchk GET /health
    
    server nginx1 10.0.1.10:80 check inter 2000 rise 2 fall 3
    server nginx2 10.0.1.11:80 check inter 2000 rise 2 fall 3 backup
```

### 2. Nginx Configuration

```nginx
# /etc/nginx/nginx.conf
upstream app_servers {
    least_conn;
    
    server 127.0.0.1:5001 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:5002 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:5003 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:5004 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:5005 max_fails=3 fail_timeout=30s;
    
    keepalive 32;
}

server {
    listen 80;
    server_name stefanogroup.pl;
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    location / {
        proxy_pass http://app_servers;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Connection pooling
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
}
```

### 3. PostgreSQL High Availability

```yaml
# docker-compose.ha.yml
services:
  postgres-master:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: stefano
      POSTGRES_USER: stefano
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_REPLICATION_MODE: master
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: ${REPL_PASSWORD}
    volumes:
      - postgres-master-data:/var/lib/postgresql/data
      - ./postgres-master.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
    
  postgres-replica:
    image: postgres:15-alpine
    environment:
      POSTGRES_MASTER_SERVICE: postgres-master
      POSTGRES_REPLICATION_MODE: slave
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: ${REPL_PASSWORD}
    volumes:
      - postgres-replica-data:/var/lib/postgresql/data
    depends_on:
      - postgres-master
```

```conf
# postgres-master.conf
wal_level = replica
max_wal_senders = 3
max_replication_slots = 3
synchronous_commit = on
synchronous_standby_names = 'replica1'
```

### 4. Redis Cluster Configuration

```yaml
# redis-cluster.yml
services:
  redis-master:
    image: redis:7-alpine
    command: redis-server --appendonly yes --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000
    volumes:
      - redis-master-data:/data
      
  redis-replica1:
    image: redis:7-alpine
    command: redis-server --appendonly yes --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000
    volumes:
      - redis-replica1-data:/data
      
  redis-replica2:
    image: redis:7-alpine
    command: redis-server --appendonly yes --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000
    volumes:
      - redis-replica2-data:/data
```

### 5. Application Configuration

```typescript
// server/ha-config.ts
export const haConfig = {
  database: {
    master: {
      host: process.env.DB_MASTER_HOST || 'postgres-master',
      port: 5432,
      database: 'stefano',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
    replicas: [
      {
        host: process.env.DB_REPLICA1_HOST || 'postgres-replica',
        port: 5432,
        database: 'stefano',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 20,
      }
    ],
    // Read/write splitting
    readPreference: 'replica', // 'master' | 'replica' | 'nearest'
  },
  
  redis: {
    cluster: [
      { host: 'redis-master', port: 6379 },
      { host: 'redis-replica1', port: 6379 },
      { host: 'redis-replica2', port: 6379 }
    ],
    options: {
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => Math.min(times * 50, 2000)
    }
  },
  
  healthCheck: {
    interval: 10000, // 10 seconds
    timeout: 5000,   // 5 seconds
    retries: 3
  }
};
```

## Monitoring & Alerting

### Health Check Endpoints

```typescript
// /health - Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// /health/detailed - Comprehensive health check
app.get('/health/detailed', async (req, res) => {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkDiskSpace(),
    checkMemory()
  ]);
  
  const allHealthy = checks.every(check => check.healthy);
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    checks
  });
});
```

### Prometheus Metrics

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'stefano-apps'
    static_configs:
      - targets: ['app1:9090', 'app2:9090', 'app3:9090', 'app4:9090', 'app5:9090']
      
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-master:9187', 'postgres-replica:9187']
      
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-master:9121', 'redis-replica1:9121', 'redis-replica2:9121']
```

## Failover Procedures

### 1. Application Failover
- Automatic via health checks in load balancer
- Unhealthy instances removed from pool within 6 seconds
- Blue-green deployment ensures zero downtime

### 2. Database Failover
- Automatic promotion of replica to master
- Connection string updated via service discovery
- Maximum 30 seconds of read-only mode during failover

### 3. Redis Failover
- Redis Sentinel monitors cluster health
- Automatic master election on failure
- Client connections redirected automatically

## Disaster Recovery

### Backup Strategy
- Database: Continuous WAL archiving + daily full backups
- Redis: AOF persistence + hourly snapshots
- Application data: Replicated to S3 every 6 hours

### Recovery Time Objectives
- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 15 minutes

### Runbooks
1. **Complete Data Center Failure**: Switch to DR site using DNS failover
2. **Database Corruption**: Restore from latest backup + WAL replay
3. **DDoS Attack**: Enable Cloudflare protection + rate limiting

## Scaling Strategy

### Horizontal Scaling
- Application: Auto-scaling based on CPU/memory (min: 3, max: 20 instances)
- Database: Read replicas added based on query load
- Redis: Cluster expansion based on memory usage

### Vertical Scaling
- Monitored metrics trigger alert at 80% resource usage
- Scheduled maintenance windows for instance upgrades
- Zero-downtime upgrades using rolling deployment

## Testing

### Chaos Engineering
```bash
# Monthly chaos tests
./scripts/chaos-test.sh --scenario random-pod-failure
./scripts/chaos-test.sh --scenario network-partition
./scripts/chaos-test.sh --scenario database-failover
```

### Load Testing
```bash
# Weekly load tests
k6 run tests/performance/stress-test.js --vus 2000 --duration 30m
```

## Maintenance Windows
- Planned: Tuesday 2-4 AM CET (low traffic period)
- Emergency: Requires incident commander approval
- Communication: 72h advance notice via status page