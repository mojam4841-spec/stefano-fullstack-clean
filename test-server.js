import http from 'http';

// Test if port 3000 is accessible
http.get('http://localhost:3000', (res) => {
  console.log('✅ Serwer odpowiada na porcie 3000');
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers['content-type']);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('<!DOCTYPE html>') || data.includes('Stefano')) {
      console.log('✅ Aplikacja Stefano działa poprawnie!');
      console.log('\n🌐 OTWÓRZ W PRZEGLĄDARCE:');
      console.log('1. Kliknij przycisk "Open in new tab" w prawym górnym rogu Webview');
      console.log('2. Lub skopiuj link: http://localhost:3000');
      console.log('\n📱 GŁÓWNE STRONY:');
      console.log('- Strona główna: http://localhost:3000');
      console.log('- Panel admina: http://localhost:3000/admin');
      console.log('- Zamówienia: http://localhost:3000/order');
    } else {
      console.log('⚠️ Serwer odpowiada ale strona może się nie ładować');
      console.log('Pierwsze 200 znaków odpowiedzi:', data.substring(0, 200));
    }
  });
}).on('error', (err) => {
  console.log('❌ Nie mogę połączyć się z serwerem:', err.message);
  console.log('Sprawdź czy aplikacja działa na porcie 3000');
});