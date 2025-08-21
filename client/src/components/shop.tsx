import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, MessageCircle, Plus, Minus } from 'lucide-react';

interface Sauce {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  spiciness: number;
  category: string;
  ingredients: string[];
  volume: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

const sauces: Sauce[] = [
  {
    id: 'stefano-classic',
    name: 'Stefano Classic',
    description: 'Nasz autorski sos z mieszanką ziół śródziemnomorskich i czosnku',
    price: 12,
    image: '/attached_assets/Asset 1@2x-1-80_1750909127916.png',
    spiciness: 2,
    category: 'Klasyczne',
    ingredients: ['pomidory', 'czosnek', 'bazylia', 'oregano', 'oliwa z oliwek'],
    volume: '250ml',
    inStock: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: 'stefano-hot',
    name: 'Stefano Fire',
    description: 'Ostry sos z papryczkami habanero i chili - dla odważnych!',
    price: 15,
    image: '/attached_assets/Asset 1@2x-1-80_1750909127916.png',
    spiciness: 5,
    category: 'Ostre',
    ingredients: ['papryczki habanero', 'chili', 'pomidory', 'czosnek', 'ocet winny'],
    volume: '200ml',
    inStock: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'stefano-bbq',
    name: 'Stefano BBQ',
    description: 'Słodko-kwaśny sos BBQ idealny do mięs z grilla',
    price: 14,
    image: '/attached_assets/Asset 1@2x-1-80_1750909127916.png',
    spiciness: 1,
    category: 'BBQ',
    ingredients: ['koncentrat pomidorowy', 'miód', 'ocet', 'przyprawy', 'dym hickory'],
    volume: '300ml',
    inStock: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: 'stefano-garlic',
    name: 'Stefano Garlic Supreme',
    description: 'Intensywny sos czosnkowy z dodatkiem ziół prowansalskich',
    price: 13,
    image: '/attached_assets/Asset 1@2x-1-80_1750909127916.png',
    spiciness: 1,
    category: 'Ziołowe',
    ingredients: ['czosnek', 'majonez', 'zioła prowansalskie', 'cytryna', 'oliwa'],
    volume: '250ml',
    inStock: true,
    rating: 4.6,
    reviews: 98
  },
  {
    id: 'stefano-ranch',
    name: 'Stefano Ranch Deluxe',
    description: 'Kremowy sos ranch z dodatkiem świeżych ziół',
    price: 11,
    image: '/attached_assets/Asset 1@2x-1-80_1750909127916.png',
    spiciness: 0,
    category: 'Kremowe',
    ingredients: ['majonez', 'kefir', 'koperek', 'szczypiorek', 'czosnek', 'przyprawy'],
    volume: '300ml',
    inStock: false,
    rating: 4.5,
    reviews: 74
  },
  {
    id: 'stefano-honey-mustard',
    name: 'Stefano Honey Mustard',
    description: 'Słodko-pikantny sos z miodem i musztardą',
    price: 12,
    image: '/attached_assets/Asset 1@2x-1-80_1750909127916.png',
    spiciness: 2,
    category: 'Słodkie',
    ingredients: ['musztarda dijon', 'miód', 'majonez', 'ocet', 'przyprawy'],
    volume: '250ml',
    inStock: true,
    rating: 4.7,
    reviews: 112
  }
];

export default function Shop() {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');

  const categories = ['Wszystkie', ...Array.from(new Set(sauces.map(sauce => sauce.category)))];

  const filteredSauces = selectedCategory === 'Wszystkie' 
    ? sauces 
    : sauces.filter(sauce => sauce.category === selectedCategory);

  const addToCart = (sauceId: string) => {
    setCart(prev => ({
      ...prev,
      [sauceId]: (prev[sauceId] || 0) + 1
    }));
  };

  const removeFromCart = (sauceId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[sauceId] && newCart[sauceId] > 0) {
        newCart[sauceId] -= 1;
        if (newCart[sauceId] === 0) {
          delete newCart[sauceId];
        }
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [sauceId, count]) => {
      const sauce = sauces.find(s => s.id === sauceId);
      return sum + (sauce ? sauce.price * count : 0);
    }, 0);
  };

  const getSpicyIndicator = (level: number) => {
    return '🌶️'.repeat(level) + '⚪'.repeat(5 - level);
  };

  const handleWhatsAppOrder = () => {
    const orderItems = Object.entries(cart).map(([sauceId, count]) => {
      const sauce = sauces.find(s => s.id === sauceId);
      return `${sauce?.name} x${count} - ${sauce ? sauce.price * count : 0}zł`;
    }).join('\n');

    const message = `🛒 ZAMÓWIENIE SOSY STEFANO:\n\n${orderItems}\n\n💰 RAZEM: ${getTotalPrice()}zł\n\n📍 Odbiór: Restaurant Stefano, Bełchatów\n⏰ Preferowany czas odbioru: [PODAJ CZAS]`;
    
    const whatsappUrl = `https://wa.me/48517616618?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="sklep" className="py-16 bg-stefano-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-montserrat font-bold mb-6">
            NASZ <span className="stefano-gold">SKLEP</span>
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nasze produkty - możesz dodawać kategorie i produkty przez panel administracyjny!
          </p>
          
          {/* Shopping Cart Summary */}
          {getTotalItems() > 0 && (
            <div className="bg-stefano-gold/20 border border-stefano-gold/40 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 stefano-gold" />
                  <span className="font-bold stefano-gold">Koszyk: {getTotalItems()} szt.</span>
                </div>
                <span className="text-2xl font-bold stefano-gold">{getTotalPrice()}zł</span>
              </div>
              <Button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-stefano-red hover:bg-red-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Zamów przez WhatsApp
              </Button>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category
                  ? 'bg-stefano-red text-white'
                  : 'border-stefano-gold/40 text-stefano-gold hover:bg-stefano-gold/20'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredSauces.map((sauce) => (
            <Card key={sauce.id} className="bg-stefano-gray border-stefano-gold/20 hover:border-stefano-gold/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="stefano-gold text-xl mb-2">{sauce.name}</CardTitle>
                    <CardDescription className="text-white/90 mb-3">
                      {sauce.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{sauce.rating}</span>
                        <span className="text-xs opacity-70">({sauce.reviews})</span>
                      </div>
                      <Badge variant="outline" className="border-stefano-gold/40 text-stefano-gold">
                        {sauce.category}
                      </Badge>
                    </div>
                  </div>
                  <img 
                    src={sauce.image} 
                    alt={sauce.name}
                    className="w-16 h-16 object-contain ml-4"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Pojemność:</span>
                    <span className="font-medium">{sauce.volume}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-90">Ostrość:</span>
                    <span className="font-medium">{getSpicyIndicator(sauce.spiciness)}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm opacity-90 block mb-1">Składniki:</span>
                    <div className="flex flex-wrap gap-1">
                      {sauce.ingredients.slice(0, 3).map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-stefano-gold/20 text-stefano-gold/90">
                          {ingredient}
                        </Badge>
                      ))}
                      {sauce.ingredients.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-stefano-gold/20 text-stefano-gold/90">
                          +{sauce.ingredients.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 border-t border-stefano-gold/20">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold stefano-gold">{sauce.price}zł</span>
                    {!sauce.inStock && (
                      <Badge variant="destructive" className="bg-red-600">
                        Brak w magazynie
                      </Badge>
                    )}
                  </div>
                  
                  {sauce.inStock && (
                    <div className="flex items-center gap-2">
                      {cart[sauce.id] ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(sauce.id)}
                            className="border-stefano-gold/40 text-stefano-gold hover:bg-stefano-gold/20"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold text-lg mx-3">{cart[sauce.id]}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(sauce.id)}
                            className="border-stefano-gold/40 text-stefano-gold hover:bg-stefano-gold/20"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => addToCart(sauce.id)}
                          className="w-full bg-stefano-red hover:bg-red-600 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Dodaj do koszyka
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-stefano-gray p-8 rounded-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-montserrat font-bold stefano-gold mb-4">
              Informacje o zamówieniach
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-bold mb-2 stefano-gold">📦 Odbiór</h4>
                <p className="text-sm opacity-90 mb-4">
                  Wszystkie sosy można odebrać w restauracji Stefano w Bełchatowie. 
                  Zamówienie będzie gotowe w ciągu 30 minut od złożenia.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2 stefano-gold">💰 Płatność</h4>
                <p className="text-sm opacity-90 mb-4">
                  Płatność przy odbiorze - gotówka lub karta. 
                  Możliwość płatności BLIK-iem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}