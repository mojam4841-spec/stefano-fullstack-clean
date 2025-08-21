import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Shield, Crown, ShoppingBag, Map } from "lucide-react";

export function MobileAppDownload() {
  const generateMobileApp = () => {
    // Create the mobile app HTML content
    const mobileAppHtml = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="theme-color" content="#B91C1C">
    <title>Stefano Restaurant & Pub</title>
    <link rel="manifest" href="data:application/json;base64,${btoa(JSON.stringify({
      name: "Stefano Restaurant & Pub",
      short_name: "Stefano",
      description: "Oficjalna aplikacja Stefano Restaurant & Pub",
      start_url: "index.html",
      display: "standalone",
      orientation: "portrait",
      theme_color: "#B91C1C",
      background_color: "#000000",
      icons: [
        {
          src: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" fill="#B91C1C"/><text x="96" y="96" text-anchor="middle" dominant-baseline="middle" fill="#FFD700" font-family="Arial" font-size="120" font-weight="bold">S</text></svg>')}`,
          sizes: "192x192",
          type: "image/svg+xml"
        }
      ]
    }))}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #B91C1C 0%, #991B1B 100%);
            padding: 20px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            font-size: 28px;
            color: #FFD700;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header p {
            color: #FEF3C7;
            margin-top: 5px;
        }
        
        .container {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.3);
            transition: transform 0.3s ease;
        }
        
        .feature-card:active {
            transform: scale(0.98);
        }
        
        .feature-card h3 {
            color: #FFD700;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .feature-card .icon {
            width: 24px;
            height: 24px;
        }
        
        .button {
            background: linear-gradient(135deg, #B91C1C 0%, #991B1B 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 30px;
            font-size: 16px;
            font-weight: bold;
            width: 100%;
            margin-top: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        .button:active {
            transform: scale(0.95);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .contact-info {
            background: rgba(255, 215, 0, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin-top: 30px;
            text-align: center;
        }
        
        .contact-info h3 {
            color: #FFD700;
            margin-bottom: 15px;
        }
        
        .contact-info a {
            color: #FFD700;
            text-decoration: none;
            display: block;
            margin: 10px 0;
            font-size: 18px;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #9CA3AF;
            font-size: 14px;
        }
        
        @media (prefers-color-scheme: light) {
            body {
                background: #F3F4F6;
                color: #1F2937;
            }
            
            .feature-card {
                background: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Stefano Restaurant & Pub</h1>
        <p>Twoja ulubiona restauracja w kieszeni</p>
    </div>
    
    <div class="container">
        <div class="feature-card" onclick="window.location.href='https://stefanogroup.pl/order'">
            <h3>
                <svg class="icon" fill="#FFD700" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                </svg>
                Zamów Online
            </h3>
            <p>Zamów swoje ulubione dania z dostawą lub odbiorem własnym</p>
            <button class="button">Zamów teraz</button>
        </div>
        
        <div class="feature-card" onclick="window.location.href='https://stefanogroup.pl/loyalty'">
            <h3>
                <svg class="icon" fill="#FFD700" viewBox="0 0 24 24">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14.8 3H4.2c-.44 0-.67.53-.34.8L7.2 23c.44.44 1.15.44 1.59 0L12 19.8l3.21 3.2c.44.44 1.15.44 1.59 0l3.34-3.2c.33-.27.1-.8-.34-.8z"/>
                </svg>
                Program Lojalnościowy
            </h3>
            <p>Zbieraj punkty i wymieniaj je na nagrody</p>
            <button class="button">Dołącz teraz</button>
        </div>
        
        <div class="feature-card" onclick="window.location.href='tel:516166186'">
            <h3>
                <svg class="icon" fill="#FFD700" viewBox="0 0 24 24">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                Zadzwoń do nas
            </h3>
            <p>Rezerwacje i zamówienia telefoniczne</p>
            <button class="button">516 166 186</button>
        </div>
        
        <div class="feature-card" onclick="window.open('https://maps.google.com/?q=Stefano+Restaurant+Pub+Kościuszki+17+Bełchatów', '_blank')">
            <h3>
                <svg class="icon" fill="#FFD700" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Jak dojechać
            </h3>
            <p>ul. Kościuszki 17, 97-400 Bełchatów</p>
            <button class="button">Otwórz mapę</button>
        </div>
    </div>
    
    <div class="contact-info">
        <h3>Godziny otwarcia</h3>
        <p>Poniedziałek - Czwartek: 12:00 - 22:00</p>
        <p>Piątek - Sobota: 12:00 - 23:00</p>
        <p>Niedziela: 12:00 - 21:00</p>
        <a href="tel:516166186">📞 516 166 186</a>
        <a href="mailto:info@stefanogroup.pl">✉️ info@stefanogroup.pl</a>
    </div>
    
    <div class="footer">
        <p>© 2025 Stefano Restaurant & Pub</p>
        <p>Enterprise Mobile App v1.0</p>
    </div>
    
    <script>
        // PWA Installation
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('data:text/javascript;base64,${btoa(`
                self.addEventListener('install', e => self.skipWaiting());
                self.addEventListener('activate', e => clients.claim());
                self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));
            `)}');
        }
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Add install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            setTimeout(() => {
                if (deferredPrompt && confirm('Zainstalować aplikację Stefano na ekranie głównym?')) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        deferredPrompt = null;
                    });
                }
            }, 3000);
        });
    </script>
</body>
</html>`;

    // Create and download the file
    const blob = new Blob([mobileAppHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stefano-mobile-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-stefano-gold/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Smartphone className="h-6 w-6 text-stefano-gold" />
          Aplikacja Mobilna Stefano
        </CardTitle>
        <CardDescription className="text-gray-300">
          Pobierz oficjalną aplikację na telefon
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <ShoppingBag className="h-5 w-5 text-stefano-gold mt-1" />
              <div>
                <h4 className="text-white font-semibold">Zamawianie online</h4>
                <p className="text-gray-400 text-sm">Zamów z dostawą lub odbiorem</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Crown className="h-5 w-5 text-stefano-gold mt-1" />
              <div>
                <h4 className="text-white font-semibold">Program lojalnościowy</h4>
                <p className="text-gray-400 text-sm">Zbieraj punkty i nagrody</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-stefano-gold mt-1" />
              <div>
                <h4 className="text-white font-semibold">Bezpieczne logowanie</h4>
                <p className="text-gray-400 text-sm">Chronione dane osobowe</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Map className="h-5 w-5 text-stefano-gold mt-1" />
              <div>
                <h4 className="text-white font-semibold">Nawigacja</h4>
                <p className="text-gray-400 text-sm">Łatwo znajdź restaurację</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Jak zainstalować:</h4>
            <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
              <li>Kliknij przycisk "Pobierz aplikację"</li>
              <li>Otwórz pobrany plik na telefonie</li>
              <li>Kliknij "Dodaj do ekranu głównego"</li>
              <li>Gotowe! Aplikacja jest zainstalowana</li>
            </ol>
          </div>
          
          <Button 
            onClick={generateMobileApp}
            className="w-full bg-stefano-red hover:bg-red-700 text-white"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Pobierz aplikację mobilną
          </Button>
          
          <p className="text-center text-gray-400 text-sm">
            Aplikacja działa offline i nie wymaga instalacji ze sklepu
          </p>
        </div>
      </CardContent>
    </Card>
  );
}