import { Button } from "@/components/ui/button";
import { MessageCircle, Smartphone } from "lucide-react";
import { useState } from "react";

const avatars = [
  {
    emoji: "🧙‍♂️",
    title: "Cyber Mędrzec",
    description: "Dla miłośników pizzy - mistrzowie technologii i smaków",
    value: "cyber_medrzec",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    levels: ["🤖", "🧠", "⚡", "🔮", "👑"],
    whatsapp: "+48517616618"
  },
  {
    emoji: "⚔️",
    title: "Cyber Rycerz",
    description: "Dla fanów kurczaka - honorowi obrońcy chrupiących smaków",
    value: "cyber_rycerz",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    levels: ["🤖", "🛡️", "⚔️", "🔥", "👑"],
    whatsapp: "+48517616618"
  },
  {
    emoji: "🔮",
    title: "Cyber Czarownik",
    description: "Dla wielbicieli burgerów - magowie soczystych kreacji",
    value: "cyber_czarownik",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    levels: ["🤖", "✨", "🔮", "🌟", "👑"],
    whatsapp: "+48517616618"
  },
  {
    emoji: "⚡",
    title: "Cyber Wojowniczka",
    description: "Dla miłośników tortilli - dzielne amazonki świeżych smaków",
    value: "cyber_wojowniczka",
    image: "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    levels: ["🤖", "💪", "⚡", "🚀", "👑"],
    whatsapp: "+48517616618"
  }
];

const orderSteps = [
  "Wybierz AWATAR - im więcej zamawiasz, tym weselszy staje się twój awatar",
  "Kliknij 'Zamów przez WhatsApp' - automatycznie otworzy się WhatsApp z wiadomością",
  "Potwierdź zamówienie i odbierz w restauracji - sprawdź nasze FB: Przestrzeń Bełchatów"
];

export default function OnlineOrdering() {
  const [orderCounts, setOrderCounts] = useState<{[key: string]: number}>({
    pizza_master: 0,
    chicken_king: 0,
    burger_boss: 0,
    tortilla_expert: 0
  });

  const getAvatarLevel = (count: number) => {
    if (count >= 20) return 4; // 🤩
    if (count >= 15) return 3; // 😄
    if (count >= 10) return 2; // 😊
    if (count >= 5) return 1;  // 🙂
    return 0; // 😐
  };

  const handleAvatarSelect = (avatarValue: string) => {
    const avatar = avatars.find(a => a.value === avatarValue);
    if (!avatar) return;

    const currentCount = orderCounts[avatarValue];
    const newCount = currentCount + 1;
    
    setOrderCounts(prev => ({
      ...prev,
      [avatarValue]: newCount
    }));

    const level = getAvatarLevel(newCount);
    const currentMood = avatar.levels[level];
    
    // Open WhatsApp with pre-filled message
    const message = `Cześć! Wybieram AWATAR ${avatar.title} ${currentMood} (poziom ${level + 1}). Chcę złożyć zamówienie na odbiór. Mój aktualny poziom: ${newCount} zamówień!`;
    const whatsappUrl = `https://wa.me/${avatar.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="zamow" className="py-16 bg-stefano-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-montserrat font-bold mb-8">
          Zamów <span className="stefano-gold">Online</span>
        </h2>
        <p className="text-xl mb-8 opacity-90">Wybierz swojego AWATARA i zamów z wygodnym odbiorem</p>
        
        {/* Avatar Progress Info */}
        <div className="bg-stefano-gold/10 border border-stefano-gold/30 rounded-xl p-6 mb-12 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold stefano-gold mb-4 text-center">System Progresywnych Awatarów</h3>
          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-2xl mb-2">😐</div>
              <div className="text-sm font-semibold">Poziom 1</div>
              <div className="text-xs opacity-70">0-4 zamówienia</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-2xl mb-2">🙂</div>
              <div className="text-sm font-semibold">Poziom 2</div>
              <div className="text-xs opacity-70">5-9 zamówień</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-2xl mb-2">😊</div>
              <div className="text-sm font-semibold">Poziom 3</div>
              <div className="text-xs opacity-70">10-14 zamówień</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-2xl mb-2">😄</div>
              <div className="text-sm font-semibold">Poziom 4</div>
              <div className="text-xs opacity-70">15-19 zamówień</div>
            </div>
            <div className="bg-stefano-gold/20 border border-stefano-gold rounded-lg p-3">
              <div className="text-2xl mb-2">🤩</div>
              <div className="text-sm font-semibold stefano-gold">Poziom MAX</div>
              <div className="text-xs opacity-70">20+ zamówień</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {avatars.map((avatar, index) => (
              <div key={index} className="bg-stefano-gray rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                <img 
                  src={avatar.image} 
                  alt={avatar.title} 
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  {/* Simple Avatar Icons */}
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 via-teal-500 to-golden-400 p-0.5 relative">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                        <div className="text-2xl">
                          {avatar.value === 'cyber-medrzec' && '🧙‍♂️'}
                          {avatar.value === 'cyber-rycerz' && '⚔️'}
                          {avatar.value === 'cyber-czarownik' && '🔮'}
                          {avatar.value === 'cyber-wojowniczka' && '🛡️'}
                        </div>
                      </div>
                    </div>

                  <div className="text-2xl mb-2 text-center">
                    {avatar.levels[getAvatarLevel(orderCounts[avatar.value])]}
                  </div>
                  <h3 className="text-xl font-montserrat font-bold stefano-gold mb-3 text-center">{avatar.title}</h3>
                  <p className="mb-2 text-sm opacity-90 text-center">{avatar.description}</p>
                  <div className="mb-4 text-xs opacity-70 text-center">
                    Zamówienia: {orderCounts[avatar.value]} • Poziom: {getAvatarLevel(orderCounts[avatar.value]) + 1}/5
                  </div>
                  <Button 
                    onClick={() => handleAvatarSelect(avatar.value)}
                    className="w-full bg-stefano-red hover:bg-red-600 transition-colors mb-2"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Zamów przez WhatsApp
                  </Button>
                  <Button 
                    onClick={() => window.open('https://www.facebook.com/Przestrzen.Belchatow', '_blank')}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-xs"
                    variant="secondary"
                  >
                    Zobacz na Facebook
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-stefano-gray p-8 rounded-xl">
            <h3 className="text-2xl font-montserrat font-bold mb-4">Instrukcja odbioru:</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {orderSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-stefano-gold text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
