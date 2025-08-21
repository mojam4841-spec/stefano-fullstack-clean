import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const heroImages = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
  "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
  "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
  "https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Tło – slajder */}
      <div className="absolute inset-0">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/60" />

      {/* Treść */}
      <div className="relative text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-montserrat font-bold mb-6">
          <span className="stefano-gold">STEFANO</span>
        </h1>
        <p className="text-2xl md:text-3xl font-light mb-4">
          Delicious Pizza &amp; Family Chicken King
        </p>
        <p className="text-lg mb-8 opacity-90">
          Najlepsza restauracja w Bełchatowie z unikalną atmosferą
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          <Button
            onClick={() => scrollToSection("zamow")}
            className="w-full md:w-auto bg-stefano-red hover:bg-red-600 px-8 py-4 text-lg font-semibold"
          >
            Zamów z odbiorem
          </Button>

          <Button
            onClick={() => scrollToSection("menu")}
            variant="outline"
            className="w-full md:w-auto border-2 border-stefano-gold text-stefano-gold hover:bg-stefano-gold hover:text-black px-8 py-4 text-lg font-semibold"
          >
            Zobacz Menu
          </Button>
        </div>

        {/* QR Code */}
        <div className="mt-12 flex flex-col items-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl border-2 border-stefano-gold/30">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://stefanogroup.pl&bgcolor=ffffff&color=000000&margin=10"
              alt="QR Code - Aplikacja Stefano"
              className="w-32 h-32"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.createElement("div");
                fallback.innerHTML = `
                  <svg width="128" height="128" viewBox="0 0 120 120">
                    <rect x="5" y="5" width="25" height="25" fill="black"/>
                    <rect x="90" y="5" width="25" height="25" fill="black"/>
                    <rect x="5" y="90" width="25" height="25" fill="black"/>
                  </svg>`;
                e.currentTarget.parentNode?.appendChild(fallback);
              }}
            />
          </div>

          <div className="mt-4 text-center max-w-sm">
            <h3 className="text-stefano-gold font-semibold text-lg mb-2">
              Aplikacja mobilna Stefano
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Zeskanuj kod QR, aby zainstalować aplikację restauracji
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stefano-gray/50 p-3 rounded-lg">
                <div className="text-stefano-gold font-semibold mb-1">
                  📱 Android
                </div>
                <div>Otwórz kamerę → Zeskanuj kod → Otwórz link</div>
              </div>
              <div className="bg-stefano-gray/50 p-3 rounded-lg">
                <div className="text-stefano-gold font-semibold mb-1">
                  🍎 iOS
                </div>
                <div>Otwórz kamerę → Zeskanuj kod → Dotknij powiadomienia</div>
              </div>
            </div>

            <Button
              onClick={() => {
                navigator.clipboard
                  .writeText(window.location.origin)
                  .then(() => alert("Link skopiowany do schowka!"));
              }}
              className="mt-4 bg-stefano-red hover:bg-red-600 text-sm px-4 py-2"
            >
              📋 Skopiuj link
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
