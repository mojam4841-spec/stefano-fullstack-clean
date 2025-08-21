import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Gift } from "lucide-react";

const getDayOfWeek = () => {
  const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  return days[new Date().getDay()];
};

const dailyPromotions = {
  'Poniedziałek': {
    title: "Cyber Monday Pizza",
    description: "2x Pizza średnia za 89 zł zamiast 116 zł",
    discount: "27 zł taniej!",
    emoji: "🍕",
    color: "from-blue-600 to-purple-600"
  },
  'Wtorek': {
    title: "Tortilla Tuesday",
    description: "Wszystkie tortille -20% + darmowe frytki",
    discount: "Do 6 zł taniej!",
    emoji: "🌯",
    color: "from-green-600 to-teal-600"
  },
  'Środa': {
    title: "Wing Wednesday",
    description: "Kubełek kurczaka + 2x sos za 35 zł",
    discount: "10 zł taniej!",
    emoji: "🍗",
    color: "from-orange-600 to-red-600"
  },
  'Czwartek': {
    title: "Burger Thursday",
    description: "BIG KING Burger + Frytki + Napój za 35 zł",
    discount: "8 zł taniej!",
    emoji: "🍔",
    color: "from-red-600 to-pink-600"
  },
  'Piątek': {
    title: "Pizza Friday",
    description: "ZAMÓW DUŻĄ PIZZĘ - DRUGA ZA PÓŁ CENY",
    discount: "Do 36 zł taniej!",
    emoji: "🎉",
    color: "from-purple-600 to-indigo-600"
  },
  'Sobota': {
    title: "Weekend Warriors",
    description: "Mega Zestaw: Pizza + Kurczak + 2x Napój za 99 zł",
    discount: "25 zł taniej!",
    emoji: "⚡",
    color: "from-yellow-600 to-orange-600"
  },
  'Niedziela': {
    title: "Family Sunday",
    description: "Zestaw Rodzinny: 2x Burger + 2x Frytki + 4x Napój za 89 zł",
    discount: "20 zł taniej!",
    emoji: "👨‍👩‍👧‍👦",
    color: "from-indigo-600 to-blue-600"
  }
};

export default function DailyPromotions() {
  const [currentDay, setCurrentDay] = useState(getDayOfWeek());
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
      setCurrentDay(getDayOfWeek());
    }, 60000);

    // Initial call
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    setTimeLeft(`${hours}h ${minutes}m`);

    return () => clearInterval(timer);
  }, []);

  const todayPromo = dailyPromotions[currentDay as keyof typeof dailyPromotions];

  return (
    <section id="promocje" className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-montserrat font-bold mb-4">
            Promocje <span className="stefano-gold">Dnia</span>
          </h2>
          <p className="text-xl opacity-90">Codziennie nowe okazje tylko dla Ciebie!</p>
        </div>

        {/* Today's Promotion */}
        <div className={`bg-gradient-to-r ${todayPromo.color} rounded-2xl p-8 mb-8 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <Calendar className="h-6 w-6 text-white" />
              <span className="text-2xl font-bold text-white">{currentDay}</span>
              <span className="text-4xl">{todayPromo.emoji}</span>
            </div>
            
            <h3 className="text-4xl font-bold text-white mb-4">{todayPromo.title}</h3>
            <p className="text-xl text-white mb-4">{todayPromo.description}</p>
            <div className="bg-stefano-gold text-black px-6 py-2 rounded-full inline-block font-bold text-lg mb-6">
              {todayPromo.discount}
            </div>
            
            <div className="flex justify-center items-center space-x-4 mb-6">
              <Clock className="h-5 w-5 text-white" />
              <span className="text-white">Kończy się za: {timeLeft}</span>
            </div>
            
            <Button 
              className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 text-lg"
              onClick={() => {
                // Scroll to contact section
                const contactSection = document.getElementById('kontakt');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                  
                  // Auto-fill contact form with promotion order
                  setTimeout(() => {
                    const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
                    if (messageTextarea) {
                      messageTextarea.value = `Dzień dobry! Chciałbym zamówić promocję dnia:\n\n📅 ${currentDay}\n🎯 ${todayPromo.title}\n💰 ${todayPromo.discount}\n📝 ${todayPromo.description}\n\nProszę o kontakt w sprawie realizacji zamówienia.`;
                      
                      // Trigger React onChange event
                      const event = new Event('input', { bubbles: true });
                      messageTextarea.dispatchEvent(event);
                      
                      messageTextarea.focus();
                    }
                  }, 1000);
                }
              }}
            >
              <Gift className="mr-2 h-5 w-5" />
              Zamawiam Zestaw Dnia
            </Button>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {Object.entries(dailyPromotions).map(([day, promo]) => (
            <div 
              key={day}
              className={`bg-stefano-gray rounded-xl p-4 text-center transition-all duration-300 hover:transform hover:scale-105 ${
                day === currentDay ? 'ring-2 ring-stefano-gold' : ''
              }`}
            >
              <div className="text-2xl mb-2">{promo.emoji}</div>
              <h4 className="font-bold stefano-gold mb-2">{day}</h4>
              <h5 className="text-sm font-semibold mb-2">{promo.title}</h5>
              <p className="text-xs opacity-80 mb-2">{promo.description}</p>
              <span className="text-xs bg-stefano-red px-2 py-1 rounded text-white">
                {promo.discount}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm opacity-70">
            📱 Zainstaluj naszą aplikację na telefonie - kliknij "Dodaj do ekranu głównego" w przeglądarce
          </p>
        </div>
      </div>
    </section>
  );
}