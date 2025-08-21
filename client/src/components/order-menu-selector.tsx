import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, ShoppingCart } from "lucide-react";

const menuData = {
  burgery: [
    {
      id: "classic-chicken",
      name: "CLASSIC Chicken Burger",
      price: 24,
      description: "Bułka pszenna, 3x stripsy w chrupiącej panierce, sałata, pomidor, cebula, ogórek konserwowy, cebula prażona, sos majonezowy."
    },
    {
      id: "big-king-chicken",
      name: "BIG KING Chicken Burger", 
      price: 29,
      description: "Bułka pszenna, 3x stripsy w chrupiącej panierce, sałata, pomidor, cebula, ogórek konserwowy, 2x ser cheddar, 2x bekon, jalapeño, cebula prażona, sos BBQ, sos majonezowy"
    }
  ],
  tortilla: [
    {
      id: "vege-tortilla",
      name: "VEGE Tortilla",
      price: 24,
      description: "Tortilla pszenna, sałata, pomidor, ogórek konserwowy, ogórek zielony, kukurydza, cebula, papryka, sos majonezowy, sos sweet chilli."
    },
    {
      id: "classic-tortilla",
      name: "CLASSIC Tortilla",
      price: 26,
      description: "Tortilla pszenna, 3x stripsy w chrupiącej panierce, sałata, ogórek zielony, czerwona cebula, pomidor, sos czosnowy."
    },
    {
      id: "power-tortilla",
      name: "POWER Tortilla",
      price: 29,
      description: "Tortilla pszenna, stripsy w chrupiącej panierce x3, grillowany bekon, ser cheddar, sałata, ogórek konserwowy, czerwona cebula, sos majonezowy, pomidor, sos BBQ"
    }
  ],
  pizza: [
    {
      id: "mexicana",
      name: "11. MEXICANA",
      price: 58,
      priceXL: 69,
      description: "Sos pomidorowy, ser mozzarella, wołowina szarpana, jalapeño, kukurydza, cebula."
    },
    {
      id: "country-fiesta",
      name: "12. COUNTRY FIESTA",
      price: 46,
      priceXL: 57,
      description: "Sos pomidorowy, ser mozzarella, boczek, kiełbasa, kukurydza, jajko, cebula, czosnek."
    },
    {
      id: "italiana",
      name: "13. ITALIANA",
      price: 48,
      priceXL: 58,
      description: "Sos pomidorowy, ser mozzarella, szynka dojrzewająca, pomidorki cherry, rukola, mozzarella, parmezan."
    },
    {
      id: "hawaii",
      name: "14. HAWAII",
      price: 46,
      priceXL: 57,
      description: "Sos pomidorowy, ser mozzarella, szynka, ananas."
    },
    {
      id: "capriciosa",
      name: "15. CAPRICIOSA",
      price: 50,
      priceXL: 61,
      description: "Sos pomidorowy, ser mozzarella, szynka, pieczarki, oliwki."
    },
    {
      id: "quattro-stagioni",
      name: "16. QUATTRO STAGIONI",
      price: 54,
      priceXL: 65,
      description: "Sos pomidorowy, ser mozzarella, szynka, pieczarki, papryka, salami."
    },
    {
      id: "diavola",
      name: "17. DIAVOLA",
      price: 50,
      priceXL: 61,
      description: "Sos pomidorowy, ser mozzarella, salami pepperoni, jalapeño, cebula."
    },
    {
      id: "stefano-special",
      name: "18. STEFANO SPECIAL",
      price: 72,
      priceXL: 83,
      description: "Sos pomidorowy, ser mozzarella, szynka dojrzewająca, salami, boczek, wołowina szarpana, pieczarki, papryka, cebula, jalapeño."
    }
  ],
  dodatki: [
    {
      id: "frytki",
      name: "Frytki",
      price: 8,
      description: "Złociste frytki z solą"
    },
    {
      id: "frytki-ser",
      name: "Frytki z serem",
      price: 12,
      description: "Frytki z roztopionem serem cheddar"
    },
    {
      id: "sos-czosnkowy",
      name: "Sos czosnkowy",
      price: 4,
      description: "Domowy sos czosnkowy"
    },
    {
      id: "sos-bbq",
      name: "Sos BBQ",
      price: 4,
      description: "Słodko-pikantny sos BBQ"
    }
  ]
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface OrderMenuSelectorProps {
  onOrderChange: (items: string, totalAmount: number) => void;
}

export default function OrderMenuSelector({ onOrderChange }: OrderMenuSelectorProps) {
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("pizza");

  const addItem = (item: any, size?: string) => {
    const price = size === "XL" ? item.priceXL : item.price;
    const itemId = `${item.id}${size ? `-${size}` : ''}`;
    const itemName = `${item.name}${size ? ` (${size})` : ''}`;
    
    const existingItem = selectedItems.find(i => i.id === itemId);
    
    if (existingItem) {
      setSelectedItems(prev => 
        prev.map(i => 
          i.id === itemId 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setSelectedItems(prev => [...prev, {
        id: itemId,
        name: itemName,
        price: price,
        quantity: 1,
        size
      }]);
    }
    
    updateOrder();
  };

  const removeItem = (itemId: string) => {
    const existingItem = selectedItems.find(i => i.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setSelectedItems(prev => 
        prev.map(i => 
          i.id === itemId 
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      );
    } else {
      setSelectedItems(prev => prev.filter(i => i.id !== itemId));
    }
    
    updateOrder();
  };

  const updateOrder = () => {
    setTimeout(() => {
      const itemsText = selectedItems.map(item => 
        `${item.name} x${item.quantity}`
      ).join(', ');
      
      const totalAmount = selectedItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      onOrderChange(itemsText, totalAmount);
    }, 0);
  };

  const getItemQuantity = (itemId: string) => {
    return selectedItems.find(i => i.id === itemId)?.quantity || 0;
  };

  const totalAmount = selectedItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  return (
    <div className="space-y-4">
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-700">
          <TabsTrigger value="pizza" className="data-[state=active]:bg-stefano-red">
            Pizza
          </TabsTrigger>
          <TabsTrigger value="burgery" className="data-[state=active]:bg-stefano-red">
            Burgery
          </TabsTrigger>
          <TabsTrigger value="tortilla" className="data-[state=active]:bg-stefano-red">
            Tortilla
          </TabsTrigger>
          <TabsTrigger value="dodatki" className="data-[state=active]:bg-stefano-red">
            Dodatki
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[400px] w-full">
          <TabsContent value="pizza" className="space-y-3">
            {menuData.pizza.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-stefano-gold">{item.name}</h3>
                      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-stefano-red font-bold">
                        {item.price}zł / {item.priceXL}zł
                      </div>
                      <div className="text-xs text-gray-400">32cm / 42cm</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(`${item.id}-32cm`)}
                          className="w-6 h-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">
                          {getItemQuantity(`${item.id}-32cm`)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addItem(item, "32cm")}
                          className="w-6 h-6 p-0 border-stefano-red text-stefano-red hover:bg-stefano-red hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-gray-400 ml-1">32cm</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(`${item.id}-XL`)}
                          className="w-6 h-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">
                          {getItemQuantity(`${item.id}-XL`)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addItem(item, "XL")}
                          className="w-6 h-6 p-0 border-stefano-red text-stefano-red hover:bg-stefano-red hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-gray-400 ml-1">42cm</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="burgery" className="space-y-3">
            {menuData.burgery.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-stefano-gold">{item.name}</h3>
                      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-stefano-red font-bold">{item.price}zł</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">
                        {getItemQuantity(item.id)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addItem(item)}
                        className="w-6 h-6 p-0 border-stefano-red text-stefano-red hover:bg-stefano-red hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tortilla" className="space-y-3">
            {menuData.tortilla.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-stefano-gold">{item.name}</h3>
                      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-stefano-red font-bold">{item.price}zł</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">
                        {getItemQuantity(item.id)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addItem(item)}
                        className="w-6 h-6 p-0 border-stefano-red text-stefano-red hover:bg-stefano-red hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="dodatki" className="space-y-3">
            {menuData.dodatki.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-stefano-gold">{item.name}</h3>
                      <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-stefano-red font-bold">{item.price}zł</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">
                        {getItemQuantity(item.id)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addItem(item)}
                        className="w-6 h-6 p-0 border-stefano-red text-stefano-red hover:bg-stefano-red hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>

      {/* Podsumowanie zamówienia */}
      {selectedItems.length > 0 && (
        <Card className="bg-gray-800 border-stefano-gold">
          <CardHeader>
            <CardTitle className="text-stefano-gold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Twoje zamówienie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="text-stefano-red font-bold">
                    {item.price * item.quantity}zł
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>SUMA:</span>
                  <span className="text-stefano-gold text-lg">{totalAmount}zł</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}