# Przewodnik Przeniesienia Strony Stefano na Inny Komputer

## Wymagania Systemowe

### Minimalne wymagania:
- Node.js 18+ (zalecane 20+)
- PostgreSQL 13+ lub dostęp do bazy danych
- 4GB RAM
- 2GB miejsca na dysku
- Połączenie internetowe

## Kroki Przeniesienia

### 1. Pobierz wszystkie pliki
```bash
# Pobierz całą zawartość projektu
git clone [repository-url] stefano-restaurant
# LUB skopiuj wszystkie pliki z tego projektu
```

### 2. Instalacja środowiska

#### Windows:
```bash
# Pobierz i zainstaluj Node.js z nodejs.org
# Pobierz i zainstaluj PostgreSQL z postgresql.org
```

#### macOS:
```bash
brew install node
brew install postgresql
```

#### Linux:
```bash
sudo apt update
sudo apt install nodejs npm postgresql
```

### 3. Instalacja zależności
```bash
cd stefano-restaurant
npm install
```

### 4. Konfiguracja bazy danych

#### Opcja A: Lokalna PostgreSQL
```bash
# Utwórz bazę danych
createdb stefano_restaurant

# Utwórz zmienne środowiskowe (.env)
echo "DATABASE_URL=postgresql://username:password@localhost:5432/stefano_restaurant" > .env
echo "PGHOST=localhost" >> .env
echo "PGPORT=5432" >> .env
echo "PGUSER=username" >> .env
echo "PGPASSWORD=password" >> .env
echo "PGDATABASE=stefano_restaurant" >> .env
```

#### Opcja B: Neon Database (zalecane)
```bash
# Zarejestruj się na neon.tech
# Skopiuj connection string
echo "DATABASE_URL=postgresql://[user]:[password]@[host]/[database]" > .env
```

### 5. Inicjalizacja bazy danych
```bash
npm run db:push
```

### 6. Uruchomienie aplikacji
```bash
npm run dev
```

### 7. Dostęp do panelu administracyjnego
- URL: http://localhost:5000/admin
- Hasło: stefano2025admin

## Funkcje Dostępne Po Przeniesieniu

### ✅ Będzie działać w pełni:
- Strona główna z menu i promocjami
- System zamówień online
- Program lojalnościowy
- Panel administracyjny
- Monitoring kuchni
- System rezerwacji
- Chatbot z menu
- Progressive Web App (PWA)
- Wszystkie avatary i promocje
- System sosów w sklepie
- WhatsApp integration

### ⚠️ Wymaga konfiguracji kluczy API:
- Google Analytics (VITE_GA_MEASUREMENT_ID)
- OpenAI dla chatbota (OPENAI_API_KEY)
- SendGrid dla emaili (SENDGRID_API_KEY)
- Stripe dla płatności (STRIPE_SECRET_KEY, VITE_STRIPE_PUBLIC_KEY)

## Konfiguracja Kluczy API (Opcjonalne)

### Google Analytics
1. Idź do analytics.google.com
2. Utwórz właściwość dla stefanogroup.pl
3. Skopiuj Measurement ID (G-XXXXXXXXXX)
4. Dodaj do .env: `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

### OpenAI (dla chatbota)
1. Zarejestruj się na platform.openai.com
2. Utwórz API key
3. Dodaj do .env: `OPENAI_API_KEY=sk-xxxxxxxxxx`

### Stripe (dla płatności)
1. Zarejestruj się na dashboard.stripe.com
2. Skopiuj klucze API
3. Dodaj do .env:
   ```
   STRIPE_SECRET_KEY=STRIPE_SK_PLACEHOLDER
   VITE_STRIPE_PUBLIC_KEY=STRIPE_PK_PLACEHOLDER
   ```

### SendGrid (dla emaili)
1. Zarejestruj się na sendgrid.com
2. Utwórz API key
3. Dodaj do .env: `SENDGRID_API_KEY=SG.xxxxxxxxxx`

## Struktura Projektu

```
stefano-restaurant/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Komponenty UI
│   │   ├── pages/         # Strony aplikacji
│   │   └── main.tsx       # Punkt wejścia
├── server/                # Backend Express
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Logika bazy danych
│   └── index.ts           # Serwer
├── shared/                # Wspólne typy
│   └── schema.ts          # Schema bazy danych
├── package.json           # Zależności
└── README.md             # Dokumentacja
```

## Porty i Dostęp

- **Aplikacja**: http://localhost:5000
- **Panel admin**: http://localhost:5000/admin
- **API**: http://localhost:5000/api/*

## Rozwiązywanie Problemów

### Problem: Błąd bazy danych
```bash
# Sprawdź connection string
echo $DATABASE_URL

# Zresetuj bazę danych
npm run db:push
```

### Problem: Brak modułów
```bash
# Reinstaluj zależności
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port zajęty
```bash
# Zmień port w package.json lub zabij proces
lsof -ti:5000 | xargs kill -9
```

## Backup i Restore Danych

### Backup bazy danych
```bash
pg_dump $DATABASE_URL > stefano_backup.sql
```

### Restore bazy danych
```bash
psql $DATABASE_URL < stefano_backup.sql
```

## Dodatkowe Informacje

### Dane testowe
System automatycznie tworzy przykładowe dane:
- Członkowie programu lojalnościowego
- Przykładowe zamówienia
- Nagrody i promocje

### Konfiguracja produkcyjna
Dla wdrożenia produkcyjnego:
1. Ustaw NODE_ENV=production
2. Skonfiguruj HTTPS
3. Użyj PM2 dla zarządzania procesem
4. Skonfiguruj nginx jako reverse proxy

## Kontakt i Wsparcie

W przypadku problemów:
1. Sprawdź logi w konsoli: `npm run dev`
2. Sprawdź status bazy danych
3. Upewnij się, że wszystkie zmienne środowiskowe są ustawione

System został zaprojektowany jako kompletne rozwiązanie i będzie działać w pełni po prawidłowym przeniesieniu.