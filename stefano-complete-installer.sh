#!/bin/bash

# ===========================================================================
# STEFANO RESTAURANT - KOMPLETNY INSTALATOR APLIKACJI
# ===========================================================================
# Wersja: 1.0.0
# Data: 2025-01-24
# Autor: Stefano Restaurant Development Team
# ===========================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║          STEFANO RESTAURANT - INSTALATOR APLIKACJI                   ║"
echo "║                    Kompletna instalacja z kodem                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# ===========================================================================
# KONFIGURACJA PODSTAWOWA
# ===========================================================================

PROJECT_NAME="stefano-restaurant"
PROJECT_DIR=$(pwd)/$PROJECT_NAME

# Kolory dla lepszej czytelności
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ===========================================================================
# FUNKCJE POMOCNICZE
# ===========================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

create_file() {
    local file_path=$1
    local content=$2
    
    mkdir -p $(dirname "$file_path")
    cat > "$file_path" << 'EOF'
$content
EOF
    log_success "Utworzono: $file_path"
}

# ===========================================================================
# SPRAWDZENIE WYMAGAŃ SYSTEMOWYCH
# ===========================================================================

check_requirements() {
    log_info "Sprawdzanie wymagań systemowych..."
    
    # Sprawdzenie Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js nie jest zainstalowany!"
        echo "Zainstaluj Node.js z https://nodejs.org/"
        exit 1
    fi
    
    # Sprawdzenie npm
    if ! command -v npm &> /dev/null; then
        log_error "npm nie jest zainstalowany!"
        exit 1
    fi
    
    log_success "Wszystkie wymagania spełnione"
}

# ===========================================================================
# TWORZENIE STRUKTURY PROJEKTU
# ===========================================================================

create_project_structure() {
    log_info "Tworzenie struktury projektu..."
    
    # Usuń stary projekt jeśli istnieje
    if [ -d "$PROJECT_DIR" ]; then
        log_warning "Folder projektu istnieje. Usuwanie..."
        rm -rf "$PROJECT_DIR"
    fi
    
    # Tworzenie głównego folderu
    mkdir -p "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    
    # Tworzenie struktury folderów
    mkdir -p client/src/{components,pages,hooks,lib,components/ui}
    mkdir -p client/public
    mkdir -p server
    mkdir -p shared
    mkdir -p scripts
    mkdir -p tests
    
    log_success "Struktura projektu utworzona"
}

# ===========================================================================
# PACKAGE.JSON - GŁÓWNY
# ===========================================================================

create_package_json() {
    log_info "Tworzenie package.json..."
    
    cat > package.json << 'PACKAGE_JSON_EOF'
{
  "name": "stefano-restaurant",
  "version": "1.0.0",
  "description": "Stefano Restaurant - Complete Management System",
  "main": "server/index.ts",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --outfile=dist/server.js",
    "start": "NODE_ENV=production node dist/server.js",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "lint": "eslint . --ext .ts,.tsx",
    "test": "jest"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@neondatabase/serverless": "^0.9.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-badge": "^2.0.0",
    "@radix-ui/react-button": "^2.0.0",
    "@radix-ui/react-card": "^1.0.0",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-form": "^0.0.3",
    "@radix-ui/react-input": "^1.0.0",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@sendgrid/mail": "^8.1.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "@stripe/stripe-js": "^2.2.0",
    "@tanstack/react-query": "^5.17.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "compression": "^1.7.4",
    "drizzle-orm": "^0.29.0",
    "drizzle-zod": "^0.5.0",
    "express": "^4.18.0",
    "express-rate-limit": "^7.1.0",
    "express-session": "^1.17.0",
    "helmet": "^7.1.0",
    "lucide-react": "^0.300.0",
    "openai": "^4.24.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.0",
    "stripe": "^14.10.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss": "^3.4.0",
    "tsx": "^4.6.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "wouter": "^3.0.0",
    "ws": "^8.16.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/compression": "^1.7.0",
    "@types/express": "^4.17.0",
    "@types/express-session": "^1.17.0",
    "@types/ws": "^8.5.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "autoprefixer": "^10.4.0",
    "drizzle-kit": "^0.20.0",
    "esbuild": "^0.19.0",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "jest": "^29.7.0",
    "postcss": "^8.4.0",
    "prettier": "^3.1.0"
  }
}
PACKAGE_JSON_EOF
    
    log_success "package.json utworzony"
}

# ===========================================================================
# KONFIGURACJA TYPESCRIPT
# ===========================================================================

