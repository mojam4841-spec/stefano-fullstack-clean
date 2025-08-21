#!/bin/bash

# ===========================================================================
# STEFANO RESTAURANT - INSTALATOR APLIKACJI (CZĘŚĆ 2)
# ===========================================================================
# Ten plik zawiera komponenty React i resztę kodu aplikacji
# ===========================================================================

set -e

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# ===========================================================================
# SERVER - DEEPSEEK SERVICE
# ===========================================================================

create_deepseek_service() {
    log_info "Tworzenie server/deepseek-service.ts..."
    
    cat > server/deepseek-service.ts << 'DEEPSEEK_EOF'
import crypto from 'crypto';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class DeepSeekService {
  private apiKey: string | undefined;
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
  }
  
  private async getApiKey(): Promise<string | null> {
    if (this.apiKey) return this.apiKey;
    
    // Try to get from database
    try {
      const { storage } = await import('./storage.js');
      const encryptedKey = await storage.getApiKey('deepseek');
      
      if (encryptedKey) {
        // Decrypt the API key
        const algorithm = 'aes-256-cbc';
        const key = Buffer.from(process.env.ENCRYPTION_KEY || 'stefano-encryption-key-2025-secure', 'utf-8').slice(0, 32);
        const iv = Buffer.from(encryptedKey.iv, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        
        let decrypted = decipher.update(encryptedKey.encryptedKey, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
      }
    } catch (error) {
      console.error('Error getting API key:', error);
    }
    
    return null;
  }
  
  async generateResponse(userMessage: string, conversationHistory: Message[] = []): Promise<string> {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      return this.getFallbackResponse(userMessage);
    }
    
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: `Jesteś asystentem restauracji Stefano w Bełchatowie. 
          Odpowiadaj po polsku, w przyjazny i profesjonalny sposób.
          Pomagaj klientom z:
          - Informacjami o menu i cenach
          - Rezerwacjami stolików
          - Zamówieniami na wynos i dostawą
          - Godzinami otwarcia (11:00-22:00)
          - Lokalizacją (ul. Kościuszki 15, Bełchatów)
          - Programem lojalnościowym
          Zawsze bądź pomocny i zachęcaj do odwiedzenia restauracji.`
        },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
      ];
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 500,
          stream: false
        })
      });
      
      if (!response.ok) {
        console.error('DeepSeek API error:', response.status);
        return this.getFallbackResponse(userMessage);
      }
      
      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackResponse(userMessage);
      
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      return this.getFallbackResponse(userMessage);
    }
  }
  
  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Menu
    if (lowerMessage.includes('menu') || lowerMessage.includes('jadłospis')) {
      return 'Nasze menu obejmuje szeroki wybór dań włoskich: pizze, makarony, sałatki, desery i napoje. Zapraszam do zapoznania się z pełnym menu na naszej stronie. Które danie Cię interesuje?';
    }
    
    // Rezerwacja
    if (lowerMessage.includes('rezerwacja') || lowerMessage.includes('stolik')) {
      return 'Aby zarezerwować stolik, możesz skorzystać z formularza rezerwacji na naszej stronie lub zadzwonić pod numer 44 123 45 67. Na kiedy chciałbyś zarezerwować stolik?';
    }
    
    // Dostawa
    if (lowerMessage.includes('dostawa') || lowerMessage.includes('dowóz')) {
      return 'Oferujemy dostawę na terenie Bełchatowa. Minimalne zamówienie to 40 zł, koszt dostawy 8 zł. Czas dostawy to około 45-60 minut.';
    }
    
    // Godziny
    if (lowerMessage.includes('godzin') || lowerMessage.includes('otwar')) {
      return 'Jesteśmy otwarci codziennie od 11:00 do 22:00. W piątki i soboty do 23:00. Zapraszamy!';
    }
    
    // Lokalizacja
    if (lowerMessage.includes('gdzie') || lowerMessage.includes('adres')) {
      return 'Znajdziesz nas przy ul. Kościuszki 15 w Bełchatowie. Jesteśmy w centrum miasta, łatwo nas znaleźć!';
    }
    
    // Program lojalnościowy
    if (lowerMessage.includes('lojalnościow') || lowerMessage.includes('punkt')) {
      return 'Nasz program lojalnościowy oferuje punkty za każde zamówienie. Zbieraj punkty i wymieniaj je na darmowe dania, napoje i zniżki!';
    }
    
    // Kontakt
    if (lowerMessage.includes('kontakt') || lowerMessage.includes('telefon')) {
      return 'Możesz się z nami skontaktować:\n📞 Telefon: 44 123 45 67\n📧 Email: kontakt@stefano.pl\n📍 Adres: ul. Kościuszki 15, Bełchatów';
    }
    
    // Default
    return 'Dziękuję za wiadomość! Jestem asystentem restauracji Stefano. Mogę pomóc Ci z informacjami o menu, rezerwacjami, dostawą czy programem lojalnościowym. W czym mogę pomóc?';
  }
}
DEEPSEEK_EOF
    
    log_success "server/deepseek-service.ts utworzony"
}

