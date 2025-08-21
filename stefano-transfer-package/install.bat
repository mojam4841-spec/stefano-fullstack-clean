@echo off
echo 🚀 Instalacja Stefano Restaurant System
echo.

REM Sprawdzenie Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js nie jest zainstalowane
    echo Pobierz z: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js jest zainstalowane

REM Instalacja zależności  
echo 📦 Instalowanie zależności...
npm install

REM Sprawdzenie .env
if not exist .env (
    echo ⚠️ Brak pliku .env
    echo Kopiowanie przykładowego pliku...
    copy .env.example .env
    echo.
    echo 📝 Edytuj plik .env i skonfiguruj DATABASE_URL
    echo Następnie uruchom: npm run db:push
    echo.
) else (
    echo ✅ Plik .env istnieje
    echo 🗄️ Inicjalizacja bazy danych...
    npm run db:push
)

echo.
echo 🎉 Instalacja zakończona!
echo.
echo Aby uruchomić aplikację:
echo   npm run dev
echo.
echo Dostęp:
echo   Strona: http://localhost:5000
echo   Admin: http://localhost:5000/admin (hasło: stefano2025admin)
echo.
pause