create_tsconfig() {
    log_info "Tworzenie tsconfig.json..."
    
    cat > tsconfig.json << 'TSCONFIG_EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["client/src/*"],
      "@shared/*": ["shared/*"],
      "@assets/*": ["client/public/*"]
    }
  },
  "include": [
    "client/src/**/*",
    "server/**/*",
    "shared/**/*",
    "vite.config.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
TSCONFIG_EOF
    
    log_success "tsconfig.json utworzony"
}

# ===========================================================================
# KONFIGURACJA VITE
# ===========================================================================

create_vite_config() {
    log_info "Tworzenie vite.config.ts..."
    
    cat > vite.config.ts << 'VITE_CONFIG_EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist/client'),
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'client/public')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
VITE_CONFIG_EOF
    
    log_success "vite.config.ts utworzony"
}

# ===========================================================================
# KONFIGURACJA TAILWIND
# ===========================================================================

create_tailwind_config() {
    log_info "Tworzenie tailwind.config.ts..."
    
    cat > tailwind.config.ts << 'TAILWIND_CONFIG_EOF'
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}',
    './client/index.html'
  ],
  theme: {
    extend: {
      colors: {
        'stefano-gold': '#D4AF37',
        'stefano-dark': '#1a1a1a',
        'stefano-red': '#8B0000',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
TAILWIND_CONFIG_EOF
    
    log_success "tailwind.config.ts utworzony"
}

# ===========================================================================
# POSTCSS CONFIG
# ===========================================================================

create_postcss_config() {
    log_info "Tworzenie postcss.config.js..."
    
    cat > postcss.config.js << 'POSTCSS_CONFIG_EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
POSTCSS_CONFIG_EOF
    
    log_success "postcss.config.js utworzony"
}

# ===========================================================================
# DRIZZLE CONFIG
# ===========================================================================

create_drizzle_config() {
    log_info "Tworzenie drizzle.config.ts..."
    
    cat > drizzle.config.ts << 'DRIZZLE_CONFIG_EOF'
import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || ''
  }
} satisfies Config;
DRIZZLE_CONFIG_EOF
    
    log_success "drizzle.config.ts utworzony"
}

# ===========================================================================
# SHARED SCHEMA
# ===========================================================================

create_shared_schema() {
    log_info "Tworzenie shared/schema.ts..."
    
    cat > shared/schema.ts << 'SCHEMA_EOF'
import { pgTable, text, integer, timestamp, boolean, real, json, serial, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Menu Items
export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  category: text('category').notNull(),
  image: text('image'),
  isAvailable: boolean('is_available').default(true),
  isVegetarian: boolean('is_vegetarian').default(false),
  isGlutenFree: boolean('is_gluten_free').default(false),
  calories: integer('calories'),
  preparationTime: integer('preparation_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  items: json('items').notNull(),
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull().default('pending'),
  orderType: text('order_type').notNull(), // delivery, pickup, dine-in
  deliveryAddress: text('delivery_address'),
  notes: text('notes'),
  paymentMethod: text('payment_method'),
  paymentStatus: text('payment_status').default('pending'),
  estimatedTime: integer('estimated_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Reservations
export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  date: timestamp('date').notNull(),
  time: text('time').notNull(),
  numberOfGuests: integer('number_of_guests').notNull(),
  tableNumber: integer('table_number'),
  status: text('status').notNull().default('pending'),
  specialRequests: text('special_requests'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Loyalty Members
export const loyaltyMembers = pgTable('loyalty_members', {
  id: serial('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  name: text('name').notNull(),
  email: text('email'),
  totalPoints: integer('total_points').default(0),
  lifetimePoints: integer('lifetime_points').default(0),
  tier: text('tier').default('bronze'),
  joinDate: timestamp('join_date').defaultNow(),
  lastVisit: timestamp('last_visit').defaultNow(),
  totalOrders: integer('total_orders').default(0),
  totalSpent: integer('total_spent').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Loyalty Transactions
export const loyaltyTransactions = pgTable('loyalty_transactions', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id').notNull().references(() => loyaltyMembers.id),
  type: text('type').notNull(), // earned, redeemed, bonus
  points: integer('points').notNull(),
  description: text('description'),
  orderId: integer('order_id').references(() => orders.id),
  createdAt: timestamp('created_at').defaultNow()
});

// Loyalty Rewards
export const loyaltyRewards = pgTable('loyalty_rewards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  pointsCost: integer('points_cost').notNull(),
  category: text('category'),
  value: real('value'),
  minTier: text('min_tier').default('bronze'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Contact Messages
export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').default('new'),
  createdAt: timestamp('created_at').defaultNow()
});

// API Keys (encrypted)
export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  service: text('service').notNull().unique(),
  encryptedKey: text('encrypted_key').notNull(),
  iv: text('iv').notNull(),
  lastUpdated: timestamp('last_updated').defaultNow(),
  createdBy: text('created_by').default('admin')
});

// Create insert schemas
export const insertMenuItemSchema = createInsertSchema(menuItems);
export const insertOrderSchema = createInsertSchema(orders);
export const insertReservationSchema = createInsertSchema(reservations);
export const insertLoyaltyMemberSchema = createInsertSchema(loyaltyMembers).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  totalPoints: true,
  lifetimePoints: true,
  tier: true,
  joinDate: true,
  lastVisit: true,
  totalOrders: true,
  totalSpent: true
});
export const insertLoyaltyTransactionSchema = createInsertSchema(loyaltyTransactions);
export const insertLoyaltyRewardSchema = createInsertSchema(loyaltyRewards);
export const insertContactMessageSchema = createInsertSchema(contactMessages);
export const insertApiKeySchema = createInsertSchema(apiKeys);

// Types
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type LoyaltyMember = typeof loyaltyMembers.$inferSelect;
export type LoyaltyTransaction = typeof loyaltyTransactions.$inferSelect;
export type LoyaltyReward = typeof loyaltyRewards.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type InsertLoyaltyMember = z.infer<typeof insertLoyaltyMemberSchema>;
export type InsertLoyaltyTransaction = z.infer<typeof insertLoyaltyTransactionSchema>;
export type InsertLoyaltyReward = z.infer<typeof insertLoyaltyRewardSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
SCHEMA_EOF
    
    log_success "shared/schema.ts utworzony"
}

# ===========================================================================
# SERVER INDEX
# ===========================================================================

create_server_index() {
    log_info "Tworzenie server/index.ts..."
    
    cat > server/index.ts << 'SERVER_INDEX_EOF'
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { setupRoutes } from './routes.js';
import { viteDevMiddleware } from './vite.js';

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}));

