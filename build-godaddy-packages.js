#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Budowanie pakietów wdrożeniowych dla stefanogroup.pl');

// Funkcja do kopiowania plików
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`✓ Skopiowano: ${src} → ${dest}`);
  } catch (error) {
    console.log(`⚠️ Nie można skopiować ${src}: ${error.message}`);
  }
}

// Funkcja do tworzenia katalogu
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Utworzono katalog: ${dir}`);
  }
}

// 1. WERSJA POPRZEDNIA - Podstawowa strona statyczna
console.log('\n📦 Tworzenie Wersji Poprzedniej (Basic HTML)...');

const basicDir = 'godaddy-packages/stefano-basic';
ensureDir(basicDir);

// Podstawowa strona HTML
const basicHTML = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stefano Restaurant & Pub - Bełchatów</title>
    <meta name="description" content="Restauracja i Pub Stefano w Bełchatowie. Najlepsza pizza, burgery i dania kuchni polskiej.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #dc2626; color: white; padding: 1rem 0; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: #1a1a1a; color: white; padding: 4rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; color: #ffd700; }
        .menu { padding: 4rem 0; }
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .menu-item { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; }
        .contact { background: #1a1a1a; color: white; padding: 4rem 0; }
        .footer { background: #dc2626; color: white; padding: 2rem 0; text-align: center; }
        .btn { background: #dc2626; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn:hover { background: #b91c1c; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>Stefano Restaurant & Pub</h1>
            <p>Bełchatów • ul. Kościuszki 1 • Tel: 517 616 618</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Witamy w Stefano</h1>
            <p>Najlepsza pizza, burgery i kuchnia polska w Bełchatowie</p>
            <a href="#menu" class="btn">Zobacz Menu</a>
        </div>
    </section>

    <section id="menu" class="menu">
        <div class="container">
            <h2>Nasze Menu</h2>
            <div class="menu-grid">
                <div class="menu-item">
                    <h3>🍕 Pizza</h3>
                    <p>Margherita - 46 zł</p>
                    <p>Pepperoni - 52 zł</p>
                    <p>Quattro Stagioni - 58 zł</p>
                </div>
                <div class="menu-item">
                    <h3>🍔 Burgery</h3>
                    <p>Klasyczny - 24 zł</p>
                    <p>Cheeseburger - 26 zł</p>
                    <p>Stefano Burger - 29 zł</p>
                </div>
                <div class="menu-item">
                    <h3>🌯 Tortilla</h3>
                    <p>Kurczak - 24 zł</p>
                    <p>Wołowina - 26 zł</p>
                    <p>Wegetariańska - 22 zł</p>
                </div>
            </div>
        </div>
    </section>

    <section class="contact">
        <div class="container">
            <h2>Kontakt</h2>
            <p><strong>Adres:</strong> ul. Kościuszki 1, Bełchatów</p>
            <p><strong>Telefon:</strong> 517 616 618</p>
            <p><strong>Email:</strong> info@stefanogroup.pl</p>
            <p><strong>Godziny:</strong> Pon-Nie 11:00-23:00</p>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Stefano Restaurant & Pub. Wszystkie prawa zastrzeżone.</p>
        </div>
    </footer>
</body>
</html>`;

fs.writeFileSync(path.join(basicDir, 'index.html'), basicHTML);

// Podstawowy .htaccess
const basicHtaccess = `# Basic .htaccess for stefanogroup.pl
RewriteEngine On

# HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
</IfModule>`;

fs.writeFileSync(path.join(basicDir, '.htaccess'), basicHtaccess);

// 2. WERSJA OBECNA - Budowanie aplikacji React
console.log('\n🔧 Budowanie Wersji Obecnej (Full React App)...');

try {
  console.log('📦 Instalowanie zależności...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🏗️ Budowanie aplikacji produkcyjnej...');
  execSync('npm run build', { stdio: 'inherit' });
  
  const currentDir = 'godaddy-packages/stefano-current';
  ensureDir(currentDir);
  
  // Kopiowanie zbudowanych plików
  if (fs.existsSync('dist')) {
    execSync(`cp -r dist/* ${currentDir}/`, { stdio: 'inherit' });
    console.log('✓ Skopiowano pliki aplikacji React');
  }
  
} catch (error) {
  console.error('❌ Błąd podczas budowania:', error.message);
}

// Kopiowanie dodatkowych plików dla wersji obecnej
const currentDir = 'godaddy-packages/stefano-current';

// .htaccess dla SPA
const spaHtaccess = `# Advanced .htaccess for stefanogroup.pl SPA
RewriteEngine On

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# GZIP compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/json "access plus 1 day"
</IfModule>

# SPA routing - redirect all requests to index.html
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Block access to sensitive files
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>`;

fs.writeFileSync(path.join(currentDir, '.htaccess'), spaHtaccess);

// robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://stefanogroup.pl/sitemap.xml`;

fs.writeFileSync(path.join(currentDir, 'robots.txt'), robotsTxt);

// sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stefanogroup.pl/</loc>
    <lastmod>2025-06-26</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stefanogroup.pl/loyalty</loc>
    <lastmod>2025-06-26</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stefanogroup.pl/admin</loc>
    <lastmod>2025-06-26</lastmod>
    <priority>0.3</priority>
  </url>
