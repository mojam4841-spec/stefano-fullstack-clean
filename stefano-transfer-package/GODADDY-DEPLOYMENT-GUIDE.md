# 🚀 Kompletna Instrukcja Wdrożenia - stefanogroup.pl na GoDaddy

## 📋 Przegląd Wersji

### 1. **Wersja Poprzednia** (Podstawowa strona restauracji)
- Statyczna strona HTML/CSS/JS
- Podstawowe menu, kontakt, rezerwacje
- Bez systemu zarządzania

### 2. **Wersja Obecna** (Zaawansowana aplikacja)
- Pełny system zarządzania restauracją
- Program lojalnościowy z punktami
- Monitoring kuchni w czasie rzeczywistym
- Płatności online z Stripe
- Automatyczna baza klientów
- Panel administracyjny AI

### 3. **Aplikacja Mobilna** (PWA)
- Progressive Web App
- Instalowalna na telefonie
- Powiadomienia push
- Offline functionality

---

## 🛠️ Krok 1: Przygotowanie Plików

### A. Pobieranie Plików Produkcyjnych

```bash
# Budowanie wersji produkcyjnej
npm run build

# Tworzenie archiwum
zip -r stefano-production-v2.zip dist/ .htaccess robots.txt sitemap.xml
```

### B. Struktura Plików do Wgrania

```
public_html/
├── index.html              # Strona główna
├── assets/                 # Pliki JS, CSS, obrazy
│   ├── index-[hash].js     # Główna aplikacja
│   ├── index-[hash].css    # Style
│   └── logo-[hash].png     # Logo Stefano
├── .htaccess              # Konfiguracja Apache
├── robots.txt             # SEO
├── sitemap.xml            # Mapa strony
├── manifest.json          # PWA
└── sw.js                  # Service Worker
```

---

## 🌐 Krok 2: Konfiguracja Domeny stefanogroup.pl

### A. Panel GoDaddy - Zarządzanie Domeną

1. **Zaloguj się do GoDaddy**
   - Przejdź na https://godaddy.com
   - Zaloguj się na swoje konto

2. **Znajdź Domenę**
   - Kliknij "My Products" 
   - Znajdź domenę "stefanogroup.pl"
   - Kliknij "Manage"

3. **Konfiguracja DNS**
   ```
   Type: A Record
   Name: @
   Value: [IP serwera GoDaddy]
   TTL: 1 Hour
   
   Type: CNAME
   Name: www
   Value: stefanogroup.pl
   TTL: 1 Hour
   ```

### B. Weryfikacja Domeny

```bash
# Sprawdzenie DNS
nslookup stefanogroup.pl
dig stefanogroup.pl

# Sprawdzenie propagacji
ping stefanogroup.pl
```

---

## 📁 Krok 3: Upload Plików na Serwer

### A. Metoda 1: File Manager (Zalecana)

1. **Panel cPanel**
   - Zaloguj się do cPanel GoDaddy
   - Znajdź "File Manager"
   - Przejdź do folderu "public_html"

2. **Upload Plików**
   - Usuń domyślne pliki (index.html, coming-soon.html)
   - Wgraj archiwum stefano-production-v2.zip
   - Rozpakuj archiwum
   - Ustaw uprawnienia 755 dla folderów, 644 dla plików

### B. Metoda 2: FTP

```bash
# Dane FTP z panelu GoDaddy
Host: ftp.stefanogroup.pl
Username: [twoja_nazwa_użytkownika]
Password: [twoje_hasło]
Port: 21

# Upload za pomocą FileZilla lub WinSCP
```

---

## ⚙️ Krok 4: Konfiguracja .htaccess

Upewnij się, że plik `.htaccess` zawiera:

```apache
# Security Headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# GZIP Compression
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
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# SPA Routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

## 🗄️ Krok 5: Konfiguracja Bazy Danych

### A. Tworzenie Bazy w cPanel

1. **MySQL Databases**
   - Nazwa bazy: `stefano_main`
   - Użytkownik: `stefano_user`
   - Hasło: [silne hasło]

2. **Uprawnienia**
   - Przypisz użytkownika do bazy
   - Nadaj wszystkie uprawnienia

### B. Zmienne Środowiskowe

Utwórz plik `.env` (nie uploaduj na serwer):
```env
# Database
DATABASE_URL=mysql://stefano_user:hasło@localhost/stefano_main

# Stripe (opcjonalnie)
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# SendGrid (opcjonalnie)
SENDGRID_API_KEY=SG....