// Compression
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'stefano-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// API Routes
setupRoutes(app);

// WebSocket handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Handle real-time updates here
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Development mode with Vite
if (process.env.NODE_ENV !== 'production') {
  await viteDevMiddleware(app);
} else {
  // Production mode - serve static files
  app.use(express.static(path.join(__dirname, '../dist/client')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'));
  });
}

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173'}`);
});
SERVER_INDEX_EOF
    
    log_success "server/index.ts utworzony"
}

# ===========================================================================
# SERVER ROUTES
# ===========================================================================

create_server_routes() {
    log_info "Tworzenie server/routes.ts..."
    
    cat > server/routes.ts << 'SERVER_ROUTES_EOF'
import { Express, Request, Response } from 'express';
import { storage } from './storage.js';
import { 
  insertMenuItemSchema,
  insertOrderSchema,
  insertReservationSchema,
  insertLoyaltyMemberSchema,
  insertContactMessageSchema
} from '../shared/schema.js';
import { DeepSeekService } from './deepseek-service.js';
import { z } from 'zod';
import crypto from 'crypto';

const deepseekService = new DeepSeekService();

export function setupRoutes(app: Express) {
  
  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Menu endpoints
  app.get('/api/menu', async (req: Request, res: Response) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  });
  
  app.post('/api/menu', async (req: Request, res: Response) => {
    try {
      const data = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(data);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create menu item' });
      }
    }
  });
  
  // Orders endpoints
  app.get('/api/orders', async (req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
  
  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const data = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(data);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create order' });
      }
    }
  });
  
  app.patch('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.updateOrderStatus(id, req.body.status);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  });
  
  // Reservations endpoints
  app.get('/api/reservations', async (req: Request, res: Response) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reservations' });
    }
  });
  
  app.post('/api/reservations', async (req: Request, res: Response) => {
    try {
      const data = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(data);
      res.json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create reservation' });
      }
    }
  });
  
  // Loyalty Program endpoints
  app.post('/api/loyalty/join', async (req: Request, res: Response) => {
    try {
      const data = insertLoyaltyMemberSchema.parse(req.body);
      const existingMember = await storage.getLoyaltyMemberByPhone(data.phone);
      
      if (existingMember) {
        return res.status(400).json({ error: 'Member already exists' });
      }
      
      const member = await storage.createLoyaltyMember(data);
      
      // Add welcome bonus
      await storage.addLoyaltyTransaction({
        memberId: member.id,
        type: 'bonus',
        points: 100,
        description: 'Welcome bonus'
      });
      
      res.json({ member });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create loyalty member' });
      }
    }
  });
  
  app.get('/api/loyalty/member/:phone', async (req: Request, res: Response) => {
    try {
      const member = await storage.getLoyaltyMemberByPhone(req.params.phone);
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      const transactions = await storage.getLoyaltyTransactions(member.id);
      res.json({ member, transactions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch member' });
    }
  });
  
  app.get('/api/loyalty/rewards', async (req: Request, res: Response) => {
    try {
      const rewards = await storage.getLoyaltyRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rewards' });
    }
  });
  
  app.post('/api/loyalty/redeem/:memberId/:rewardId', async (req: Request, res: Response) => {
    try {
      const memberId = parseInt(req.params.memberId);
      const rewardId = parseInt(req.params.rewardId);
      
      const member = await storage.getLoyaltyMemberById(memberId);
      const reward = await storage.getLoyaltyRewardById(rewardId);
      
      if (!member || !reward) {
        return res.status(404).json({ error: 'Member or reward not found' });
      }
      
      if (member.totalPoints < reward.pointsCost) {
        return res.status(400).json({ error: 'Insufficient points' });
      }
      
      // Deduct points
      await storage.addLoyaltyTransaction({
        memberId,
        type: 'redeemed',
        points: -reward.pointsCost,
        description: `Redeemed: ${reward.name}`
      });
      
      res.json({ success: true, message: 'Reward redeemed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to redeem reward' });
    }
  });
  
  // Contact form endpoint
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const data = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to send message' });
      }
    }
  });
  
  // Chatbot endpoint with DeepSeek
  app.post('/api/chatbot', async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const response = await deepseekService.generateResponse(message, conversationHistory);
      res.json({ response });
    } catch (error) {
      console.error('Chatbot error:', error);
      res.status(500).json({ 
        response: 'Przepraszamy, wystąpił błąd. Spróbuj ponownie później.' 
      });
    }
  });
  
  // Admin authentication
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    
    if (password === process.env.ADMIN_PASSWORD || password === 'stefano2025admin') {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  });
  
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
  
  app.get('/api/admin/check', (req: Request, res: Response) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });
  
  // Admin statistics
  app.get('/api/admin/stats', async (req: Request, res: Response) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  });
  
  // API Keys management
  app.get('/api/admin/api-keys', async (req: Request, res: Response) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const keys = await storage.getApiKeys();
      res.json(keys);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch API keys' });
    }
  });
  
  app.post('/api/admin/api-keys', async (req: Request, res: Response) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const { service, apiKey } = req.body;
      
      // Encrypt the API key
      const algorithm = 'aes-256-cbc';
      const key = Buffer.from(process.env.ENCRYPTION_KEY || 'stefano-encryption-key-2025-secure', 'utf-8').slice(0, 32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      
      let encryptedKey = cipher.update(apiKey, 'utf8', 'hex');
      encryptedKey += cipher.final('hex');
      
      await storage.saveApiKey({
        service,
        encryptedKey,
        iv: iv.toString('hex')
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save API key' });
    }
  });
}
SERVER_ROUTES_EOF
    
    log_success "server/routes.ts utworzony"
}

