# Klucze API - Wymagania i Uprawnienia dla Stefano Restaurant

## 1. DeepSeek API Key (NOWA INTEGRACJA!)
**Zmienna:** `DEEPSEEK_API_KEY`
**Format:** `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Wymagane uprawnienia:
- **Chat Completions** - dla chatbota
- **Model access:** deepseek-chat

### Gdzie uzyskać:
1. Zarejestruj się na platform.deepseek.com
2. Idź do API Keys w panelu użytkownika
3. Utwórz nowy klucz z nazwą "Stefano Restaurant"
4. Doładuj konto (minimalne doładowanie: $5)
5. Koszt: około 10-20 zł/miesiąc przy normalnym użyciu

### Zalety DeepSeek nad OpenAI:
- **90% tańszy** - $0.14 za milion tokenów vs $3 u OpenAI
- **Lepsza znajomość języka polskiego**
- **Szybsze odpowiedzi** 
- **Bez limitów miesięcznych**

### Funkcje które aktywuje:
- Inteligentny chatbot znający menu w języku polskim
- Odpowiedzi na pytania o składniki, alergeny
- Rekomendacje dań na podstawie preferencji
- Obsługa rezerwacji i zamówień przez czat
- Informacje o promocjach i wydarzeniach

### Alternatywa - OpenAI API Key (opcjonalnie)
**Zmienna:** `OPENAI_API_KEY`
**Format:** `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Droższy ale stabilniejszy
- Koszt: około $20-30/miesiąc
- Można używać zamiast DeepSeek jeśli preferujesz

---

## 2. Stripe API Keys
**Zmienne:** `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`
**Format Secret:** `STRIPE_SK_PLACEHOLDER`
**Format Public:** `STRIPE_PK_PLACEHOLDER`

### Wymagane uprawnienia:
- **Payment Intents** - tworzenie płatności
- **Customers** - zarządzanie klientami
- **Products & Prices** - produkty i ceny
- **Webhooks** - powiadomienia o płatnościach
- **Subscriptions** - dla programu lojalnościowego

### Gdzie uzyskać:
1. Zarejestruj się na dashboard.stripe.com
2. Przejdź przez weryfikację biznesową
3. W Developers > API Keys skopiuj klucze
4. Skonfiguruj webhook dla events

### Wymagane webhook events:
```json
[
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "customer.created",
  "invoice.payment_succeeded",
  "customer.subscription.created"
]
```

### URL webhook: 
`https://stefanogroup.pl/api/stripe/webhook`

### Funkcje które aktywuje:
- Płatności kartą online
- BLIK i przelewy
- Automatyczne faktury
- Obsługa zwrotów
- Subskrypcje premium

---

## 3. SendGrid API Key
**Zmienna:** `SENDGRID_API_KEY`
**Format:** `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Wymagane uprawnienia:
- **Mail Send** - wysyłanie emaili
- **Marketing Campaigns** - newsletter
- **Contacts** - zarządzanie listą
- **Templates** - szablony emaili
- **Suppressions** - zarządzanie wypisami

### Gdzie uzyskać:
1. Zarejestruj się na sendgrid.com
2. Zweryfikuj domenę stefanogroup.pl
3. W Settings > API Keys utwórz klucz
4. Ustaw uprawnienia Full Access lub Restricted

### Wymagana konfiguracja domeny:
```dns
# DNS Records dla stefanogroup.pl
CNAME s1._domainkey -> s1.domainkey.u12345.wl123.sendgrid.net
CNAME s2._domainkey -> s2.domainkey.u12345.wl123.sendgrid.net
```

### Funkcje które aktywuje:
- Potwierdzenia zamówień email
- Newsletter automatyczny
- Powiadomienia o statusie zamówienia
- Ankiety satysfakcji
- Kampanie marketingowe

---

## 4. Google Analytics Measurement ID
**Zmienna:** `VITE_GA_MEASUREMENT_ID`
**Format:** `G-XXXXXXXXXX`

### Wymagane uprawnienia:
- **Enhanced Ecommerce** - śledzenie sprzedaży
- **Custom Events** - wydarzenia niestandardowe
- **Audience** - segmentacja użytkowników
- **Goals & Conversions** - cele konwersji

### Gdzie uzyskać:
1. Zarejestruj się na analytics.google.com
2. Utwórz właściwość dla stefanogroup.pl
3. Skonfiguruj Enhanced Ecommerce
4. Skopiuj Measurement ID

### Wymagana konfiguracja:
```javascript
// Enhanced Ecommerce Events
'purchase', 'add_to_cart', 'view_item', 
'begin_checkout', 'add_payment_info'
```

### Funkcje które aktywuje:
- Śledzenie ruchu na stronie
- Analiza ścieżek użytkowników
- Raporty sprzedaży
- Segmentacja klientów
- ROI kampanii marketingowych

---

## 5. Google Search Console (Opcjonalny)
**Weryfikacja:** stefanogroup.pl

### Wymagane uprawnienia:
- **Property Owner** - pełen dostęp
- **Submit Sitemap** - przesyłanie mapy strony
- **URL Inspection** - inspekcja URL

### Konfiguracja:
1. Dodaj właściwość stefanogroup.pl
2. Zweryfikuj przez DNS lub meta tag
3. Prześlij sitemap.xml
4. Skonfiguruj alerty

---

## BEZPIECZEŃSTWO I LIMITY

### Rate Limits (zalecane):
```json
{
  "openai": "500 req/min",
  "stripe": "100 req/sec", 
  "sendgrid": "10000 emails/day",
  "google_analytics": "unlimited"
}
```

### Zmienne środowiskowe (.env):
```bash
# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx

# Stripe  
STRIPE_SECRET_KEY=STRIPE_SK_PLACEHOLDER
VITE_STRIPE_PUBLIC_KEY=STRIPE_PK_PLACEHOLDER
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@stefanogroup.pl

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Dodatkowe
DOMAIN_URL=https://stefanogroup.pl
WEBHOOK_SECRET=stefano_webhook_secret_2025
```

### Monitoring i alerty:
- Ustaw alerty przy 80% limitu API
- Monitoruj koszty w dashboardach
- Backup klucze w bezpiecznym miejscu
- Rotacja kluczy co 90 dni

### Koszty miesięczne (szacunkowe):
- OpenAI: $15-30
- Stripe: 2.9% + 30gr od transakcji
- SendGrid: $0-15 (do 10k emaili)
- Google Analytics: Darmowe
- **ŁĄCZNIE: ~$30-45/miesiąc + prowizje**

## KOLEJNOŚĆ IMPLEMENTACJI:

1. **Google Analytics** (darmowe, podstawowe śledzenie)
2. **SendGrid** (newsletter i powiadomienia)
3. **Stripe** (płatności online)
4. **OpenAI** (zaawansowany chatbot)

System działa w 90% bez kluczy API, więc możesz dodawać je stopniowo.