# Google Analytics (opcjonalnie)
VITE_GA_MEASUREMENT_ID=G-...
```

---

## 📧 Krok 6: Konfiguracja Email

### A. Email Accounts w cPanel

```
info@stefanogroup.pl     # Główny email
zamowienia@stefanogroup.pl  # Zamówienia
rezerwacje@stefanogroup.pl  # Rezerwacje
admin@stefanogroup.pl    # Administracja
```

### B. Przekierowania Email

```
contact@stefanogroup.pl → info@stefanogroup.pl
hello@stefanogroup.pl → info@stefanogroup.pl
support@stefanogroup.pl → admin@stefanogroup.pl
```

---

## 🔐 Krok 7: SSL i Bezpieczeństwo

### A. SSL Certificate

1. **W panelu GoDaddy**
   - Przejdź do "SSL Certificates"
   - Wybierz "Free SSL Certificate"
   - Aktywuj dla stefanogroup.pl

2. **Przekierowanie HTTPS**
   ```apache
   # W .htaccess
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

### B. Dodatkowe Zabezpieczenia

```apache
# Blokowanie dostępu do wrażliwych plików
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.log">
    Order allow,deny
    Deny from all
</Files>
```

---

## 📱 Krok 8: PWA - Aplikacja Mobilna

### A. Manifest.json

```json
{
  "name": "Stefano Restaurant & Pub",
  "short_name": "Stefano",
  "description": "Restauracja i Pub w Bełchatowie",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#dc2626",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### B. Service Worker

Upewnij się, że `sw.js` jest w katalogu głównym.

---

## 🧪 Krok 9: Testowanie

### A. Checklist Testów

- [ ] Strona ładuje się na stefanogroup.pl
- [ ] HTTPS działa poprawnie
- [ ] Wszystkie sekcje wyświetlają się prawidłowo
- [ ] Formularz kontaktowy działa
- [ ] System rezerwacji działa
- [ ] Menu wyświetla się poprawnie
- [ ] Chatbot odpowiada
- [ ] PWA można zainstalować na telefonie

### B. Narzędzia Testowe

```bash
# Sprawdzenie szybkości
https://pagespeed.web.dev/

# Sprawdzenie SEO
https://search.google.com/test/mobile-friendly

# Sprawdzenie SSL
https://www.ssllabs.com/ssltest/
```

---

## 🔧 Krok 10: Optymalizacja Wydajności

### A. Ustawienia PHP (w cPanel)

```php
# php.ini
memory_limit = 256M
max_execution_time = 300
upload_max_filesize = 64M
post_max_size = 64M
```

### B. Optymalizacja Obrazów

```bash
# Kompresja obrazów przed uploadem
jpegoptim --max=85 *.jpg
optipng -o2 *.png
```

---

## 📊 Krok 11: Monitorowanie

### A. Google Analytics

1. Utwórz konto GA4
2. Dodaj kod śledzenia
3. Skonfiguruj cele konwersji

### B. Google Search Console

1. Zweryfikuj właścicielstwo domeny
2. Prześlij sitemap.xml
3. Monitoruj indeksowanie

---

## 🚨 Rozwiązywanie Problemów

### A. Częste Problemy

| Problem | Rozwiązanie |
|---------|-------------|
| Strona nie ładuje się | Sprawdź DNS, SSL, uprawnienia plików |
| 404 błędy | Sprawdź .htaccess, routing SPA |
| Wolne ładowanie | Włącz GZIP, optymalizuj obrazy |
| Formularz nie działa | Sprawdź konfigurację email |

### B. Logi Błędów

```bash
# Lokalizacja logów w cPanel
/public_html/error_logs/
```

---

## 📞 Wsparcie

### A. Kontakt GoDaddy
- Telefon: +1 (480) 505-8877
- Chat: https://godaddy.com/help
- Email: Przez panel pomocy

### B. Przydatne Linki
- Panel GoDaddy: https://account.godaddy.com
- cPanel: https://stefanogroup.pl:2083
- Webmail: https://stefanogroup.pl/webmail

---

## ✅ Checklist Finalizacji

- [ ] Domena wskazuje na prawidłowy serwer
- [ ] SSL certificate jest aktywne
- [ ] Wszystkie pliki są wgrane
- [ ] .htaccess jest skonfigurowany
- [ ] Baza danych jest połączona
- [ ] Email accounts są utworzone
- [ ] PWA można zainstalować
- [ ] Google Analytics działa
- [ ] Sitemap jest przesłany
- [ ] Strona działa na wszystkich urządzeniach

**🎉 Gratulacje! Twoja strona stefanogroup.pl jest gotowa do użycia!**

---

*Dokumentacja utworzona: 26 czerwca 2025*
*Wersja: 2.0 - Pełna aplikacja restauracyjna*