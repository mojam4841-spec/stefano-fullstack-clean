import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// High-performance connection pool for 10K+ concurrent users
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 50, // Maximum 50 concurrent connections
  min: 10, // Keep minimum 10 connections alive
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // 5s timeout for new connections
  maxUses: 7500, // Rotate connections after 7500 uses
  allowExitOnIdle: false, // Keep pool alive
});

// Configure Neon for high performance
neonConfig.fetchConnectionCache = true;
neonConfig.pipelineConnect = 'password';
neonConfig.useSecureWebSocket = true;

export const db = drizzle({ client: pool, schema });