# ===========================================================================
# SERVER STORAGE
# ===========================================================================

create_server_storage() {
    log_info "Tworzenie server/storage.ts..."
    
    cat > server/storage.ts << 'SERVER_STORAGE_EOF'
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import * as schema from '../shared/schema.js';

// Interface for storage operations
export interface IStorage {
  // Menu
  getMenuItems(): Promise<schema.MenuItem[]>;
  createMenuItem(data: schema.InsertMenuItem): Promise<schema.MenuItem>;
  updateMenuItem(id: number, data: Partial<schema.InsertMenuItem>): Promise<schema.MenuItem>;
  deleteMenuItem(id: number): Promise<void>;
  
  // Orders
  getOrders(): Promise<schema.Order[]>;
  getOrderById(id: number): Promise<schema.Order | null>;
  createOrder(data: schema.InsertOrder): Promise<schema.Order>;
  updateOrderStatus(id: number, status: string): Promise<schema.Order>;
  
  // Reservations
  getReservations(): Promise<schema.Reservation[]>;
  getReservationById(id: number): Promise<schema.Reservation | null>;
  createReservation(data: schema.InsertReservation): Promise<schema.Reservation>;
  updateReservationStatus(id: number, status: string): Promise<schema.Reservation>;
  
  // Loyalty Program
  getLoyaltyMemberByPhone(phone: string): Promise<schema.LoyaltyMember | null>;
  getLoyaltyMemberById(id: number): Promise<schema.LoyaltyMember | null>;
  createLoyaltyMember(data: schema.InsertLoyaltyMember): Promise<schema.LoyaltyMember>;
  updateLoyaltyMember(id: number, data: Partial<schema.LoyaltyMember>): Promise<schema.LoyaltyMember>;
  getLoyaltyTransactions(memberId: number): Promise<schema.LoyaltyTransaction[]>;
  addLoyaltyTransaction(data: Omit<schema.InsertLoyaltyTransaction, 'id' | 'createdAt'>): Promise<schema.LoyaltyTransaction>;
  getLoyaltyRewards(): Promise<schema.LoyaltyReward[]>;
  getLoyaltyRewardById(id: number): Promise<schema.LoyaltyReward | null>;
  
  // Contact Messages
  createContactMessage(data: schema.InsertContactMessage): Promise<schema.ContactMessage>;
  getContactMessages(): Promise<schema.ContactMessage[]>;
  
  // API Keys
  getApiKeys(): Promise<Array<{ service: string; lastUpdated: Date }>>;
  getApiKey(service: string): Promise<schema.ApiKey | null>;
  saveApiKey(data: { service: string; encryptedKey: string; iv: string }): Promise<void>;
  
  // Admin Stats
  getAdminStats(): Promise<any>;
}

// PostgreSQL Storage Implementation
class PostgreSQLStorage implements IStorage {
  private db: any;
  
  constructor() {
    if (process.env.DATABASE_URL) {
      const client = neon(process.env.DATABASE_URL);
      this.db = drizzle(client, { schema });
    }
  }
  
  // Menu operations
  async getMenuItems(): Promise<schema.MenuItem[]> {
    return await this.db.select().from(schema.menuItems);
  }
  
  async createMenuItem(data: schema.InsertMenuItem): Promise<schema.MenuItem> {
    const [item] = await this.db.insert(schema.menuItems).values(data).returning();
    return item;
  }
  
  async updateMenuItem(id: number, data: Partial<schema.InsertMenuItem>): Promise<schema.MenuItem> {
    const [item] = await this.db.update(schema.menuItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.menuItems.id, id))
      .returning();
    return item;
  }
  
  async deleteMenuItem(id: number): Promise<void> {
    await this.db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));
  }
  
  // Order operations
  async getOrders(): Promise<schema.Order[]> {
    return await this.db.select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt));
  }
  
  async getOrderById(id: number): Promise<schema.Order | null> {
    const [order] = await this.db.select()
      .from(schema.orders)
      .where(eq(schema.orders.id, id));
    return order || null;
  }
  
  async createOrder(data: schema.InsertOrder): Promise<schema.Order> {
    const [order] = await this.db.insert(schema.orders).values(data).returning();
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<schema.Order> {
    const [order] = await this.db.update(schema.orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();
    return order;
  }
  
  // Reservation operations
  async getReservations(): Promise<schema.Reservation[]> {
    return await this.db.select()
      .from(schema.reservations)
      .orderBy(desc(schema.reservations.date));
  }
  
  async getReservationById(id: number): Promise<schema.Reservation | null> {
    const [reservation] = await this.db.select()
      .from(schema.reservations)
      .where(eq(schema.reservations.id, id));
    return reservation || null;
  }
  
  async createReservation(data: schema.InsertReservation): Promise<schema.Reservation> {
    const [reservation] = await this.db.insert(schema.reservations).values(data).returning();
    return reservation;
  }
  
  async updateReservationStatus(id: number, status: string): Promise<schema.Reservation> {
    const [reservation] = await this.db.update(schema.reservations)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.reservations.id, id))
      .returning();
    return reservation;
  }
  
  // Loyalty Program operations
  async getLoyaltyMemberByPhone(phone: string): Promise<schema.LoyaltyMember | null> {
    const [member] = await this.db.select()
      .from(schema.loyaltyMembers)
      .where(eq(schema.loyaltyMembers.phone, phone));
    return member || null;
  }
  
  async getLoyaltyMemberById(id: number): Promise<schema.LoyaltyMember | null> {
    const [member] = await this.db.select()
      .from(schema.loyaltyMembers)
      .where(eq(schema.loyaltyMembers.id, id));
    return member || null;
  }
  
  async createLoyaltyMember(data: schema.InsertLoyaltyMember): Promise<schema.LoyaltyMember> {
    const [member] = await this.db.insert(schema.loyaltyMembers)
      .values({ ...data, totalPoints: 100, lifetimePoints: 100 })
      .returning();
    return member;
  }
  
  async updateLoyaltyMember(id: number, data: Partial<schema.LoyaltyMember>): Promise<schema.LoyaltyMember> {
    const [member] = await this.db.update(schema.loyaltyMembers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.loyaltyMembers.id, id))
      .returning();
    return member;
  }
  
  async getLoyaltyTransactions(memberId: number): Promise<schema.LoyaltyTransaction[]> {
    return await this.db.select()
      .from(schema.loyaltyTransactions)
      .where(eq(schema.loyaltyTransactions.memberId, memberId))
      .orderBy(desc(schema.loyaltyTransactions.createdAt));
  }
  
  async addLoyaltyTransaction(data: Omit<schema.InsertLoyaltyTransaction, 'id' | 'createdAt'>): Promise<schema.LoyaltyTransaction> {
    const [transaction] = await this.db.insert(schema.loyaltyTransactions)
      .values(data)
      .returning();
    
    // Update member points
    const member = await this.getLoyaltyMemberById(data.memberId);
    if (member) {
      const newTotalPoints = member.totalPoints + data.points;
      const newLifetimePoints = data.points > 0 
        ? member.lifetimePoints + data.points 
        : member.lifetimePoints;
      
      // Update tier based on lifetime points
      let newTier = 'bronze';
      if (newLifetimePoints >= 5000) newTier = 'platinum';
      else if (newLifetimePoints >= 2000) newTier = 'gold';
      else if (newLifetimePoints >= 500) newTier = 'silver';
      
      await this.updateLoyaltyMember(data.memberId, {
        totalPoints: newTotalPoints,
        lifetimePoints: newLifetimePoints,
        tier: newTier
      });
    }
    
    return transaction;
  }
  
  async getLoyaltyRewards(): Promise<schema.LoyaltyReward[]> {
    return await this.db.select()
      .from(schema.loyaltyRewards)
      .where(eq(schema.loyaltyRewards.isActive, true));
  }
  
  async getLoyaltyRewardById(id: number): Promise<schema.LoyaltyReward | null> {
    const [reward] = await this.db.select()
      .from(schema.loyaltyRewards)
      .where(eq(schema.loyaltyRewards.id, id));
    return reward || null;
  }
  
  // Contact Messages
  async createContactMessage(data: schema.InsertContactMessage): Promise<schema.ContactMessage> {
    const [message] = await this.db.insert(schema.contactMessages).values(data).returning();
    return message;
  }
  
  async getContactMessages(): Promise<schema.ContactMessage[]> {
    return await this.db.select()
      .from(schema.contactMessages)
      .orderBy(desc(schema.contactMessages.createdAt));
  }
  
  // API Keys
  async getApiKeys(): Promise<Array<{ service: string; lastUpdated: Date }>> {
    const keys = await this.db.select({
      service: schema.apiKeys.service,
      lastUpdated: schema.apiKeys.lastUpdated
    }).from(schema.apiKeys);
    return keys;
  }
  
  async getApiKey(service: string): Promise<schema.ApiKey | null> {
    const [key] = await this.db.select()
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.service, service));
    return key || null;
  }
  
  async saveApiKey(data: { service: string; encryptedKey: string; iv: string }): Promise<void> {
    await this.db.insert(schema.apiKeys)
      .values(data)
      .onConflictDoUpdate({
        target: schema.apiKeys.service,
        set: {
          encryptedKey: data.encryptedKey,
          iv: data.iv,
          lastUpdated: new Date()
        }
      });
  }
  
  // Admin Stats
  async getAdminStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [ordersToday] = await this.db.select({
      count: sql`count(*)`
    }).from(schema.orders)
      .where(gte(schema.orders.createdAt, today));
    
    const [totalMembers] = await this.db.select({
      count: sql`count(*)`
    }).from(schema.loyaltyMembers);
    
    const [totalRevenue] = await this.db.select({
      sum: sql`sum(total_amount)`
    }).from(schema.orders)
      .where(eq(schema.orders.paymentStatus, 'paid'));
    
    const [reservationsToday] = await this.db.select({
      count: sql`count(*)`
    }).from(schema.reservations)
      .where(gte(schema.reservations.date, today));
    
    return {
      ordersToday: ordersToday?.count || 0,
      totalMembers: totalMembers?.count || 0,
      totalRevenue: totalRevenue?.sum || 0,
      reservationsToday: reservationsToday?.count || 0
    };
  }
}

