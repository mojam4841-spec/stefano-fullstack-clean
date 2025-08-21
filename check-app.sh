#!/bin/bash

echo -e "\n🔍 SPRAWDZAM APLIKACJĘ STEFANO\n"

# Test lokalny
echo "Test lokalny portu 3000:"
if curl -s -f -o /dev/null http://0.0.0.0:3000; then
    echo "✅ Aplikacja odpowiada na 0.0.0.0:3000"
elif curl -s -f -o /dev/null http://localhost:3000; then
    echo "✅ Aplikacja odpowiada na localhost:3000"
else
    echo "❌ Brak odpowiedzi na porcie 3000"
fi

echo -e "\n📱 ROZWIĄZANIE - JAK ZOBACZYĆ APLIKACJĘ:\n"
echo "1. W Replit kliknij przycisk 'New Tab' (➕) obok zakładki Console"
echo "2. Wybierz opcję 'Webview'"
echo "3. W nowym oknie webview:"
echo "   - Kliknij na pasek adresu"
echo "   - Wpisz dokładnie: http://0.0.0.0:3000"
echo "   - Naciśnij Enter"
echo
echo "4. ALTERNATYWA:"
echo "   - W górnym menu Replit kliknij Tools → Webview"
echo "   - Lub użyj skrótu: Cmd/Ctrl + Shift + P → wpisz 'webview'"
echo
echo "🔐 DOSTĘP DO PANELU ADMINA:"
echo "Po otwarciu aplikacji, dodaj /admin do adresu"
echo "Login: admin@stefanogroup.pl"
echo "Hasło: admin123456"
