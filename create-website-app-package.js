import archiver from 'archiver';
import fs from 'fs-extra';
import path from 'path';

async function createWebsiteAppPackage() {
  console.log('📦 Tworzę pakiet ze stroną i aplikacją mobilną...\n');

  const packageName = 'stefano-strona-i-aplikacja';
  const tempDir = path.join('.', 'temp', packageName);

  try {
    // Usuń istniejący folder temp
    await fs.remove(tempDir);
    await fs.ensureDir(tempDir);

    // Utwórz folder na stronę internetową
    const websiteDir = path.join(tempDir, 'STRONA-INTERNETOWA');
    await fs.ensureDir(websiteDir);

    // Utwórz folder na aplikację mobilną
    const appDir = path.join(tempDir, 'APLIKACJA-MOBILNA-PWA');
    await fs.ensureDir(appDir);

    // Kopiuj pliki strony internetowej
    console.log('📄 Kopiuję pliki strony internetowej...');
    const websiteFiles = [
      'client/src',
      'server',
      'shared',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      'drizzle.config.ts',
      '.env.demo'
    ];

    for (const file of websiteFiles) {
      if (await fs.pathExists(file)) {
        await fs.copy(file, path.join(websiteDir, file));
      }
    }

    // Kopiuj pliki PWA
    console.log('📱 Kopiuję pliki aplikacji mobilnej PWA...');
    const pwaFiles = [
      'client/public/manifest.json',
      'client/public/sw.js',
      'client/public/icon-gastro.svg',
      'client/index.html'
    ];

    for (const file of pwaFiles) {
      if (await fs.pathExists(file)) {
        const destPath = path.join(appDir, path.basename(file));
        await fs.copy(file, destPath);
      }
    }

    // Kopiuj assets
    if (await fs.pathExists('attached_assets')) {
      await fs.copy('attached_assets', path.join(websiteDir, 'attached_assets'));
      await fs.copy('attached_assets', path.join(appDir, 'assets'));
    }

    // Utwórz README dla całego pakietu
    const mainReadme = `# 🍕 STEFANO - STRONA INTERNETOWA I APLIKACJA MOBILNA

## 📂 ZAWARTOŚĆ PAKIETU:

### 1️⃣ STRONA-INTERNETOWA/
To jest główna strona restauracji Stefano do uruchomienia w przeglądarce internetowej.

**Co zawiera:**
- Pełna strona restauracji z menu, zamówieniami online
- Panel administracyjny dla właściciela
- System rezerwacji i program lojalnościowy
- Integracja z bazą danych i emailami

**Jak uruchomić:**
1. Wejdź do folderu STRONA-INTERNETOWA
2. Uruchom: npm install
3. Uruchom: npm run dev
4. Otwórz: http://localhost:3000

### 2️⃣ APLIKACJA-MOBILNA-PWA/
To jest wersja aplikacji mobilnej (Progressive Web App) do instalacji na telefonie.

**Co zawiera:**
- Oddzielna aplikacja działająca offline
- Możliwość instalacji na ekranie głównym telefonu
- Powiadomienia push
- Szybszy dostęp do menu i zamawiania

**Jak zainstalować na telefonie:**
1. Otwórz stronę w Chrome/Safari na telefonie
2. Kliknij "Dodaj do ekranu głównego"
3. Aplikacja pojawi się jak normalna aplikacja

## 🔍 RÓŻNICE:

### STRONA INTERNETOWA:
- ✅ Pełna funkcjonalność
- ✅ Panel administracyjny
- ✅ Wymaga internetu
- ✅ Działa w każdej przeglądarce
- ✅ Większa (więcej funkcji)

### APLIKACJA MOBILNA PWA:
- ✅ Działa offline
- ✅ Szybsze ładowanie
- ✅ Instalacja na telefonie
- ✅ Powiadomienia push
- ✅ Lżejsza (zoptymalizowana)

## 📱 KOMPATYBILNOŚĆ:

### iPhone/iOS:
- Strona: ✅ Safari, Chrome
- Aplikacja: ✅ Safari (dodaj do ekranu głównego)

### Android:
- Strona: ✅ Chrome, Firefox, Samsung Internet
- Aplikacja: ✅ Chrome (instalacja automatyczna)

## 🔐 DANE LOGOWANIA:
Panel admina (tylko strona internetowa):
- Email: admin@stefanogroup.pl
- Hasło: admin123456

## 📞 KONTAKT:
Restauracja Stefano
Tel: 517 616 618
ul. Kościuszki 19
97-400 Bełchatów`;

    await fs.writeFile(path.join(tempDir, 'CZYTAJ-MNIE.txt'), mainReadme);

    // README dla strony
    const websiteReadme = `# 🌐 STRONA INTERNETOWA STEFANO

## 📋 WYMAGANIA:
- Node.js 18+
- PostgreSQL (lub użyj darmowej bazy Neon)

## 🚀 INSTALACJA:

1. Zainstaluj zależności:
   npm install

2. Skonfiguruj bazę danych:
   - Skopiuj .env.demo na .env
   - Dodaj DATABASE_URL z PostgreSQL

3. Uruchom migracje:
   npm run db:push

4. Uruchom aplikację:
   npm run dev

5. Otwórz w przeglądarce:
   http://localhost:3000

## 📱 FUNKCJE:
- Menu restauracji z cenami
- Zamawianie online
- System rezerwacji
- Program lojalnościowy
- Panel administracyjny (/admin)
- Integracja z WhatsApp
- Powiadomienia email
- Statystyki i raporty

## 💻 TECHNOLOGIE:
- React + TypeScript
- Tailwind CSS
- PostgreSQL + Drizzle
- Express.js
- Vite`;

    await fs.writeFile(path.join(websiteDir, 'README.txt'), websiteReadme);

    // README dla aplikacji
    const appReadme = `# 📱 APLIKACJA MOBILNA STEFANO (PWA)

## 🚀 INSTALACJA NA TELEFONIE:

### iPhone (iOS):
1. Otwórz Safari
2. Wejdź na stronę restauracji
3. Kliknij przycisk Udostępnij (kwadrat ze strzałką)
4. Wybierz "Dodaj do ekranu głównego"
5. Nadaj nazwę i kliknij "Dodaj"

### Android:
1. Otwórz Chrome
2. Wejdź na stronę restauracji
3. Pojawi się baner "Dodaj do ekranu głównego"
4. Kliknij "Dodaj"
5. LUB kliknij menu (3 kropki) → "Dodaj do ekranu głównego"

## ✨ FUNKCJE APLIKACJI:
- ✅ Działa offline (bez internetu)
- ✅ Szybkie ładowanie
- ✅ Powiadomienia o promocjach
- ✅ Ikona na ekranie głównym
- ✅ Pełny ekran bez paska przeglądarki
- ✅ Menu i zamawianie
- ✅ Program lojalnościowy

## 📱 RÓŻNICE OD STRONY:
- Lżejsza i szybsza
- Działa bez internetu
- Brak panelu admina
- Zoptymalizowana pod telefony
- Automatyczne aktualizacje

## 🔔 POWIADOMIENIA:
Po instalacji aplikacja może wysyłać powiadomienia o:
- Nowych promocjach
- Statusie zamówienia
- Punktach lojalnościowych`;

    await fs.writeFile(path.join(appDir, 'INSTRUKCJA-INSTALACJI.txt'), appReadme);

    // Utwórz plik HTML demonstracyjny dla PWA
    const demoHtml = `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stefano - Aplikacja Mobilna</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#DC2626">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #DC2626; }
        .install-btn {
            background: #DC2626;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 5px;
            font-size: 18px;
            width: 100%;
            cursor: pointer;
            margin-top: 20px;
        }
        .features {
            margin: 20px 0;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        .features li {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍕 Stefano Restaurant</h1>
        <p>Witaj w aplikacji mobilnej Stefano!</p>
        
        <div class="features">
            <h3>Funkcje aplikacji:</h3>
            <ul>
                <li>📱 Działa offline</li>
                <li>🚀 Szybkie ładowanie</li>
                <li>🔔 Powiadomienia push</li>
                <li>📥 Instalacja na telefonie</li>
                <li>🍕 Menu i zamawianie</li>
                <li>⭐ Program lojalnościowy</li>
            </ul>
        </div>
        
        <button class="install-btn" id="installBtn" style="display:none;">
            Zainstaluj aplikację
        </button>
        
        <p style="text-align: center; margin-top: 20px; color: #666;">
            📞 Zamówienia: 517 616 618
        </p>
    </div>
    
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js');
        }
        
        let deferredPrompt;
        const installBtn = document.getElementById('installBtn');
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'block';
        });
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log('Instalacja:', outcome);
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(appDir, 'index.html'), demoHtml);

    // Utwórz archiwum ZIP
    console.log('\n📦 Tworzę archiwum ZIP...');
    const output = fs.createWriteStream(`${packageName}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`\n✅ Pakiet utworzony: ${packageName}.zip`);
      console.log(`📊 Rozmiar: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
      console.log('\n📋 STRUKTURA PAKIETU:');
      console.log('├── CZYTAJ-MNIE.txt');
      console.log('├── STRONA-INTERNETOWA/  (pełna strona do przeglądarki)');
      console.log('│   ├── client/          (frontend React)');
      console.log('│   ├── server/          (backend Express)');
      console.log('│   ├── README.txt       (instrukcja uruchomienia)');
      console.log('│   └── ...              (wszystkie pliki projektu)');
      console.log('└── APLIKACJA-MOBILNA-PWA/ (aplikacja na telefon)');
      console.log('    ├── index.html       (strona startowa)');
      console.log('    ├── manifest.json    (konfiguracja PWA)');
      console.log('    ├── sw.js           (service worker)');
      console.log('    └── INSTRUKCJA-INSTALACJI.txt');
      
      // Usuń folder tymczasowy
      fs.remove(tempDir);
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(tempDir, false);
    await archive.finalize();

  } catch (error) {
    console.error('❌ Błąd podczas tworzenia pakietu:', error);
    // Spróbuj usunąć folder tymczasowy w przypadku błędu
    await fs.remove(tempDir).catch(() => {});
  }
}

// Uruchom
createWebsiteAppPackage();