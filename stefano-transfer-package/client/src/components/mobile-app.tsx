import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Download, Star, Bell, MapPin, Clock } from "lucide-react";
import stefanoLogoPath from "@assets/Asset 1@2x-1 (1)_1750907764954.png";

export default function MobileApp() {
  const features = [
    {
      icon: <Bell size={24} />,
      title: "Powiadomienia",
      description: "Otrzymuj powiadomienia o promocjach i nowościach"
    },
    {
      icon: <MapPin size={24} />,
      title: "Nawigacja",
      description: "Znajdź nas łatwo dzięki wbudowanej nawigacji"
    },
    {
      icon: <Clock size={24} />,
      title: "Rezerwacje",
      description: "Rezerwuj stolik w kilka sekund"
    },
    {
      icon: <Star size={24} />,
      title: "Program lojalnościowy",
      description: "Zbieraj punkty i odbieraj nagrody"
    }
  ];

  return (
    <section className="py-24 stefano-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-stefano-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-stefano-red rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-montserrat font-bold mb-6">
            Pobierz <span className="stefano-gold">Aplikację</span> Stefano
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Zamawiaj jedzenie, rezerwuj stolik i śledź promocje - wszystko w jednej aplikacji!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* App mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl">
              <div className="bg-gradient-to-br from-stefano-red to-red-800 rounded-2xl p-6 text-center">
                <img 
                  src={stefanoLogoPath} 
                  alt="Stefano App Logo" 
                  className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl p-3"
                />
                <h3 className="text-2xl font-bold text-white mb-2">Stefano App</h3>
                <p className="text-white/80 text-sm mb-4">Twoja restauracja w kieszeni</p>
                
                {/* Mock app interface */}
                <div className="bg-white rounded-xl p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-stefano-gold rounded-lg flex items-center justify-center">
                      <Smartphone size={20} className="text-black" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-black">Zamów online</div>
                      <div className="text-sm text-gray-600">Dostawa lub odbiór</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-stefano-red rounded-lg flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-black">Rezerwuj stolik</div>
                      <div className="text-sm text-gray-600">Szybko i wygodnie</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features and download */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-black/50 border-stefano-gold/30 p-6 hover:bg-black/70 transition-colors">
                  <div className="stefano-gold mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-80">{feature.description}</p>
                </Card>
              ))}
            </div>

            {/* Download buttons */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Pobierz teraz:</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white flex items-center space-x-3 px-6 py-3"
                  onClick={() => {
                    // Simulate app store redirect
                    alert('Przekierowywanie do App Store...');
                    // window.open('https://apps.apple.com/app/stefano', '_blank');
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Download size={20} />
                    <div className="text-left">
                      <div className="text-xs">Pobierz z</div>
                      <div className="font-bold">App Store</div>
                    </div>
                  </div>
                </Button>

                <Button 
                  size="lg" 
                  className="bg-stefano-red hover:bg-red-600 text-white flex items-center space-x-3 px-6 py-3"
                  onClick={() => {
                    // Simulate google play redirect
                    alert('Przekierowywanie do Google Play...');
                    // window.open('https://play.google.com/store/apps/details?id=com.stefano.app', '_blank');
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <Download size={20} />
                    <div className="text-left">
                      <div className="text-xs">Pobierz z</div>
                      <div className="font-bold">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-stefano-gold text-stefano-gold" />
                  ))}
                </div>
                <span className="text-sm opacity-80">
                  4.8/5 (2,847 ocen)
                </span>
              </div>

              <p className="text-sm opacity-70">
                Darmowa aplikacja • Dostępna na iOS i Android • Aktualizowana regularnie
              </p>
            </div>
          </div>
        </div>

        {/* QR Code section */}
        <div className="text-center mt-16 p-8 bg-black/30 rounded-2xl border border-stefano-gold/20">
          <h3 className="text-2xl font-bold mb-4">Szybkie pobieranie</h3>
          <p className="mb-6 opacity-80">Zeskanuj kod QR telefonem, aby pobrać aplikację</p>
          
          {/* QR Code placeholder */}
          <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center mb-4">
            <div className="text-6xl">📱</div>
          </div>
          
          <p className="text-sm opacity-60">
            Kod QR przekieruje do odpowiedniego sklepu dla Twojego urządzenia
          </p>
        </div>
      </div>
    </section>
  );
}