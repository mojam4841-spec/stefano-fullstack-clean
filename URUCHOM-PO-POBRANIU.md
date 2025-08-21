# 🚀 JAK URUCHOMIĆ STRONĘ PO POBRANIU ZIP

## 📦 **Po pobraniu stefano-website-complete.zip**

---

## **KROK 1: Rozpakuj plik**

### Windows:
1. **Prawoklik** na `stefano-website-complete.zip`
2. **Wybierz "Wyodrębnij wszystko"** lub "Extract All"
3. **Wybierz folder docelowy** (np. Pulpit)
4. **Kliknij "Wyodrębnij"**

### Mac:
1. **Kliknij dwukrotnie** na `stefano-website-complete.zip`
2. **Plik zostanie automatycznie rozpakowany**

### Linux:
```bash
unzip stefano-website-complete.zip
cd stefano-website-complete
```

---

## **KROK 2: Otwórz folder**

1. **Przejdź do folderu** `stefano-website-complete`
2. **Powinieneś zobaczyć pliki:**
   - `package.json`
   - `client/` (folder)
   - `server/` (folder)
   - `start-production.sh`
   - `docker-compose.yml`
   - i wiele innych...

---

## **KROK 3: Wybierz metodę uruchomienia**

### 🚀 **METODA A: Automatyczna (NAJŁATWIEJSZA)**

**Windows:**
1. **Otwórz PowerShell** w folderze projektu
2. **Uruchom:** `./start-production.sh`

**Mac/Linux:**
```bash
# Przejdź do folderu
cd stefano-website-complete

# Uruchom automatyczny deployment
./start-production.sh
```

### 🐳 **METODA B: Docker (ZALECANA)**

**Jeśli masz Docker:**
```bash
# Uruchom z Docker Compose
docker-compose up -d

# Sprawdź status
docker-compose ps
```

**Jeśli nie masz Docker:**
```bash
# Zainstaluj Docker automatycznie
./scripts/install-docker.sh

# Następnie uruchom
docker-compose up -d
```

### 💻 **METODA C: Bezpośrednio Node.js**

**Wymaga Node.js 18+ i PostgreSQL:**
```bash
# 1. Zainstaluj zależności
npm install

# 2. Uruchom bazę danych (PostgreSQL)
# Musisz mieć PostgreSQL zainstalowany lokalnie

# 3. Ustaw zmienne środowiskowe
cp .env.production.example .env.production
# Edytuj .env.production z danymi bazy

# 4. Uruchom development
npm run dev

# LUB zbuduj production
npm run build
```

---

## **KROK 4: Sprawdź czy działa**

### **Otwórz w przeglądarce:**
- **Strona główna:** http://localhost:5000
- **Panel admina:** http://localhost:5000/admin
- **API health:** http://localhost:5000/api/health

### **Jeśli używasz Docker:**
- **Strona główna:** https://localhost
- **Panel admina:** https://localhost/admin
- **Health check:** http://localhost:8080/api/health

---

## **KROK 5: Konfiguracja (opcjonalna)**

### **Panel administratora:**
- **URL:** `/admin`
- **Hasło:** `stefano2025admin`
- **ZMIEŃ HASŁO** po pierwszym logowaniu!

### **Baza danych:**
- **PostgreSQL** wymagany
- **Schema** automatycznie utworzony
- **Dane demo** załadowane

### **Płatności (opcjonalne):**
- **Stripe** - dodaj klucze API w panelu admin
- **BLIK** - gotowy do konfiguracji
- **WhatsApp** - numer 51616618 skonfigurowany

---

## **❓ PROBLEMY I ROZWIĄZANIA:**

### **Problem: "npm command not found"**
**Rozwiązanie:**
1. **Zainstaluj Node.js** z https://nodejs.org
2. **Restart terminala**
3. **Sprawdź:** `node --version`

### **Problem: "Docker command not found"**
**Rozwiązanie:**
```bash
# Ubuntu/Debian
sudo apt install docker.io docker-compose

# Windows/Mac
# Pobierz Docker Desktop z docker.com
```

### **Problem: Port 5000 zajęty**
**Rozwiązanie:**
```bash
# Znajdź co używa portu
sudo lsof -i :5000

# Zabij proces
sudo kill -9 [PID]

# Lub zmień port w package.json
```

### **Problem: Baza danych nie działa**
**Rozwiązanie:**
```bash
# Sprawdź czy PostgreSQL działa
sudo systemctl status postgresql

# Uruchom PostgreSQL
sudo systemctl start postgresql

# Lub użyj Docker z bazą
docker-compose up postgres -d
```

### **Problem: Brak uprawnień (Linux/Mac)**
**Rozwiązanie:**
```bash
# Dodaj uprawnienia wykonywania
chmod +x start-production.sh
chmod +x scripts/*.sh

# Uruchom ponownie
./start-production.sh
```

---

## **⚡ SZYBKI START - KOMENDY**

### **Dla Windows (PowerShell):**
```powershell
# Rozpakuj ZIP na Pulpit
# Otwórz PowerShell w folderze
cd Desktop\stefano-website-complete
npm install
npm run dev
# Otwórz: http://localhost:5000
```

### **Dla Mac/Linux:**
```bash
# Rozpakuj i przejdź do folderu
cd stefano-website-complete

# Automatyczne uruchomienie
./start-production.sh

# Otwórz: https://localhost
```

### **Dla Docker (wszystkie systemy):**
```bash
cd stefano-website-complete
docker-compose up -d
# Otwórz: https://localhost
```

---

## **✅ SPRAWDŹ CZY WSZYSTKO DZIAŁA:**

### **Testy podstawowe:**
1. **Strona główna** - czy ładuje się menu i grafiki
2. **System zamówień** - czy można dodać produkt do koszyka
3. **Panel admina** - czy można się zalogować
4. **Chatbot** - czy odpowiada na pytania o menu
5. **PWA** - czy można zainstalować jako aplikację

### **Logi i diagnostyka:**
```bash
# Sprawdź logi aplikacji
npm run logs

# Lub w Docker
docker-compose logs -f

# Status wszystkich serwisów
make status
```

---

## **🎯 PO URUCHOMIENIU:**

**Masz pełną funkcjonalną stronę restauracji z:**
- ✅ **System zamówień** online
- ✅ **Panel administracyjny**
- ✅ **Program lojalnościowy**
- ✅ **Chatbot AI**
- ✅ **PWA** do instalacji
- ✅ **Płatności** Stripe/BLIK
- ✅ **WhatsApp** integration
- ✅ **Monitoring** i analytics

**Gotowe do użycia na stefanogroup.pl!**