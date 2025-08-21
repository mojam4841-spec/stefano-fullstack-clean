# Instrukcja wdrożenia na GoDaddy Hosting

## Przygotowanie plików do wdrożenia

### 1. Zbudowanie produkcyjnej wersji

```bash
npm run build
```

### 2. Pliki do przesłania na serwer

Po zbudowaniu skopiuj te pliki na serwer GoDaddy:

**Z folderu `dist/` (frontend):**
- `index.html`
- `assets/` (cały folder)
- `attached_assets/` (wszystkie obrazy logo)

**Z folderu głównego:**
- `server/` (cały folder z backendem)
- `package.json`
- `package-lock.json`

### 3. Konfiguracja serwera GoDaddy

#### A. Plik `.htaccess` dla Apache (umieść w głównym katalogu)
```apache
RewriteEngine On

# Przekierowania HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API routes do Node.js
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ /server/index.js [L,P]

# SPA routing - wszystkie inne requesty do index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>
```

#### B. Plik `package.json` dla serwera (w głównym katalogu)
```json
{
  "name": "stefano-website",
  "version": "1.0.0",
  "description": "Restauracja & Pub Stefano - Official Website",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "NODE_ENV=development tsx server/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 4. Zmienne środowiskowe (ustaw w panelu GoDaddy)

```
NODE_ENV=production
PORT=80
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Struktura folderów na serwerze

```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── attached_assets/
│   └── Asset 1@2x-1 (1)_1750907274208.png
├── server/
│   ├── index.js
│   ├── routes.js
│   └── ...
├── .htaccess
└── package.json
```

### 6. Instrukcje krok po kroku

1. **Zbuduj projekt lokalnie:**
   ```bash
   npm run build
   ```

2. **Zaloguj się do panelu GoDaddy**
   - Przejdź do File Manager
   - Wejdź do folderu `public_html`

3. **Wyczyść istniejące pliki**
   - Usuń domyślne pliki GoDaddy

4. **Prześlij pliki:**
   - Skopiuj zawartość folderu `dist/` do `public_html/`
   - Skopiuj folder `attached_assets/` do `public_html/`
   - Skopiuj folder `server/` do `public_html/`
   - Skopiuj `.htaccess` do `public_html/`

5. **Zainstaluj dependencies (jeśli Node.js jest dostępny):**
   ```bash
   npm install --production
   ```

6. **Ustaw zmienne środowiskowe w panelu GoDaddy**

7. **Testuj stronę:**
   - Otwórz https://stefanogroup.pl
   - Sprawdź wszystkie sekcje
   - Przetestuj formularz kontaktowy
   - Sprawdź chatbota

### 7. Optymalizacja SEO

- Sprawdź czy wszystkie meta tagi są poprawne
- Zweryfikuj structured data (JSON-LD)
- Przetestuj na Google PageSpeed Insights
- Dodaj sitemap.xml
- Skonfiguruj Google Analytics

### 8. Backup i monitoring

- Utwórz backup przed wdrożeniem
- Skonfiguruj monitoring uptime
- Dodaj Google Search Console

## Wsparcie techniczne

W przypadku problemów z wdrożeniem:
1. Sprawdź logi błędów w panelu GoDaddy
2. Zweryfikuj czy Node.js jest włączony
3. Sprawdź uprawnienia plików (755 dla folderów, 644 dla plików)
4. Skontaktuj się z supportem GoDaddy w sprawie konfiguracji Node.js

## Kontakt

Email: stefano@stefanogroup.pl
Tel: 517-616-618