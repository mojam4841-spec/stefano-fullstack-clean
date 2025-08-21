#!/bin/bash

echo "=============================================="
echo "   STEFANO RESTAURANT - AUTOSTART MAC/LINUX"
echo "=============================================="
echo ""
echo "Sprawdzanie Node.js..."

if ! command -v node &> /dev/null; then
    echo "BŁĄD: Node.js nie jest zainstalowany!"
    echo ""
    echo "Zainstaluj Node.js:"
    echo "- macOS: brew install node"
    echo "- Ubuntu/Debian: sudo apt install nodejs npm"
    echo "- Lub pobierz z: https://nodejs.org"
    echo ""
    exit 1
fi

echo "Node.js znaleziony: $(node --version)"

echo ""
echo "Instalowanie zależności..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "BŁĄD podczas instalacji zależności!"
    echo "Spróbuj uruchomić ręcznie: npm install"
    echo ""
    exit 1
fi

echo ""
echo "=============================================="
echo "   URUCHAMIANIE STEFANO RESTAURANT"
echo "=============================================="
echo ""
echo "Strona będzie dostępna pod:"
echo "http://localhost:5000"
echo ""
echo "Panel administracyjny:"
echo "http://localhost:5000/admin"
echo "Hasło: stefano2025admin"
echo ""
echo "Naciśnij Ctrl+C aby zatrzymać serwer"
echo ""

# Próba otwarcia przeglądarki
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:5000
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:5000
fi

npm run dev