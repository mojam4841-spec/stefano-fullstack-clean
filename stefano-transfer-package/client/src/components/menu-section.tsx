import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuData = {
  burgery: [
    {
      name: "CLASSIC Chicken Burger",
      price: "24 zł",
      description: "Bułka pszenna, 3x stripsy w chrupiącej panierce, sałata, pomidor, cebula, ogórek konserwowy, cebula prażona, sos majonezowy."
    },
    {
      name: "BIG KING Chicken Burger",
      price: "29 zł",
      description: "Bułka pszenna, 3x stripsy w chrupiącej panierce, sałata, pomidor, cebula, ogórek konserwowy, 2x ser cheddar, 2x bekon, jalapeño, cebula prażona, sos BBQ, sos majonezowy"
    }
  ],
  tortilla: [
    {
      name: "VEGE Tortilla",
      price: "24 zł",
      description: "Tortilla pszenna, sałata, pomidor, ogórek konserwowy, ogórek zielony, kukurydza, cebula, papryka, sos majonezowy, sos sweet chilli."
    },
    {
      name: "CLASSIC Tortilla",
      price: "26 zł",
      description: "Tortilla pszenna, 3x stripsy w chrupiącej panierce, sałata, ogórek zielony, czerwona cebula, pomidor, sos czosnowy."
    },
    {
      name: "POWER Tortilla",
      price: "29 zł",
      description: "Tortilla pszenna, stripsy w chrupiącej panierce x3, grillowany bekon, ser cheddar, sałata, ogórek konserwowy, czerwona cebula, sos majonezowy, pomidor, sos BBQ"
    }
  ],
  pizza: [
    {
      name: "MEXICANA",
      price: "58zł / 69zł",
      description: "Sos pomidorowy, ser mozzarella, wołowina szarpana, jalapeño, kukurydza, cebula."
    },
    {
      name: "COUNTRY FIESTA",
      price: "46zł / 57zł",
      description: "Sos pomidorowy, ser mozzarella, boczek, kiełbasa, kukurydza, jajko, cebula, czosnek."
    },
    {
      name: "ITALIANA",
      price: "48zł / 58zł",
      description: "Sos pomidorowy, ser mozzarella, szynka dojrzewająca, pomidorki cherry, rukola, mozzarella, parmezan."
    },
    {
      name: "GUSTO",
      price: "59zł / 72zł",
      description: "Sos pomidorowy, ser mozzarella, wołowina, baranina, mix papryka, cebula, oliwki."
    },
    {
      name: "MELBOURNE",
      price: "59zł / 72zł",
      description: "Sos pomidorowy, ser mozzarella, wołowina, baranina, ser cheddar, jalapeño, cebula, pomidor, oliwki, mix pietruszki."
    },
    {
      name: "FANTASIA DEL MARE",
      price: "59zł / 72zł",
      description: "Sos pomidorowy, ser mozzarella, krewetki kraba, małże, sarczynki, mix papryki, cebula, sos sojowy, sok z limonki."
    },
    {
      name: "DELICJA MARINA",
      price: "46zł / 57zł",
      description: "Sos pomidorowy, ser mozzarella, pomidor, anchovies, mix papryka, bazylia, mięta, natka pietruszki, sok z limonki."
    },
    {
      name: "CHLEBEK Z PARMEZANEM/ CZOSNKOWY",
      price: "25ł / 30zł",
      description: ""
    }
  ],
  dodatki: [
    { name: "Frytki", price: "8 zł" },
    { name: "Krążki Cebulowe", price: "10 zł" },
    { name: "Ser w brzegach", price: "12 zł" },
    { name: "Sosy/oliwa z oliwek", price: "6 zł" },
    { name: "Sery", price: "10 zł" },
    { name: "Mięsa, wędliny", price: "10 zł" },
    { name: "Ryby, owoce morza", price: "12 zł" },
    { name: "Warzywa, owoce", price: "8 zł" },
    { name: "Cebula, czosnek", price: "4 zł" },
    { name: "Pudełko na wynos", price: "2 zł" }
  ]
};

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('burgery');
  const [showDailySet, setShowDailySet] = useState(false);

  const categories = [
    { key: 'burgery', name: 'BURGERY', emoji: '🍔' },
    { key: 'tortilla', name: 'TORTILLA', emoji: '🌯' },
    { key: 'pizza', name: 'PIZZA', emoji: '🍕' },
    { key: 'dodatki', name: 'DODATKI', emoji: '🍟' }
  ];

  const dailySet = {
    name: "PROMOCJA PIZZA",
    items: ["Duża Pizza", "Druga Pizza za pół ceny"],
    regularPrice: "144 zł",
    discountPrice: "108 zł",
    description: "Zamów dużą pizzę - drugą otrzymasz za pół ceny! Oszczędź 36 zł!",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  };

  return (
    <section id="menu" className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-montserrat font-bold text-center mb-8">
          Nasze <span className="stefano-gold">Menu</span>
        </h2>

        {/* Promocja Pizza Banner */}
        <div className="bg-gradient-to-r from-stefano-red to-red-700 rounded-xl p-6 mb-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-2">🍕 ZAMÓW DUŻĄ PIZZĘ 🍕</h3>
            <h4 className="text-2xl font-bold text-stefano-gold mb-4">DRUGA ZA PÓŁ CENY!</h4>
            <p className="text-xl text-white mb-4">Każda duża pizza + druga za 50% ceny</p>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <span className="text-white/80 line-through text-lg">{dailySet.regularPrice}</span>
              <span className="text-3xl font-bold text-stefano-gold">{dailySet.discountPrice}</span>
            </div>
            <p className="text-white/90 mb-4">{dailySet.description}</p>
            <Button 
              onClick={() => setShowDailySet(true)}
              className="bg-stefano-gold text-black hover:bg-yellow-400 font-bold"
            >
              Zobacz Promocję Pizza
            </Button>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.key}
              data-testid={`category-${category.key}`}
              onClick={() => setActiveCategory(category.key)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeCategory === category.key
                  ? 'bg-stefano-gold text-black'
                  : 'bg-stefano-gray text-white hover:bg-stefano-gold hover:text-black'
              }`}
            >
              {category.emoji} {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuData[activeCategory as keyof typeof menuData].map((item: any, index: number) => (
            <div key={index} className="bg-stefano-gray rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold stefano-gold">{item.name}</h3>
                <span className="text-lg font-bold text-white bg-stefano-red px-3 py-1 rounded-full">
                  {item.price}
                </span>
              </div>
              {item.description && (
                <p className="text-sm opacity-80 mb-4">{item.description}</p>
              )}
              <Button className="w-full bg-stefano-red hover:bg-red-600 transition-colors">
                Dodaj do zamówienia
              </Button>
            </div>
          ))}
        </div>

        {/* Daily Set Modal */}
        {showDailySet && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-stefano-gray rounded-xl max-w-md w-full p-6 relative">
              <button 
                onClick={() => setShowDailySet(false)}
                className="absolute top-4 right-4 text-white hover:text-stefano-gold text-2xl"
              >
                ×
              </button>
              
              <img 
                src={dailySet.image}
                alt="Zestaw Dnia Menu"
                className="w-full rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
                }}
              />
              
              <h3 className="text-2xl font-bold stefano-gold mb-4 text-center">ZAMÓW DUŻĄ PIZZĘ</h3>
              <h4 className="text-xl font-bold text-center mb-4">DRUGA ZA PÓŁ CENY!</h4>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-stefano-gold">🍕</span>
                  <span>Wybierz swoją ulubioną dużą pizzę</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-stefano-gold">➕</span>
                  <span>Druga pizza za 50% ceny!</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-stefano-gold">💰</span>
                  <span>Oszczędzasz nawet do 36 zł</span>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <span className="text-white/80 line-through text-lg mr-2">{dailySet.regularPrice}</span>
                <span className="text-2xl font-bold stefano-gold">{dailySet.discountPrice}</span>
              </div>
              
              <p className="text-center text-sm opacity-80 mb-4">{dailySet.description}</p>
              
              <Button className="w-full bg-stefano-red hover:bg-red-600 transition-colors">
                Zamawiam Zestaw Dnia!
              </Button>
            </div>
          </div>
        )}

        {/* Menu Images Display */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold stefano-gold mb-6">Pełne Menu - Karta Dań</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-stefano-gray rounded-xl p-4">
              <img 
                src="/attached_assets/1 (1)_1750908450642.png" 
                alt="Menu Stefano - Burgery i Tortille" 
                className="w-full rounded-lg mb-2"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800";
                }}
              />
              <p className="text-sm opacity-80">Burgery & Tortille</p>
            </div>
            <div className="bg-stefano-gray rounded-xl p-4">
              <img 
                src="/attached_assets/4_1750908450644.png" 
                alt="Menu Stefano - Pizza i Dodatki" 
                className="w-full rounded-lg mb-2"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800";
                }}
              />
              <p className="text-sm opacity-80">Pizza & Dodatki</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
