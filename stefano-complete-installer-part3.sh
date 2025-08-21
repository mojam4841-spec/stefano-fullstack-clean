#!/bin/bash

# ===========================================================================
# STEFANO RESTAURANT - INSTALATOR APLIKACJI (CZĘŚĆ 3)
# ===========================================================================
# Ten plik zawiera strony i komponenty aplikacji
# ===========================================================================

set -e

# Kolory
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# ===========================================================================
# STRONY - HOME PAGE
# ===========================================================================

create_home_page() {
    log_info "Tworzenie client/src/pages/HomePage.tsx..."
    
    cat > client/src/pages/HomePage.tsx << 'HOME_PAGE_EOF'
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pizza, Clock, MapPin, Phone, Star, Users, Gift, ChefHat } from 'lucide-react';
import Hero from '@/components/Hero';
import FeaturedMenu from '@/components/FeaturedMenu';
import Testimonials from '@/components/Testimonials';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Dlaczego Stefano?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <ChefHat className="w-8 h-8 text-stefano-gold mb-2" />
                <CardTitle>Autentyczna Kuchnia</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tradycyjne włoskie przepisy prosto z serca Italii
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-stefano-gold mb-2" />
                <CardTitle>Szybka Dostawa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dostawa w 45-60 minut na terenie całego Bełchatowa
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Gift className="w-8 h-8 text-stefano-gold mb-2" />
                <CardTitle>Program Lojalnościowy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Zbieraj punkty i wymieniaj na darmowe dania
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Star className="w-8 h-8 text-stefano-gold mb-2" />
                <CardTitle>Najwyższa Jakość</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Świeże składniki i najlepsze produkty
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Featured Menu */}
      <FeaturedMenu />
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Głodny?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Zamów teraz i ciesz się pysznym jedzeniem!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button size="lg" className="bg-stefano-gold hover:bg-yellow-600">
                <Pizza className="mr-2" />
                Zamów Online
              </Button>
            </Link>
            
            <Link href="/reservation">
              <Button size="lg" variant="outline">
                <Users className="mr-2" />
                Zarezerwuj Stolik
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Contact Info */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-stefano-gold mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Adres</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ul. Kościuszki 15<br />
                97-400 Bełchatów
              </p>
            </div>
            
            <div className="text-center">
              <Clock className="w-8 h-8 text-stefano-gold mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Godziny Otwarcia</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pon-Czw: 11:00 - 22:00<br />
                Pt-Sob: 11:00 - 23:00<br />
                Niedziela: 12:00 - 22:00
              </p>
            </div>
            
            <div className="text-center">
              <Phone className="w-8 h-8 text-stefano-gold mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Kontakt</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tel: 44 123 45 67<br />
                Email: kontakt@stefano.pl
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
HOME_PAGE_EOF
    
    log_success "client/src/pages/HomePage.tsx utworzony"
}

# ===========================================================================
# STRONY - MENU PAGE
# ===========================================================================

