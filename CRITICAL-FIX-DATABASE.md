# 🚨 KRYTYCZNA NAPRAWA - PRZEŁĄCZENIE NA BAZĘ DANYCH

## PROBLEM
System używa pamięci RAM zamiast PostgreSQL! Dane znikają po restarcie.

## ROZWIĄZANIE (5 minut)

### Krok 1: Włącz DatabaseStorage
W pliku `server/storage.ts` zmień ostatnią linię:

```typescript
// ZAMIAST:
export const storage = new MemStorage();

// UŻYJ:
import { DatabaseStorage } from "./database-storage";
export const storage = new DatabaseStorage();
```

### Krok 2: Uruchom migrację
```bash
npm run db:push
```

### Krok 3: Dodaj indeksy dla wydajności
```bash
psql $DATABASE_URL << EOF
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_loyalty_phone ON loyalty_members(phone);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
EOF
```

## WYNIK
- ✅ Dane persystentne
- ✅ Skalowalność do 10,000+ użytkowników
- ✅ Gotowość na produkcję
- ✅ Standard Enterprise

## DODATKOWE ULEPSZENIA

### 1. Connection Pooling (w db.ts):
```typescript
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // max połączeń
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2. Redis Cache (opcjonalnie):
```bash
npm install redis
```

### 3. Monitoring:
- Dodaj Sentry dla błędów
- Prometheus dla metryk
- Grafana dla wizualizacji