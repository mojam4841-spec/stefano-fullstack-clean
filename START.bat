@echo off
echo ==============================================
echo    STEFANO RESTAURANT - AUTOSTART WINDOWS
echo ==============================================
echo.
echo Sprawdzanie Node.js...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo BŁĄD: Node.js nie jest zainstalowany!
    echo.
    echo Pobierz Node.js z: https://nodejs.org
    echo Po instalacji uruchom ponownie ten plik
    echo.
    pause
    exit /b 1
)

echo Node.js znaleziony: 
node --version

echo.
echo Instalowanie zależności...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo BŁĄD podczas instalacji zależności!
    echo Spróbuj uruchomić ręcznie: npm install
    echo.
    pause
    exit /b 1
)

echo.
echo ==============================================
echo   URUCHAMIANIE STEFANO RESTAURANT
echo ==============================================
echo.
echo Strona będzie dostępna pod:
echo http://localhost:5000
echo.
echo Panel administracyjny:
echo http://localhost:5000/admin
echo Hasło: stefano2025admin
echo.
echo Naciśnij Ctrl+C aby zatrzymać serwer
echo.

start http://localhost:5000

call npm run dev

pause