</urlset>`;

fs.writeFileSync(path.join(currentDir, 'sitemap.xml'), sitemapXml);

// 3. APLIKACJA PWA - Manifest i Service Worker
console.log('\n📱 Przygotowywanie PWA...');

const pwaDir = 'godaddy-packages/stefano-pwa';
ensureDir(pwaDir);

// manifest.json
const manifest = {
  "name": "Stefano Restaurant & Pub",
  "short_name": "Stefano",
  "description": "Restauracja i Pub w Bełchatowie - zamówienia online, rezerwacje, program lojalnościowy",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#dc2626",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "pl",
  "categories": ["food", "restaurant", "business"],
  "screenshots": [
    {
      "src": "/assets/screenshot-narrow.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/assets/screenshot-wide.png", 
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Zamów Jedzenie",
      "short_name": "Zamówienie",
      "description": "Złóż zamówienie online",
      "url": "/?order=true",
      "icons": [{ "src": "/assets/icon-order.png", "sizes": "96x96" }]
    },
    {
      "name": "Rezerwacja",
      "short_name": "Rezerwuj",
      "description": "Zarezerwuj stolik",
      "url": "/?reservation=true",
      "icons": [{ "src": "/assets/icon-reservation.png", "sizes": "96x96" }]
    },
    {
      "name": "Program Lojalnościowy",
      "short_name": "Punkty",
      "description": "Sprawdź swoje punkty",
      "url": "/loyalty",
      "icons": [{ "src": "/assets/icon-loyalty.png", "sizes": "96x96" }]
    }
  ],
  "icons": [
    {
      "src": "/assets/icon-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icon-96.png",
      "sizes": "96x96", 
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icon-128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icon-144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icon-152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icon-384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
};

fs.writeFileSync(path.join(pwaDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

// Service Worker
const serviceWorker = `// Service Worker for Stefano Restaurant PWA
const CACHE_NAME = 'stefano-v2025-06-26';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  // Add other critical assets here
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nowa wiadomość z Stefano!',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore', 
        title: 'Zobacz więcej',
        icon: '/assets/icon-checkmark.png'
      },
      {
        action: 'close', 
        title: 'Zamknij',
        icon: '/assets/icon-xmark.png'
      },
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Stefano Restaurant', options)
  );
});`;

fs.writeFileSync(path.join(pwaDir, 'sw.js'), serviceWorker);

// Instrukcja instalacji PWA
const pwaInstructions = `# 📱 Instalacja Aplikacji Stefano (PWA)

## Dla Użytkowników (Klientów)

### Android (Chrome/Edge)
1. Otwórz stefanogroup.pl w przeglądarce
2. Kliknij menu (3 kropki) → "Dodaj do ekranu głównego"
3. Potwierdź instalację
4. Ikona Stefano pojawi się na ekranie głównym

### iPhone (Safari)
1. Otwórz stefanogroup.pl w Safari
2. Kliknij przycisk "Udostępnij" (kwadrat ze strzałką)
3. Przewiń w dół i wybierz "Na ekran początkowy"
4. Kliknij "Dodaj"

### Desktop (Chrome/Edge)
1. Otwórz stefanogroup.pl
2. Kliknij ikonę "Zainstaluj" w pasku adresu
3. lub Menu → "Zainstaluj Stefano..."

## Funkcje PWA
- ✅ Działa offline (cache podstawowych danych)
- ✅ Szybkie ładowanie (Service Worker)
- ✅ Powiadomienia push (opcjonalnie)
- ✅ Pełnoekranowy interfejs
- ✅ Automatyczne aktualizacje`;

fs.writeFileSync(path.join(pwaDir, 'PWA-INSTALLATION.md'), pwaInstructions);

// Tworzenie archiwów ZIP
console.log('\n📦 Tworzenie archiwów do wdrożenia...');

try {
  execSync('zip -r godaddy-packages/stefano-basic.zip godaddy-packages/stefano-basic/', { stdio: 'inherit' });
  console.log('✓ Utworzono: stefano-basic.zip');
} catch (error) {
  console.log('⚠️ Nie można utworzyć archiwum basic');
}

try {
  execSync('zip -r godaddy-packages/stefano-current.zip godaddy-packages/stefano-current/', { stdio: 'inherit' });
  console.log('✓ Utworzono: stefano-current.zip');
} catch (error) {
  console.log('⚠️ Nie można utworzyć archiwum current');
}

try {
  execSync('zip -r godaddy-packages/stefano-pwa.zip godaddy-packages/stefano-pwa/', { stdio: 'inherit' });
  console.log('✓ Utworzono: stefano-pwa.zip');
} catch (error) {
  console.log('⚠️ Nie można utworzyć archiwum PWA');
}

console.log('\n🎉 Pakiety wdrożeniowe gotowe!');
console.log('\n📁 Struktura pakietów:');
console.log('├── stefano-basic.zip      - Podstawowa strona HTML');
console.log('├── stefano-current.zip    - Pełna aplikacja React');
console.log('└── stefano-pwa.zip        - Pliki PWA (manifest, SW)');
console.log('\n📖 Szczegółowe instrukcje: GODADDY-DEPLOYMENT-GUIDE.md');