# ===========================================================================
# SERVER - VITE MIDDLEWARE
# ===========================================================================

create_vite_middleware() {
    log_info "Tworzenie server/vite.ts..."
    
    cat > server/vite.ts << 'VITE_EOF'
import { Express } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function viteDevMiddleware(app: Express) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.resolve(__dirname, '../client')
  });
  
  app.use(vite.middlewares);
}
VITE_EOF
    
    log_success "server/vite.ts utworzony"
}

# ===========================================================================
# CLIENT - INDEX.HTML
# ===========================================================================

create_client_index() {
    log_info "Tworzenie client/index.html..."
    
    cat > client/index.html << 'INDEX_HTML_EOF'
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Stefano Restaurant & Pub - Najlepsza włoska kuchnia w Bełchatowie. Pizza, pasta, desery. Zamówienia online, rezerwacje, program lojalnościowy.">
  <meta name="keywords" content="restauracja, Bełchatów, pizza, pasta, włoska kuchnia, dostawa, rezerwacje">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Stefano Restaurant & Pub - Bełchatów">
  <meta property="og:description" content="Najlepsza włoska kuchnia w Bełchatowie. Zamów online lub zarezerwuj stolik!">
  <meta property="og:type" content="restaurant">
  <meta property="og:url" content="https://stefano.pl">
  <meta property="og:image" content="/og-image.jpg">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <title>Stefano Restaurant & Pub - Bełchatów</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
INDEX_HTML_EOF
    
    log_success "client/index.html utworzony"
}

# ===========================================================================
# CLIENT - MAIN.TSX
# ===========================================================================

create_client_main() {
    log_info "Tworzenie client/src/main.tsx..."
    
    cat > client/src/main.tsx << 'MAIN_TSX_EOF'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
MAIN_TSX_EOF
    
    log_success "client/src/main.tsx utworzony"
}

# ===========================================================================
# CLIENT - INDEX.CSS
# ===========================================================================

create_client_css() {
    log_info "Tworzenie client/src/index.css..."
    
    cat > client/src/index.css << 'INDEX_CSS_EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: 'Inter', sans-serif;
  }
}

/* Custom styles for Stefano branding */
.stefano-gradient {
  background: linear-gradient(135deg, #D4AF37 0%, #8B0000 100%);
}

.stefano-gold {
  color: #D4AF37;
}

.stefano-red {
  color: #8B0000;
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #D4AF37;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #B8941F;
}
INDEX_CSS_EOF
    
    log_success "client/src/index.css utworzony"
}

# ===========================================================================
# CLIENT - APP.TSX
# ===========================================================================

