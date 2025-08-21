#!/bin/bash
echo "🚀 Instalacja Stefano Restaurant System"
echo ""

# Sprawdzenie Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nie jest zainstalowane"
    echo "Pobierz z: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js: $(node --version)"

# Instalacja zależności
echo "📦 Instalowanie zależności..."
npm install

# Sprawdzenie bazy danych
if [ ! -f .env ]; then
    echo "⚠️  Brak pliku .env"
    echo "Skopiuj .env.example do .env i skonfiguruj bazę danych"
    cp .env.example .env
    echo ""
    echo "📝 Edytuj plik .env i skonfiguruj DATABASE_URL"
    echo "Następnie uruchom: npm run db:push"
    echo ""
else
    echo "✅ Plik .env istnieje"
    echo "🗄️  Inicjalizacja bazy danych..."
    npm run db:push
fi

echo ""
echo "🎉 Instalacja zakończona!"
echo ""
echo "Aby uruchomić aplikację:"
echo "  npm run dev"
echo ""
echo "Dostęp:"
echo "  Strona: http://localhost:5000"
echo "  Admin: http://localhost:5000/admin (hasło: stefano2025admin)"