create_menu_page() {
    log_info "Tworzenie client/src/pages/MenuPage.tsx..."
    
    cat > client/src/pages/MenuPage.tsx << 'MENU_PAGE_EOF'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Leaf, Wheat, ShoppingCart, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { MenuItem } from '@shared/schema';

export default function MenuPage() {
  const [cart, setCart] = useState<Array<MenuItem & { quantity: number }>>([]);
  
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
  });
  
  const categories = [...new Set(menuItems.map(item => item.category))];
  
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Ładowanie menu...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Nasze Menu</h1>
      
      {cart.length > 0 && (
        <Card className="mb-8 bg-stefano-gold/10 border-stefano-gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart />
              Koszyk ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Suma: {formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}
            </p>
            <Button className="mt-4" onClick={() => window.location.href = '/order'}>
              Przejdź do zamówienia
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <Card key={item.id} className={!item.isAvailable ? 'opacity-60' : ''}>
                    {item.image && (
                      <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <span className="text-xl font-bold text-stefano-gold">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        {item.isVegetarian && (
                          <Badge variant="secondary" className="text-xs">
                            <Leaf className="w-3 h-3 mr-1" />
                            Wegetariańskie
                          </Badge>
                        )}
                        {item.isGlutenFree && (
                          <Badge variant="secondary" className="text-xs">
                            <Wheat className="w-3 h-3 mr-1" />
                            Bezglutenowe
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription className="mb-4">
                        {item.description}
                      </CardDescription>
                      
                      {item.preparationTime && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                          <Clock className="w-4 h-4" />
                          {item.preparationTime} min
                        </div>
                      )}
                      
                      {item.calories && (
                        <p className="text-sm text-gray-500 mb-4">
                          {item.calories} kcal
                        </p>
                      )}
                      
                      <Button 
                        className="w-full"
                        disabled={!item.isAvailable}
                        onClick={() => addToCart(item)}
                      >
                        {item.isAvailable ? (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Dodaj do koszyka
                          </>
                        ) : (
                          'Niedostępne'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
MENU_PAGE_EOF
    
    log_success "client/src/pages/MenuPage.tsx utworzony"
}

# ===========================================================================
# KOMPONENTY - NAVIGATION
# ===========================================================================

create_navigation() {
    log_info "Tworzenie client/src/components/Navigation.tsx..."
    
    cat > client/src/components/Navigation.tsx << 'NAVIGATION_EOF'
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, Pizza, ShoppingCart, Calendar, Gift, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  
  const navItems = [
    { href: '/', label: 'Start', icon: Pizza },
    { href: '/menu', label: 'Menu', icon: ShoppingCart },
    { href: '/order', label: 'Zamów', icon: ShoppingCart },
    { href: '/reservation', label: 'Rezerwacja', icon: Calendar },
    { href: '/loyalty', label: 'Program Lojalnościowy', icon: Gift },
    { href: '/contact', label: 'Kontakt', icon: Phone },
  ];
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Pizza className="h-8 w-8 text-stefano-gold mr-2" />
              <span className="text-xl font-bold">Stefano</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? 'default' : 'ghost'}
                    className={cn(
                      'flex items-center gap-2',
                      location === item.href && 'bg-stefano-gold hover:bg-yellow-600'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
                      location === item.href
                        ? 'bg-stefano-gold text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
            
            <Link href="/admin">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Admin
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
NAVIGATION_EOF
    
    log_success "client/src/components/Navigation.tsx utworzony"
}

# ===========================================================================
# KOMPONENTY - FOOTER
# ===========================================================================

create_footer() {
    log_info "Tworzenie client/src/components/Footer.tsx..."
    
    cat > client/src/components/Footer.tsx << 'FOOTER_EOF'
import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-stefano-gold text-xl font-bold mb-4">Stefano Restaurant</h3>
            <p className="text-gray-400">
              Najlepsza włoska kuchnia w Bełchatowie. Tradycyjne przepisy, świeże składniki, niezapomniane smaki.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-stefano-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-stefano-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-stefano-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-stefano-gold text-xl font-bold mb-4">Szybkie Linki</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu">
                  <a className="text-gray-400 hover:text-stefano-gold transition-colors">Menu</a>
                </Link>
              </li>
              <li>
                <Link href="/order">
                  <a className="text-gray-400 hover:text-stefano-gold transition-colors">Zamów Online</a>
                </Link>
              </li>
              <li>
                <Link href="/reservation">
                  <a className="text-gray-400 hover:text-stefano-gold transition-colors">Rezerwacje</a>
                </Link>
              </li>
              <li>
                <Link href="/loyalty">
                  <a className="text-gray-400 hover:text-stefano-gold transition-colors">Program Lojalnościowy</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-stefano-gold text-xl font-bold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                ul. Kościuszki 15, 97-400 Bełchatów
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                44 123 45 67
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                kontakt@stefano.pl
              </li>
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h3 className="text-stefano-gold text-xl font-bold mb-4">Godziny Otwarcia</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pon-Czw: 11:00 - 22:00
              </li>
              <li className="pl-6">Pt-Sob: 11:00 - 23:00</li>
              <li className="pl-6">Niedziela: 12:00 - 22:00</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Stefano Restaurant & Pub. Wszystkie prawa zastrzeżone.</p>
          <p className="mt-2 text-sm">
            Wykonanie: <span className="text-stefano-gold">Stefano Development Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
FOOTER_EOF
    
    log_success "client/src/components/Footer.tsx utworzony"
}

# ===========================================================================
# KOMPONENTY - HERO
# ===========================================================================

create_hero() {
    log_info "Tworzenie client/src/components/Hero.tsx..."
    
    cat > client/src/components/Hero.tsx << 'HERO_EOF'
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Pizza, Clock, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-700 text-white">
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Witaj w <span className="text-stefano-gold">Stefano</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Autentyczna włoska kuchnia w sercu Bełchatowa
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Star className="text-stefano-gold" />
              <span>4.8/5 Ocena</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-stefano-gold" />
              <span>Dostawa 45-60 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Pizza className="text-stefano-gold" />
              <span>100+ Dań</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/order">
              <Button size="lg" className="bg-stefano-gold hover:bg-yellow-600 text-black">
                Zamów Online
              </Button>
            </Link>
            
            <Link href="/menu">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Zobacz Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
HERO_EOF
    
    log_success "client/src/components/Hero.tsx utworzony"
}

# ===========================================================================
# KOMPONENTY UI - TOASTER
# ===========================================================================

create_ui_toaster() {
    log_info "Tworzenie client/src/components/ui/toaster.tsx..."
    
    cat > client/src/components/ui/toaster.tsx << 'TOASTER_EOF'
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'relative rounded-lg p-4 pr-8 shadow-lg transition-all',
            'animate-in slide-in-from-bottom-5',
            toast.variant === 'destructive'
              ? 'bg-red-600 text-white'
              : 'bg-white dark:bg-gray-800 border'
          )}
        >
          {toast.title && (
            <div className="font-semibold">{toast.title}</div>
          )}
          {toast.description && (
            <div className="mt-1 text-sm opacity-90">
              {toast.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
TOASTER_EOF
    
    log_success "client/src/components/ui/toaster.tsx utworzony"
}

# ===========================================================================
# KOMPONENTY UI - INPUT
# ===========================================================================

create_ui_input() {
    log_info "Tworzenie client/src/components/ui/input.tsx..."
    
    cat > client/src/components/ui/input.tsx << 'INPUT_EOF'
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
INPUT_EOF
    
    log_success "client/src/components/ui/input.tsx utworzony"
}

# ===========================================================================
# KOMPONENTY UI - BADGE
# ===========================================================================

create_ui_badge() {
    log_info "Tworzenie client/src/components/ui/badge.tsx..."
    
    cat > client/src/components/ui/badge.tsx << 'BADGE_EOF'
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
BADGE_EOF
    
    log_success "client/src/components/ui/badge.tsx utworzony"
}

# ===========================================================================
# TWORZENIE GŁÓWNEGO SKRYPTU INSTALACYJNEGO
# ===========================================================================

create_master_installer() {
    log_info "Tworzenie głównego skryptu instalacyjnego..."
    
    cat > stefano-complete-installer.sh << 'MASTER_INSTALLER_EOF'
#!/bin/bash

# ===========================================================================
# STEFANO RESTAURANT - GŁÓWNY INSTALATOR
# ===========================================================================
# Ten skrypt uruchamia wszystkie części instalatora
# ===========================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║        STEFANO RESTAURANT - KOMPLETNY INSTALATOR                     ║"
echo "║                     Wersja 1.0.0                                     ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Sprawdź czy wszystkie części istnieją
if [ ! -f "stefano-complete-installer-part1.sh" ]; then
    echo "❌ Brak pliku: stefano-complete-installer-part1.sh"
    exit 1
fi

if [ ! -f "stefano-complete-installer-part2.sh" ]; then
    echo "❌ Brak pliku: stefano-complete-installer-part2.sh"
    exit 1
fi

if [ ! -f "stefano-complete-installer-part3.sh" ]; then
    echo "❌ Brak pliku: stefano-complete-installer-part3.sh"
    exit 1
fi

# Nadaj uprawnienia wykonywania
chmod +x stefano-complete-installer-part1.sh
chmod +x stefano-complete-installer-part2.sh
chmod +x stefano-complete-installer-part3.sh

# Uruchom część 1
echo "▶️  Uruchamianie części 1..."
./stefano-complete-installer-part1.sh

# Przejdź do folderu projektu
cd stefano-restaurant

# Uruchom część 2
echo "▶️  Uruchamianie części 2..."
../stefano-complete-installer-part2.sh

# Uruchom część 3
echo "▶️  Uruchamianie części 3..."
../stefano-complete-installer-part3.sh

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║              INSTALACJA ZAKOŃCZONA POMYŚLNIE!                        ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Aplikacja Stefano Restaurant została zainstalowana!"
echo ""
echo "📁 Lokalizacja: $(pwd)"
echo ""
echo "🚀 Aby uruchomić aplikację:"
echo "   npm run dev"
echo ""
echo "🌐 Aplikacja będzie dostępna pod adresem:"
echo "   http://localhost:5173"
echo ""
echo "👨‍💼 Panel administratora:"
echo "   http://localhost:5173/admin"
echo "   Hasło: stefano2025admin"
echo ""
echo "📖 Dokumentacja:"
echo "   README.md"
echo ""
echo "💡 Wskazówki:"
echo "   - Skonfiguruj plik .env przed uruchomieniem"
echo "   - Ustaw klucz API DeepSeek dla chatbota"
echo "   - Skonfiguruj bazę danych PostgreSQL (opcjonalnie)"
echo ""
echo "Powodzenia! 🍕"
MASTER_INSTALLER_EOF
    
    chmod +x stefano-complete-installer.sh
    
    log_success "Główny skrypt instalacyjny utworzony"
}

# ===========================================================================
# GŁÓWNA FUNKCJA
# ===========================================================================

main() {
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║        STEFANO RESTAURANT - INSTALATOR (CZĘŚĆ 3)                     ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    
    # Twórz komponenty i strony
    create_home_page
    create_menu_page
    create_navigation
    create_footer
    create_hero
    create_ui_toaster
    create_ui_input
    create_ui_badge
    
    # Utwórz główny skrypt
    create_master_installer
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════╗"
    echo "║              WSZYSTKIE CZĘŚCI INSTALATORA GOTOWE!                    ║"
    echo "╚══════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ Utworzono 3 części instalatora:"
    echo "   - stefano-complete-installer-part1.sh (struktura podstawowa)"
    echo "   - stefano-complete-installer-part2.sh (serwer i konfiguracja)"
    echo "   - stefano-complete-installer-part3.sh (komponenty i strony)"
    echo ""
    echo "✅ Utworzono główny skrypt:"
    echo "   - stefano-complete-installer.sh"
    echo ""
    echo "🚀 Aby zainstalować kompletną aplikację, uruchom:"
    echo "   ./stefano-complete-installer.sh"
    echo ""
    echo "📦 Skrypt utworzy folder 'stefano-restaurant' z całą aplikacją"
    echo ""
}

# Uruchom główną funkcję
main