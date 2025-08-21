// Enterprise Demo Configuration
// Allows full functionality with $0 cost using free tiers and intelligent caching

export interface DemoConfig {
  mode: 'production' | 'demo';
  email: {
    provider: 'sendgrid' | 'console' | 'resend';
    dailyLimit: number;
    testMode: boolean;
    testEmails: string[];
  };
  sms: {
    provider: 'twilio' | 'console' | 'vonage';
    testMode: boolean;
    testPhones: string[];
    logToConsole: boolean;
  };
  payments: {
    provider: 'stripe';
    testMode: boolean;
    testCards: string[];
    webhookEndpoint?: string;
  };
  ai: {
    provider: 'openai' | 'claude' | 'cached';
    cacheEnabled: boolean;
    cacheTTL: number;
    fallbackResponses: boolean;
    maxTokens: number;
  };
  database: {
    provider: 'neon' | 'supabase' | 'railway';
    connectionPooling: boolean;
    maxConnections: number;
  };
  monitoring: {
    provider: 'sentry' | 'console';
    sampleRate: number;
    environment: string;
  };
}

export const DEMO_CONFIG: DemoConfig = {
  mode: process.env.DEMO_MODE === 'true' ? 'demo' : 'production',
  
  // Email Service - SendGrid Free Tier (100/day, 3000/month)
  email: {
    provider: process.env.DEMO_MODE === 'true' ? 'console' : 'sendgrid',
    dailyLimit: 100,
    testMode: process.env.DEMO_MODE === 'true',
    testEmails: ['test@stefanogroup.pl', 'demo@stefanogroup.pl']
  },
  
  // SMS Service - Console logging in demo mode
  sms: {
    provider: process.env.DEMO_MODE === 'true' ? 'console' : 'twilio',
    testMode: process.env.DEMO_MODE === 'true',
    testPhones: ['500600700', '600700800', '700800900'],
    logToConsole: true
  },
  
  // Payment Processing - Stripe Test Mode
  payments: {
    provider: 'stripe',
    testMode: true, // Always use test keys for demo
    testCards: [
      '4242424242424242', // Visa
      '5555555555554444', // Mastercard
      '378282246310005'   // Amex
    ],
    webhookEndpoint: process.env.STRIPE_WEBHOOK_ENDPOINT
  },
  
  // AI Services - Cached responses + fallback
  ai: {
    provider: process.env.DEMO_MODE === 'true' ? 'cached' : 'openai',
    cacheEnabled: true,
    cacheTTL: 86400, // 24 hours
    fallbackResponses: true,
    maxTokens: 150 // Limit tokens to reduce costs
  },
  
  // Database - Neon Free Tier (0.5GB)
  database: {
    provider: 'neon',
    connectionPooling: true,
    maxConnections: 5 // Free tier limit
  },
  
  // Monitoring - Sentry Developer (5K events/month)
  monitoring: {
    provider: process.env.DEMO_MODE === 'true' ? 'console' : 'sentry',
    sampleRate: 0.1, // 10% sampling to stay within free tier
    environment: process.env.NODE_ENV || 'development'
  }
};

// Cost tracking for demo mode
export const COST_LIMITS = {
  email: {
    daily: 100,
    monthly: 3000,
    costPerEmail: 0 // Free tier
  },
  sms: {
    daily: 10,
    monthly: 100,
    costPerSMS: 0 // Console mode
  },
  ai: {
    daily: 100,
    monthly: 1000,
    costPerRequest: 0 // Cached
  },
  database: {
    storage: 0.5, // GB
    connections: 5,
    costPerGB: 0 // Free tier
  }
};

// Feature flags for gradual rollout
export const FEATURE_FLAGS = {
  enableEmailNotifications: true,
  enableSMSNotifications: process.env.DEMO_MODE !== 'true',
  enableAIChat: true,
  enablePayments: true,
  enableAnalytics: true,
  enableMonitoring: true,
  enableCache: true,
  enableRateLimiting: true
};

// Demo data for testing
export const DEMO_DATA = {
  testCustomer: {
    email: 'demo@stefanogroup.pl',
    phone: '500600700',
    name: 'Demo Customer'
  },
  testOrder: {
    items: [
      { name: 'Pizza Margherita', price: 35, quantity: 1 },
      { name: 'Coca Cola', price: 8, quantity: 2 }
    ],
    total: 51
  },
  testPayment: {
    cardNumber: '4242424242424242',
    expiry: '12/25',
    cvc: '123'
  }
};

// Helper to check if we're in demo mode
export function isDemoMode(): boolean {
  return DEMO_CONFIG.mode === 'demo';
}

// Helper to get appropriate service based on demo mode
export function getService<T>(production: T, demo: T): T {
  return isDemoMode() ? demo : production;
}