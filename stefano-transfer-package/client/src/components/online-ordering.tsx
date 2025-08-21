import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface Avatar {
  value: string;
  title: string;
  description: string;
  image: string;
  levels: string[];
}

export default function OnlineOrdering() {
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({
    'cyber-medrzec': 0,
    'cyber-rycerz': 0,
    'cyber-czarownik': 0,
    'cyber-wojowniczka': 0
  });

  // AI Avatar Rotation System for Youth Appeal
  const [currentAvatarSet, setCurrentAvatarSet] = useState(0);
  const [lastRotation, setLastRotation] = useState(Date.now());

  // AI-Powered Avatar Sets for Different Demographics
  const avatarSets = [
    // Set 1: Classic Gaming (Appeals to gamers)
    [
      {
        value: 'cyber-medrzec',
        title: 'Cyber Mędrzec',
        description: 'Mądry wybór dla prawdziwych smakoszy',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🤖', '🧠', '⚡', '💎', '🌟']
      },
      {
        value: 'cyber-rycerz',
        title: 'Cyber Rycerz',
        description: 'Honor i siła w każdym kęsie',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['⚔️', '🛡️', '👑', '🏆', '💫']
      },
      {
        value: 'cyber-czarownik',
        title: 'Cyber Czarownik',
        description: 'Magiczne połączenia smaków',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🔮', '✨', '🌙', '⭐', '🌌']
      },
      {
        value: 'cyber-wojowniczka',
        title: 'Cyber Wojowniczka',
        description: 'Odważne smaki dla odważnych',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🛡️', '💪', '⚡', '🔥', '👑']
      }
    ],
    // Set 2: Gen Z Vibes (Appeals to TikTok generation)
    [
      {
        value: 'vibe-creator',
        title: 'Vibe Creator',
        description: 'Main character energy 💯',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['📱', '💅', '✨', '👑', '🌈']
      },
      {
        value: 'sigma-eater',
        title: 'Sigma Eater',
        description: 'Solo dining mindset 🔥',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🗿', '💀', '🔥', '💎', '👑']
      },
      {
        value: 'aesthetic-queen',
        title: 'Aesthetic Queen',
        description: 'That girl era activated ✨',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🌸', '🦋', '✨', '💖', '👸']
      },
      {
        value: 'food-influencer',
        title: 'Food Influencer',
        description: 'Content creator mode ON 📸',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['📸', '🌟', '💫', '🎬', '🏆']
      }
    ],
    // Set 3: Anime/Manga Style (Appeals to otaku culture)
    [
      {
        value: 'anime-sensei',
        title: 'Anime Sensei',
        description: 'Wisdom of a thousand flavors',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🥢', '🍜', '🌸', '⛩️', '🐉']
      },
      {
        value: 'kawaii-warrior',
        title: 'Kawaii Warrior',
        description: 'Cute but deadly appetite',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🌸', '⚔️', '💖', '🎌', '👘']
      },
      {
        value: 'otaku-chef',
        title: 'Otaku Chef',
        description: 'Cooking like in your favorite anime',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🍱', '🥟', '🍙', '🎯', '👨‍🍳']
      },
      {
        value: 'manga-hero',
        title: 'Manga Hero',
        description: 'Power up with every bite',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['💥', '⚡', '🔥', '💪', '🦸']
      }
    ],
    // Set 4: Street Culture (Appeals to urban youth)
    [
      {
        value: 'street-legend',
        title: 'Street Legend',
        description: 'Respect earned, flavor delivered',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['👟', '🎵', '🔥', '💎', '🏆']
      },
      {
        value: 'urban-king',
        title: 'Urban King',
        description: 'City vibes, royal taste',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['👑', '🏙️', '💸', '⚡', '🌃']
      },
      {
        value: 'graffiti-artist',
        title: 'Graffiti Artist',
        description: 'Painting flavors on your taste buds',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🎨', '🖌️', '🌈', '💫', '🎭']
      },
      {
        value: 'skateboard-pro',
        title: 'Skateboard Pro',
        description: 'Tricks and treats master',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
        levels: ['🛹', '🤸', '⚡', '🔥', '🏅']
      }
    ]
  ];

  const avatars: Avatar[] = avatarSets[currentAvatarSet] || avatarSets[0];

  // AI Avatar Rotation Logic - Changes every 30 seconds for youth appeal
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastRotation > 30000) { // 30 seconds
        setCurrentAvatarSet(prev => (prev + 1) % avatarSets.length);
        setLastRotation(now);
        console.log(`🤖 AI Avatar Rotation: Switched to ${['Gaming', 'Gen Z', 'Anime', 'Street'][currentAvatarSet]} theme for youth appeal`);
      }
    }, 30000);

    return () => clearInterval(rotationInterval);
  }, [lastRotation, currentAvatarSet]);

  const orderSteps = [
    "Wybierz swojego awatara",
    "Kliknij 'Zamów przez WhatsApp'",
    "Zostaniesz przekierowany do WhatsApp",
    "Napisz jakie danie chcesz zamówić",
    "Podaj godzinę odbioru",
    "Odbierz zamówienie w restauracji"
  ];

  const getAvatarLevel = (count: number): number => {
    if (count >= 20) return 4;
    if (count >= 15) return 3;
    if (count >= 10) return 2;
    if (count >= 5) return 1;
    return 0;
  };

  const handleAvatarSelect = (avatarType: string) => {
    // Zwiększ licznik zamówień dla awatara
    setOrderCounts(prev => ({
      ...prev,
      [avatarType]: prev[avatarType] + 1
    }));

    // Znajdź wybranego awatara
    const selectedAvatar = avatars.find(a => a.value === avatarType);
    const level = getAvatarLevel(orderCounts[avatarType] + 1);
    
    // Przygotuj wiadomość WhatsApp
    const message = encodeURIComponent(
      `🍕 Zamówienie Stefano Restaurant\n\n` +
      `👤 Awatar: ${selectedAvatar?.title} ${selectedAvatar?.levels[level]}\n` +
      `📍 Poziom: ${level + 1}/5\n` +
      `📝 Liczba zamówień: ${orderCounts[avatarType] + 1}\n\n` +
      `Chciałbym zamówić:\n` +
      `(Napisz tutaj swoje zamówienie)\n\n` +
      `🕐 Godzina odbioru: (Podaj godzinę)\n` +
      `📞 Telefon: (Podaj numer)`
    );

    const phoneNumber = '48517616618'; // Numer restauracji Stefano
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="zamow" className="py-16 bg-stefano-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-montserrat font-bold mb-8">
          Zamów <span className="stefano-gold">Online</span>
        </h2>
        <p className="text-xl mb-8 opacity-90">Wybierz swojego AWATARA i zamów z wygodnym odbiorem</p>
        
        {/* Level Info */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-bold mb-6">System poziomów Avatarów</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-500/20 border border-gray-500 rounded-lg p-3">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-semibold text-gray-300">Poziom 1</div>
              <div className="text-xs opacity-70">Start</div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
              <div className="text-2xl mb-2">🧠</div>
              <div className="text-sm font-semibold text-blue-400">Poziom 2</div>
              <div className="text-xs opacity-70">5+ zamówień</div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-3">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-semibold text-purple-400">Poziom 3</div>
              <div className="text-xs opacity-70">10+ zamówień</div>
            </div>
            <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-sm font-semibold text-orange-400">Poziom 4</div>
              <div className="text-xs opacity-70">15+ zamówień</div>
            </div>
            <div className="bg-stefano-gold/20 border border-stefano-gold rounded-lg p-3">
              <div className="text-2xl mb-2">🌟</div>
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