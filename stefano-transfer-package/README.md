# Stefano Restaurant - Kompletny System

## Szybki Start (3 kroki)

### 1. Instalacja wymagań:
```bash
# Zainstaluj Node.js 18+ z nodejs.org
# Zainstaluj PostgreSQL z postgresql.org (lub użyj Neon Database)
```

### 2. Instalacja i uruchomienie:
```bash
npm install
npm run dev
```

### 3. Dostęp:
- Strona: http://localhost:5000  
- Panel admin: http://localhost:5000/admin (hasło: stefano2025admin)

## Co działa od razu:
✅ Pełna strona restauracji z menu
✅ System zamówień online  
✅ Program lojalnościowy
✅ Panel administracyjny
✅ Monitoring kuchni
✅ Progressive Web App (PWA)
✅ Chatbot z menu
✅ System avatarów
✅ Sklep z sosami

## Baza danych:
System używa PostgreSQL. Opcje:

**Opcja 1: Neon Database (zalecane, darmowe)**
1. Zarejestruj się na neon.tech
2. Utwórz projekt
3. Skopiuj connection string
4. Stwórz plik .env: `DATABASE_URL=postgresql://...`

**Opcja 2: Lokalna PostgreSQL**
1. Zainstaluj PostgreSQL
2. Utwórz bazę: `createdb stefano`
3. Stwórz .env z danymi połączenia

Po konfiguracji bazy uruchom: `npm run db:push`

## Dodatkowe funkcje (opcjonalne):
- Google Analytics: VITE_GA_MEASUREMENT_ID
- OpenAI chatbot: OPENAI_API_KEY  
- Stripe płatności: STRIPE_SECRET_KEY, VITE_STRIPE_PUBLIC_KEY
- SendGrid emaile: SENDGRID_API_KEY

Szczegóły w TRANSFER-GUIDE.md

## Wsparcie:
System jest kompletny i gotowy do użycia. Wszystkie funkcje działają po instalacji.