create_client_app() {
    log_info "Tworzenie client/src/App.tsx..."
    
    cat > client/src/App.tsx << 'APP_TSX_EOF'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import MenuPage from '@/pages/MenuPage';
import OrderPage from '@/pages/OrderPage';
import ReservationPage from '@/pages/ReservationPage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import ContactPage from '@/pages/ContactPage';
import AdminPage from '@/pages/AdminPage';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Navigation />
          
          <main className="flex-grow">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/menu" component={MenuPage} />
              <Route path="/order" component={OrderPage} />
              <Route path="/reservation" component={ReservationPage} />
              <Route path="/loyalty" component={LoyaltyPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/admin" component={AdminPage} />
              <Route>
                <div className="container mx-auto px-4 py-16 text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Strona nie znaleziona</h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Przepraszamy, strona której szukasz nie istnieje.
                  </p>
                </div>
              </Route>
            </Switch>
          </main>
          
          <Footer />
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
APP_TSX_EOF
    
    log_success "client/src/App.tsx utworzony"
}

# ===========================================================================
# CLIENT - LIB/QUERY-CLIENT.TS
# ===========================================================================

create_query_client() {
    log_info "Tworzenie client/src/lib/queryClient.ts..."
    
    cat > client/src/lib/queryClient.ts << 'QUERY_CLIENT_EOF'
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// API request helper
export async function apiRequest(
  url: string,
  options?: RequestInit
): Promise<any> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

// Default fetcher for queries
export const defaultFetcher = async ({ queryKey }: { queryKey: any[] }) => {
  const url = queryKey[0];
  return apiRequest(url);
};
QUERY_CLIENT_EOF
    
    log_success "client/src/lib/queryClient.ts utworzony"
}

# ===========================================================================
# CLIENT - LIB/UTILS.TS
# ===========================================================================

create_utils() {
    log_info "Tworzenie client/src/lib/utils.ts..."
    
    cat > client/src/lib/utils.ts << 'UTILS_EOF'
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(price);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(d);
}

export function formatPhoneNumber(phone: string): string {
  // Format Polish phone number
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

export function calculateDeliveryTime(distance: number): number {
  // Base time 30 minutes + 5 minutes per km
  return 30 + (distance * 5);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${year}${month}${day}-${random}`;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 9 || cleaned.length === 11;
}
UTILS_EOF
    
    log_success "client/src/lib/utils.ts utworzony"
}

# ===========================================================================
# CLIENT - HOOKS/USE-TOAST.TS
# ===========================================================================

create_use_toast() {
    log_info "Tworzenie client/src/hooks/use-toast.ts..."
    
    cat > client/src/hooks/use-toast.ts << 'USE_TOAST_EOF'
import { useState, useEffect } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const toastState: ToastState = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
};

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function useToast() {
  const [, setCount] = useState(0);

  useEffect(() => {
    const listener = () => setCount((c) => c + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const toast = (props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...props, id };
    
    toastState.toasts = [...toastState.toasts, newToast];
    emitChange();

    // Auto remove after 5 seconds
    setTimeout(() => {
      toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
      emitChange();
    }, 5000);
  };

  return {
    toast,
    toasts: toastState.toasts,
  };
}
USE_TOAST_EOF
    
    log_success "client/src/hooks/use-toast.ts utworzony"
}

# ===========================================================================
# KOMPONENTY UI - BUTTON
# ===========================================================================

create_ui_button() {
    log_info "Tworzenie client/src/components/ui/button.tsx..."
    
    cat > client/src/components/ui/button.tsx << 'BUTTON_EOF'
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
BUTTON_EOF
    
    log_success "client/src/components/ui/button.tsx utworzony"
}

# ===========================================================================
# KOMPONENTY UI - CARD
# ===========================================================================

create_ui_card() {
    log_info "Tworzenie client/src/components/ui/card.tsx..."
    
    cat > client/src/components/ui/card.tsx << 'CARD_EOF'
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
CARD_EOF
    
    log_success "client/src/components/ui/card.tsx utworzony"
}

# ===========================================================================
# ENV FILES
# ===========================================================================

create_env_files() {
    log_info "Tworzenie plików .env..."
    
    cat > .env.example << 'ENV_EXAMPLE_EOF'
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stefano

# Session
SESSION_SECRET=your-session-secret-here

# Admin
ADMIN_PASSWORD=stefano2025admin

# API Keys
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
SENDGRID_API_KEY=your-sendgrid-api-key

# Encryption
ENCRYPTION_KEY=stefano-encryption-key-2025-secure

# Frontend URL (production)
FRONTEND_URL=https://stefano.pl

# Port
PORT=5000
ENV_EXAMPLE_EOF
    
    cat > .env << 'ENV_EOF'
# Development environment
DATABASE_URL=
SESSION_SECRET=stefano-dev-secret-2025
ADMIN_PASSWORD=stefano2025admin
ENCRYPTION_KEY=stefano-encryption-key-2025-secure
PORT=5000
ENV_EOF
    
    log_success "Pliki .env utworzone"
}

# ===========================================================================
# GITIGNORE
# ===========================================================================

create_gitignore() {
    log_info "Tworzenie .gitignore..."
    
    cat > .gitignore << 'GITIGNORE_EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# Database
*.sqlite
*.sqlite3
drizzle/

# Temporary files
tmp/
temp/
*.tmp
*.temp

# OS files
Thumbs.db
ENV_EOF
    
    log_success ".gitignore utworzony"
}

# ===========================================================================
# README
# ===========================================================================

create_readme() {
    log_info "Tworzenie README.md..."
    
    cat > README.md << 'README_EOF'
# Stefano Restaurant & Pub - Full Stack Application

## 🍕 O projekcie

Kompletny system zarządzania restauracją dla Stefano Restaurant & Pub w Bełchatowie. Aplikacja oferuje:

- 📱 Responsywny interfejs użytkownika
- 🛒 System zamówień online
- 📅 Rezerwacje stolików
- 🎁 Program lojalnościowy
- 💬 Chatbot z AI (DeepSeek)
- 👨‍💼 Panel administracyjny
- 📊 Analityka i raporty

## 🚀 Szybki start

### Wymagania
- Node.js 18+
- PostgreSQL (opcjonalnie)

### Instalacja

1. Sklonuj repozytorium:
```bash
git clone https://github.com/your-repo/stefano-restaurant.git
cd stefano-restaurant
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env
# Edytuj .env i dodaj swoje dane
```

4. Uruchom aplikację:
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:5173

## 🏗️ Struktura projektu

```
stefano-restaurant/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Komponenty React
│   │   ├── pages/      # Strony aplikacji
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utilities i helpers
│   │   └── App.tsx     # Główny komponent
│   └── index.html
├── server/             # Backend (Express + TypeScript)
│   ├── index.ts       # Entry point
│   ├── routes.ts      # API endpoints
│   ├── storage.ts     # Data layer
│   └── deepseek-service.ts
├── shared/            # Współdzielone typy i schematy
│   └── schema.ts
└── package.json
```

## 📋 Funkcjonalności

### Dla klientów
- ✅ Przeglądanie menu
- ✅ Składanie zamówień online
- ✅ Rezerwacja stolików
- ✅ Program lojalnościowy
- ✅ Chatbot pomocniczy
- ✅ Śledzenie statusu zamówienia

### Dla administratorów
- ✅ Zarządzanie menu
- ✅ Obsługa zamówień
- ✅ Zarządzanie rezerwacjami
- ✅ Program lojalnościowy
- ✅ Statystyki i raporty
- ✅ Zarządzanie kluczami API

## 🛠️ Technologie

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Wouter (routing)
- Radix UI

### Backend
- Node.js
- Express
- TypeScript
- Drizzle ORM
- PostgreSQL / In-memory storage
- WebSockets

### AI & Integracje
- DeepSeek API (chatbot)
- Stripe (płatności)
- SendGrid (email)

## 📦 Skrypty

```bash
# Development
npm run dev           # Uruchom aplikację w trybie dev

# Build
npm run build        # Zbuduj produkcyjną wersję
npm run start        # Uruchom produkcyjną wersję

# Database
npm run db:push      # Wykonaj migracje
npm run db:studio    # Otwórz Drizzle Studio

# Linting
npm run lint         # Sprawdź kod
```

## 🔐 Bezpieczeństwo

- Szyfrowanie kluczy API (AES-256)
- Rate limiting
- Helmet.js dla security headers
- Session management
- Input validation z Zod

## 📱 Progressive Web App

Aplikacja wspiera PWA:
- Instalacja na urządzeniu
- Praca offline
- Push notifications (planowane)

## 🌍 Deployment

### Produkcja

1. Zbuduj aplikację:
```bash
npm run build
```

2. Ustaw zmienne środowiskowe produkcyjne

3. Uruchom:
```bash
npm run start
```

### Docker

```bash
docker build -t stefano-restaurant .
docker run -p 5000:5000 stefano-restaurant
```

## 📝 Licencja

MIT License

## 👥 Autorzy

Stefano Restaurant Development Team

## 📞 Kontakt

- Email: kontakt@stefano.pl
- Tel: +48 44 123 45 67
- Adres: ul. Kościuszki 15, Bełchatów

---

Made with ❤️ for Stefano Restaurant & Pub
README_EOF
    
    log_success "README.md utworzony"
}

# ===========================================================================
# DOCKER FILES
# ===========================================================================

create_docker_files() {
    log_info "Tworzenie plików Docker..."
    
    cat > Dockerfile << 'DOCKERFILE_EOF'
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Start application
CMD ["node", "dist/server.js"]
DOCKERFILE_EOF
    
    cat > docker-compose.yml << 'DOCKER_COMPOSE_EOF'
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://stefano:stefano123@db:5432/stefano_db
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: stefano
      POSTGRES_PASSWORD: stefano123
      POSTGRES_DB: stefano_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
DOCKER_COMPOSE_EOF
    
    log_success "Pliki Docker utworzone"
}

# ===========================================================================
# PACKAGE SCRIPTS
# ===========================================================================

create_additional_scripts() {
    log_info "Tworzenie dodatkowych skryptów..."
    
    cat > start.sh << 'START_SH_EOF'
#!/bin/bash

echo "Starting Stefano Restaurant Application..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "Please configure your .env file before starting the application"
    exit 1
fi

# Start the application
npm run dev
START_SH_EOF
    
    chmod +x start.sh
    
    cat > deploy.sh << 'DEPLOY_SH_EOF'
#!/bin/bash

echo "Deploying Stefano Restaurant Application..."

# Build the application
echo "Building application..."
npm run build

# Run database migrations
echo "Running database migrations..."
npm run db:push

# Start production server
echo "Starting production server..."
npm run start
DEPLOY_SH_EOF
    
    chmod +x deploy.sh
    
    log_success "Skrypty dodatkowe utworzone"
}

# ===========================================================================
# GŁÓWNA FUNKCJA
# ===========================================================================

main() {
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║        STEFANO RESTAURANT - INSTALATOR (CZĘŚĆ 2)                     ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    
    # Sprawdź czy jesteśmy w odpowiednim folderze
    if [ ! -f "package.json" ]; then
        log_error "Uruchom ten skrypt w folderze projektu Stefano Restaurant!"
        exit 1
    fi
    
    # Twórz pliki
    create_deepseek_service
    create_vite_middleware
    create_client_index
    create_client_main
    create_client_css
    create_client_app
    create_query_client
    create_utils
    create_use_toast
    create_ui_button
    create_ui_card
    create_env_files
    create_gitignore
    create_readme
    create_docker_files
    create_additional_scripts
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║                    CZĘŚĆ 2 ZAKOŃCZONA POMYŚLNIE!                     ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Aby dokończyć instalację, uruchom trzecią część instalatora:"
    echo "  ./stefano-complete-installer-part3.sh"
    echo ""
}

# Uruchom główną funkcję
main