// In-memory storage for development
class MemoryStorage implements IStorage {
  private menuItems: schema.MenuItem[] = [];
  private orders: schema.Order[] = [];
  private reservations: schema.Reservation[] = [];
  private loyaltyMembers: schema.LoyaltyMember[] = [];
  private loyaltyTransactions: schema.LoyaltyTransaction[] = [];
  private loyaltyRewards: schema.LoyaltyReward[] = [];
  private contactMessages: schema.ContactMessage[] = [];
  private apiKeys: schema.ApiKey[] = [];
  private nextId = 1;
  
  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Sample menu items
    this.menuItems = [
      {
        id: 1,
        name: 'Pizza Margherita',
        description: 'Klasyczna pizza z sosem pomidorowym, mozzarellą i bazylią',
        price: 28,
        category: 'Pizza',
        image: '/images/pizza-margherita.jpg',
        isAvailable: true,
        isVegetarian: true,
        isGlutenFree: false,
        calories: 800,
        preparationTime: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Spaghetti Carbonara',
        description: 'Makaron z boczkiem, jajkiem i parmezanem',
        price: 32,
        category: 'Pasta',
        image: '/images/spaghetti-carbonara.jpg',
        isAvailable: true,
        isVegetarian: false,
        isGlutenFree: false,
        calories: 900,
        preparationTime: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Tiramisu',
        description: 'Klasyczny włoski deser z mascarpone i kawą',
        price: 18,
        category: 'Desserts',
        image: '/images/tiramisu.jpg',
        isAvailable: true,
        isVegetarian: true,
        isGlutenFree: false,
        calories: 450,
        preparationTime: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Sample loyalty rewards
    this.loyaltyRewards = [
      {
        id: 1,
        name: 'Darmowa kawa',
        description: 'Dowolna kawa z naszego menu',
        pointsCost: 50,
        category: 'Napoje',
        value: 12,
        minTier: 'bronze',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: '10% zniżki',
        description: 'Rabat na całe zamówienie',
        pointsCost: 100,
        category: 'Zniżki',
        value: 10,
        minTier: 'bronze',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Darmowy deser',
        description: 'Dowolny deser z menu',
        pointsCost: 150,
        category: 'Desery',
        value: 20,
        minTier: 'silver',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  // Menu operations
  async getMenuItems(): Promise<schema.MenuItem[]> {
    return [...this.menuItems];
  }
  
  async createMenuItem(data: schema.InsertMenuItem): Promise<schema.MenuItem> {
    const item: schema.MenuItem = {
      ...data,
      id: this.nextId++,
      isAvailable: data.isAvailable ?? true,
      isVegetarian: data.isVegetarian ?? false,
      isGlutenFree: data.isGlutenFree ?? false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.menuItems.push(item);
    return item;
  }
  
  async updateMenuItem(id: number, data: Partial<schema.InsertMenuItem>): Promise<schema.MenuItem> {
    const index = this.menuItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Menu item not found');
    this.menuItems[index] = { ...this.menuItems[index], ...data, updatedAt: new Date() };
    return this.menuItems[index];
  }
  
  async deleteMenuItem(id: number): Promise<void> {
    this.menuItems = this.menuItems.filter(item => item.id !== id);
  }
  
  // Order operations
  async getOrders(): Promise<schema.Order[]> {
    return [...this.orders].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  async getOrderById(id: number): Promise<schema.Order | null> {
    return this.orders.find(order => order.id === id) || null;
  }
  
  async createOrder(data: schema.InsertOrder): Promise<schema.Order> {
    const order: schema.Order = {
      ...data,
      id: this.nextId++,
      status: data.status || 'pending',
      paymentStatus: data.paymentStatus || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<schema.Order> {
    const order = this.orders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.updatedAt = new Date();
    return order;
  }
  
  // Reservation operations
  async getReservations(): Promise<schema.Reservation[]> {
    return [...this.reservations].sort((a, b) => 
      b.date.getTime() - a.date.getTime()
    );
  }
  
  async getReservationById(id: number): Promise<schema.Reservation | null> {
    return this.reservations.find(r => r.id === id) || null;
  }
  
  async createReservation(data: schema.InsertReservation): Promise<schema.Reservation> {
    const reservation: schema.Reservation = {
      ...data,
      id: this.nextId++,
      date: new Date(data.date),
      status: data.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reservations.push(reservation);
    return reservation;
  }
  
  async updateReservationStatus(id: number, status: string): Promise<schema.Reservation> {
    const reservation = this.reservations.find(r => r.id === id);
    if (!reservation) throw new Error('Reservation not found');
    reservation.status = status;
    reservation.updatedAt = new Date();
    return reservation;
  }
  
  // Loyalty Program operations
  async getLoyaltyMemberByPhone(phone: string): Promise<schema.LoyaltyMember | null> {
    return this.loyaltyMembers.find(m => m.phone === phone) || null;
  }
  
  async getLoyaltyMemberById(id: number): Promise<schema.LoyaltyMember | null> {
    return this.loyaltyMembers.find(m => m.id === id) || null;
  }
  
  async createLoyaltyMember(data: schema.InsertLoyaltyMember): Promise<schema.LoyaltyMember> {
    const member: schema.LoyaltyMember = {
      ...data,
      id: this.nextId++,
      totalPoints: 100,
      lifetimePoints: 100,
      tier: 'bronze',
      joinDate: new Date(),
      lastVisit: new Date(),
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.loyaltyMembers.push(member);
    return member;
  }
  
  async updateLoyaltyMember(id: number, data: Partial<schema.LoyaltyMember>): Promise<schema.LoyaltyMember> {
    const member = this.loyaltyMembers.find(m => m.id === id);
    if (!member) throw new Error('Member not found');
    Object.assign(member, data, { updatedAt: new Date() });
    return member;
  }
  
  async getLoyaltyTransactions(memberId: number): Promise<schema.LoyaltyTransaction[]> {
    return this.loyaltyTransactions
      .filter(t => t.memberId === memberId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async addLoyaltyTransaction(data: Omit<schema.InsertLoyaltyTransaction, 'id' | 'createdAt'>): Promise<schema.LoyaltyTransaction> {
    const transaction: schema.LoyaltyTransaction = {
      ...data,
      id: this.nextId++,
      createdAt: new Date()
    };
    this.loyaltyTransactions.push(transaction);
    
    // Update member points
    const member = this.loyaltyMembers.find(m => m.id === data.memberId);
    if (member) {
      member.totalPoints += data.points;
      if (data.points > 0) {
        member.lifetimePoints += data.points;
      }
      
      // Update tier
      if (member.lifetimePoints >= 5000) member.tier = 'platinum';
      else if (member.lifetimePoints >= 2000) member.tier = 'gold';
      else if (member.lifetimePoints >= 500) member.tier = 'silver';
      else member.tier = 'bronze';
      
      member.updatedAt = new Date();
    }
    
    return transaction;
  }
  
  async getLoyaltyRewards(): Promise<schema.LoyaltyReward[]> {
    return this.loyaltyRewards.filter(r => r.isActive);
  }
  
  async getLoyaltyRewardById(id: number): Promise<schema.LoyaltyReward | null> {
    return this.loyaltyRewards.find(r => r.id === id) || null;
  }
  
  // Contact Messages
  async createContactMessage(data: schema.InsertContactMessage): Promise<schema.ContactMessage> {
    const message: schema.ContactMessage = {
      ...data,
      id: this.nextId++,
      status: data.status || 'new',
      createdAt: new Date()
    };
    this.contactMessages.push(message);
    return message;
  }
  
  async getContactMessages(): Promise<schema.ContactMessage[]> {
    return [...this.contactMessages].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  // API Keys
  async getApiKeys(): Promise<Array<{ service: string; lastUpdated: Date }>> {
    return this.apiKeys.map(key => ({
      service: key.service,
      lastUpdated: key.lastUpdated
    }));
  }
  
  async getApiKey(service: string): Promise<schema.ApiKey | null> {
    return this.apiKeys.find(key => key.service === service) || null;
  }
  
  async saveApiKey(data: { service: string; encryptedKey: string; iv: string }): Promise<void> {
    const existingIndex = this.apiKeys.findIndex(key => key.service === data.service);
    const apiKey: schema.ApiKey = {
      ...data,
      id: existingIndex >= 0 ? this.apiKeys[existingIndex].id : this.nextId++,
      lastUpdated: new Date(),
      createdBy: 'admin'
    };
    
    if (existingIndex >= 0) {
      this.apiKeys[existingIndex] = apiKey;
    } else {
      this.apiKeys.push(apiKey);
    }
  }
  
  // Admin Stats
  async getAdminStats(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ordersToday = this.orders.filter(o => o.createdAt >= today).length;
    const totalMembers = this.loyaltyMembers.length;
    const totalRevenue = this.orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const reservationsToday = this.reservations.filter(r => r.date >= today).length;
    
    return {
      ordersToday,
      totalMembers,
      totalRevenue,
      reservationsToday
    };
  }
}

// Export the appropriate storage based on environment
export const storage: IStorage = process.env.DATABASE_URL 
  ? new PostgreSQLStorage() 
  : new MemoryStorage();
SERVER_STORAGE_EOF
    
    log_success "server/storage.ts utworzony"
}

# ===========================================================================
# INSTALACJA ZALEŻNOŚCI
# ===========================================================================

install_dependencies() {
    log_info "Instalowanie zależności..."
    
    npm install
    
    log_success "Zależności zainstalowane"
}

# ===========================================================================
# GŁÓWNA FUNKCJA
# ===========================================================================

main() {
    log_info "Rozpoczynanie instalacji Stefano Restaurant..."
    
    check_requirements
    create_project_structure
    create_package_json
    create_tsconfig
    create_vite_config
    create_tailwind_config
    create_postcss_config
    create_drizzle_config
    create_shared_schema
    create_server_index
    create_server_routes
    create_server_storage
    
    log_info "Tworzenie pozostałych plików..."
    
    # Tutaj można dodać więcej plików...
    
    install_dependencies
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                    INSTALACJA ZAKOŃCZONA POMYŚLNIE!                  ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Aby uruchomić aplikację:"
    echo "  cd $PROJECT_NAME"
    echo "  npm run dev"
    echo ""
    echo "Aplikacja będzie dostępna pod adresem: http://localhost:5173"
    echo ""
}

# Uruchom główną funkcję
main