#!/usr/bin/env node

/**
 * Stefano Cyberpunk Avatars - Standalone Mobile App Generator
 * Tworzy kompletną aplikację mobilną działającą offline na telefonie
 */

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📱 Stefano Cyberpunk Avatars - Standalone Mobile App');
console.log('=====================================================');

async function createStandaloneMobileApp() {
  const packageName = 'stefano-cyberpunk-avatars-standalone.zip';
  const tempDir = './stefano-mobile-app';
  
  try {
    // Tworzenie struktury aplikacji mobilnej
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    console.log('📱 Tworzenie struktury aplikacji mobilnej...');
    
    const dirs = [
      'app',
      'assets/avatars',
      'assets/icons',
      'scripts/android',
      'scripts/ios',
      'config',
      'docs'
    ];
    
    dirs.forEach(dir => {
      fs.mkdirSync(path.join(tempDir, dir), { recursive: true });
    });

    // Główny HTML aplikacji
    console.log('🎨 Tworzenie interfejsu aplikacji...');
    
    const appHTML = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stefano Cyberpunk Avatars</title>
    <link rel="manifest" href="manifest.json">
    <link rel="icon" type="image/png" href="assets/icons/icon-192x192.png">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f0f23);
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 390px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(45deg, #8B5CF6, #06B6D4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #888;
            font-size: 14px;
        }
        
        .avatar-selector {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .avatar-card {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid transparent;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .avatar-card:hover {
            transform: scale(1.05);
            border-color: #8B5CF6;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
        
        .avatar-card.selected {
            border-color: #06B6D4;
            background: rgba(6, 182, 212, 0.2);
            box-shadow: 0 0 30px rgba(6, 182, 212, 0.4);
        }
        
        .avatar-svg {
            width: 80px;
            height: 80px;
            margin: 0 auto 15px;
        }
        
        .avatar-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .avatar-description {
            font-size: 12px;
            color: #aaa;
        }
        
        .controls {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
        }
        
        .control-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .control-group:last-child {
            margin-bottom: 0;
        }
        
        .toggle-btn {
            background: linear-gradient(45deg, #8B5CF6, #06B6D4);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .toggle-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
        }
        
        .toggle-btn.off {
            background: #444;
        }
        
        .restaurant-info {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            backdrop-filter: blur(5px);
        }
        
        .restaurant-logo {
            font-size: 18px;
            font-weight: bold;
            color: #F59E0B;
            margin-bottom: 10px;
        }
        
        .restaurant-details {
            font-size: 12px;
            color: #888;
            line-height: 1.5;
        }
        
        .status-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #10B981;
            box-shadow: 0 0 10px #10B981;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .glow {
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { filter: drop-shadow(0 0 5px #8B5CF6); }
            to { filter: drop-shadow(0 0 20px #06B6D4); }
        }
        
        .floating {
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    </style>
</head>
<body>
    <div class="status-indicator" title="Aplikacja działa offline"></div>
    
    <div class="container">
        <div class="header">
            <div class="logo floating">🚀 Stefano Cyberpunk Avatars</div>
            <div class="subtitle">Niezależna aplikacja mobilna</div>
        </div>
        
        <div class="avatar-selector">
            <div class="avatar-card" onclick="selectAvatar('woman')" id="avatar-woman">
                <div class="avatar-svg glow" id="woman-svg"></div>
                <div class="avatar-name">Cyber Kobieta</div>
                <div class="avatar-description">Futurystyczna wojowniczka</div>
            </div>
            
            <div class="avatar-card" onclick="selectAvatar('man')" id="avatar-man">
                <div class="avatar-svg glow" id="man-svg"></div>
                <div class="avatar-name">Cyber Mężczyzna</div>
                <div class="avatar-description">Cybernetyczny gladiator</div>
            </div>
        </div>
        
        <div class="controls">
            <div class="control-group">
                <span>Animacje:</span>
                <button class="toggle-btn" onclick="toggleAnimations()" id="anim-btn">Włączone</button>
            </div>
            <div class="control-group">
                <span>Efekty dźwiękowe:</span>
                <button class="toggle-btn" onclick="toggleSounds()" id="sound-btn">Włączone</button>
            </div>
            <div class="control-group">
                <span>Tryb wysokiej jakości:</span>
                <button class="toggle-btn" onclick="toggleQuality()" id="quality-btn">Włączone</button>
            </div>
        </div>
        
        <div class="restaurant-info">
            <div class="restaurant-logo">🍽️ Restaurant & Pub Stefano</div>
            <div class="restaurant-details">
                Bełchatów, ul. Kościuszki<br>
                Tel: 516 166 18<br>
                Wersja aplikacji: 2.0.0
            </div>
        </div>
    </div>

    <script>
        // Aplikacja działa całkowicie offline
        let selectedAvatar = null;
        let animationsEnabled = true;
        let soundsEnabled = true;
        let qualityEnabled = true;
        
        // SVG Avatary wbudowane w aplikację
        const avatarSVGs = {
            woman: \`<svg width="80" height="80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="womanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
                <circle cx="100" cy="80" r="45" fill="url(#womanGradient)" filter="url(#glow)" opacity="0.9"/>
                <circle cx="85" cy="75" r="8" fill="#00FFFF" filter="url(#glow)"/>
                <circle cx="115" cy="75" r="8" fill="#00FFFF" filter="url(#glow)"/>
                <circle cx="85" cy="75" r="3" fill="#FFFFFF"/>
                <circle cx="115" cy="75" r="3" fill="#FFFFFF"/>
                <path d="M 70 85 Q 100 90 130 85" stroke="#FF00FF" stroke-width="2" fill="none" filter="url(#glow)"/>
                <ellipse cx="100" cy="150" rx="35" ry="55" fill="url(#womanGradient)" opacity="0.8"/>
                <ellipse cx="65" cy="135" rx="15" ry="25" fill="url(#womanGradient)" opacity="0.7"/>
                <ellipse cx="135" cy="135" rx="15" ry="25" fill="url(#womanGradient)" opacity="0.7"/>
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
            </svg>\`,
            
            man: \`<svg width="80" height="80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="manGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:1" />
                    </linearGradient>
                    <filter id="glow2">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
                <circle cx="100" cy="80" r="45" fill="url(#manGradient)" filter="url(#glow2)" opacity="0.9"/>
                <circle cx="85" cy="75" r="8" fill="#FFD700" filter="url(#glow2)"/>
                <circle cx="115" cy="75" r="8" fill="#FFD700" filter="url(#glow2)"/>
                <circle cx="85" cy="75" r="3" fill="#FFFFFF"/>
                <circle cx="115" cy="75" r="3" fill="#FFFFFF"/>
                <path d="M 70 85 Q 100 90 130 85" stroke="#00BFFF" stroke-width="2" fill="none" filter="url(#glow2)"/>
                <ellipse cx="100" cy="150" rx="40" ry="55" fill="url(#manGradient)" opacity="0.8"/>
                <ellipse cx="60" cy="135" rx="18" ry="28" fill="url(#manGradient)" opacity="0.7"/>
                <ellipse cx="140" cy="135" rx="18" ry="28" fill="url(#manGradient)" opacity="0.7"/>
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
            </svg>\`
        };
        
        // Inicjalizacja aplikacji
        function initApp() {
            document.getElementById('woman-svg').innerHTML = avatarSVGs.woman;
            document.getElementById('man-svg').innerHTML = avatarSVGs.man;
            
            // Załaduj ustawienia z localStorage
            loadSettings();
            
            console.log('🚀 Stefano Cyberpunk Avatars - Standalone App Loaded');
        }
        
        function selectAvatar(type) {
            // Usuń poprzednie zaznaczenie
            document.querySelectorAll('.avatar-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Zaznacz nowy avatar
            document.getElementById('avatar-' + type).classList.add('selected');
            selectedAvatar = type;
            
            // Zapisz wybór
            localStorage.setItem('selectedAvatar', type);
            
            // Efekt dźwiękowy (jeśli włączony)
            if (soundsEnabled) {
                playSelectSound();
            }
            
            console.log('Avatar selected:', type);
        }
        
        function toggleAnimations() {
            animationsEnabled = !animationsEnabled;
            const btn = document.getElementById('anim-btn');
            
            if (animationsEnabled) {
                btn.textContent = 'Włączone';
                btn.classList.remove('off');
                document.querySelectorAll('.glow').forEach(el => el.style.animation = 'glow 2s ease-in-out infinite alternate');
            } else {
                btn.textContent = 'Wyłączone';
                btn.classList.add('off');
                document.querySelectorAll('.glow').forEach(el => el.style.animation = 'none');
            }
            
            localStorage.setItem('animationsEnabled', animationsEnabled);
        }
        
        function toggleSounds() {
            soundsEnabled = !soundsEnabled;
            const btn = document.getElementById('sound-btn');
            
            if (soundsEnabled) {
                btn.textContent = 'Włączone';
                btn.classList.remove('off');
            } else {
                btn.textContent = 'Wyłączone';
                btn.classList.add('off');
            }
            
            localStorage.setItem('soundsEnabled', soundsEnabled);
        }
        
        function toggleQuality() {
            qualityEnabled = !qualityEnabled;
            const btn = document.getElementById('quality-btn');
            
            if (qualityEnabled) {
                btn.textContent = 'Włączone';
                btn.classList.remove('off');
            } else {
                btn.textContent = 'Wyłączone';
                btn.classList.add('off');
            }
            
            localStorage.setItem('qualityEnabled', qualityEnabled);
        }
        
        function playSelectSound() {
            // Prosty beep sound używający Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }
        
        function loadSettings() {
            // Załaduj ustawienia z localStorage
            const savedAvatar = localStorage.getItem('selectedAvatar');
            if (savedAvatar) {
                selectAvatar(savedAvatar);
            }
            
            const savedAnimations = localStorage.getItem('animationsEnabled');
            if (savedAnimations !== null) {
                animationsEnabled = savedAnimations === 'true';
                if (!animationsEnabled) toggleAnimations();
            }
            
            const savedSounds = localStorage.getItem('soundsEnabled');
            if (savedSounds !== null) {
                soundsEnabled = savedSounds === 'true';
                if (!soundsEnabled) toggleSounds();
            }
            
            const savedQuality = localStorage.getItem('qualityEnabled');
            if (savedQuality !== null) {
                qualityEnabled = savedQuality === 'true';
                if (!qualityEnabled) toggleQuality();
            }
        }
        
        // PWA Support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed'));
        }
        
        // Inicjalizuj aplikację po załadowaniu
        document.addEventListener('DOMContentLoaded', initApp);
    </script>
</body>
</html>`;

    // Service Worker dla offline functionality
    const serviceWorker = `
const CACHE_NAME = 'stefano-avatars-v2.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
`;

    // PWA Manifest
    const manifest = {
      "name": "Stefano Cyberpunk Avatars",
      "short_name": "Stefano Avatars",
      "description": "Cyberpunkowe avatary Restaurant & Pub Stefano",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#1a1a2e",
      "theme_color": "#8B5CF6",
      "orientation": "portrait",
      "icons": [
        {
          "src": "assets/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "assets/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    };

    // Autostart script dla Android
    const androidAutostart = `#!/system/bin/sh
# Stefano Cyberpunk Avatars - Android Autostart
echo "Starting Stefano Avatars on Android..."

# Znajdź przeglądarkę
if command -v am >/dev/null 2>&1; then
    # Użyj Android Activity Manager
    am start -a android.intent.action.VIEW -d "file:///sdcard/stefano-mobile-app/app/index.html"
elif command -v chrome >/dev/null 2>&1; then
    chrome --app="file:///sdcard/stefano-mobile-app/app/index.html"
elif command -v firefox >/dev/null 2>&1; then
    firefox "file:///sdcard/stefano-mobile-app/app/index.html"
else
    echo "Nie można znaleźć przeglądarki. Otwórz ręcznie plik index.html"
fi

echo "Stefano Avatars uruchomiony!"
`;

    // Autostart script dla iOS
    const iosAutostart = `#!/bin/bash
# Stefano Cyberpunk Avatars - iOS Autostart
echo "Starting Stefano Avatars on iOS..."

# Otwórz w Safari
open -a Safari "file://$(pwd)/app/index.html"

echo "Stefano Avatars uruchomiony w Safari!"
`;

    // Zapisywanie plików
    console.log('💾 Zapisywanie plików aplikacji...');
    
    fs.writeFileSync(path.join(tempDir, 'app/index.html'), appHTML);
    fs.writeFileSync(path.join(tempDir, 'app/sw.js'), serviceWorker);
    fs.writeFileSync(path.join(tempDir, 'app/manifest.json'), JSON.stringify(manifest, null, 2));
    
    fs.writeFileSync(path.join(tempDir, 'scripts/android/autostart.sh'), androidAutostart);
    fs.writeFileSync(path.join(tempDir, 'scripts/ios/autostart.sh'), iosAutostart);

    // Instrukcje instalacji
    const readme = `# 📱 Stefano Cyberpunk Avatars - Standalone Mobile App

## 🚀 Instalacja na Telefonie

### Android:
1. Rozpakuj folder \`stefano-mobile-app\`
2. Skopiuj do \`/sdcard/\` na telefonie
3. Otwórz plik \`app/index.html\` w przeglądarce
4. Dodaj do ekranu głównego (Add to Home Screen)
5. Autostart: \`sh scripts/android/autostart.sh\`

### iOS:
1. Rozpakuj folder \`stefano-mobile-app\`
2. Skopiuj do aplikacji Files
3. Otwórz plik \`app/index.html\` w Safari
4. Kliknij "Udostępnij" → "Dodaj do ekranu głównego"
5. Autostart: \`bash scripts/ios/autostart.sh\`

## ✨ Funkcje

- 🎨 2 Cyberpunkowe avatary z animacjami SVG
- 📱 Pełna funkcjonalność offline
- 🎵 Efekty dźwiękowe (opcjonalne)
- ⚡ Natywne ustawienia zapisywane lokalnie
- 🚀 PWA - instalacja na ekranie głównym
- 🔄 Autostart przy uruchomieniu telefonu

## 🎯 Avatary

### Cyber Kobieta
- Gradient: Purple-Cyan (#8B5CF6 → #06B6D4)
- Efekty: Neonowe oczy, animacje glow
- Opis: Futurystyczna wojowniczka

### Cyber Mężczyzna
- Gradient: Blue-Gold (#3B82F6 → #F59E0B)
- Efekty: Technologiczne ulepszenia
- Opis: Cybernetyczny gladiator

## 🛠️ Ustawienia

- **Animacje**: Włącz/wyłącz efekty glow
- **Dźwięki**: Kontroluj efekty audio
- **Jakość**: Tryb wysokiej jakości SVG

## 📞 Kontakt

Restaurant & Pub Stefano
Bełchatów, ul. Kościuszki
Tel: 516 166 18

Wersja: 2.0.0 | ${new Date().toLocaleDateString('pl-PL')}
`;

    fs.writeFileSync(path.join(tempDir, 'README.md'), readme);

    // Tworzenie ikon (base64 encoded PNG)
    console.log('🎨 Generowanie ikon aplikacji...');
    
    // Prosta ikona 192x192 (base64)
    const icon192 = `iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFQ2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGcSURBVHja7NixDQAACAIw+P9oiwv1IEKlOw7OzGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;
    
    // Zapisz ikony (placeholder - w prawdziwej implementacji używałbyś biblioteki do generowania PNG)
    fs.writeFileSync(path.join(tempDir, 'assets/icons/icon-192x192.png'), Buffer.from(icon192, 'base64'));
    fs.writeFileSync(path.join(tempDir, 'assets/icons/icon-512x512.png'), Buffer.from(icon192, 'base64'));

    // Tworzenie archiwum ZIP
    console.log('📦 Pakowanie aplikacji mobilnej...');
    
    const output = fs.createWriteStream(packageName);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log(`✅ Aplikacja mobilna utworzona: ${packageName} (${archive.pointer()} bytes)`);
        
        // Czyszczenie tymczasowego folderu
        fs.rmSync(tempDir, { recursive: true, force: true });
        
        console.log('🎉 Stefano Cyberpunk Avatars - Standalone Mobile App Ready!');
        console.log('===========================================================');
        console.log(`📱 Plik ZIP: ${packageName}`);
        console.log('📲 Aplikacja działa całkowicie offline na telefonie');
        console.log('🚀 Zawiera autostart i PWA functionality');
        
        resolve(packageName);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(tempDir, false);
      archive.finalize();
    });

  } catch (error) {
    console.error('❌ Błąd podczas tworzenia aplikacji mobilnej:', error);
    
    // Czyszczenie w przypadku błędu
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    throw error;
  }
}

// Uruchomienie generatora
if (import.meta.url === `file://${process.argv[1]}`) {
  createStandaloneMobileApp()
    .then((packageName) => {
      console.log(`\n🚀 Standalone Mobile App ${packageName} jest gotowa!`);
      console.log('Aplikacja działa niezależnie na telefonie bez internetu.');
    })
    .catch((error) => {
      console.error('❌ Błąd:', error.message);
      process.exit(1);
    });
}

export { createStandaloneMobileApp };