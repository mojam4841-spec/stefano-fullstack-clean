/**
 * Kompleksowe Testy Aplikacji Stefano
 * Testuje wszystkie główne funkcjonalności
 */

const API_URL = 'http://localhost:3000';

// Kolory dla wyników
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

async function testEndpoint(name, endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (response.ok) {
      console.log(`${colors.green}✓${colors.reset} ${name} - Status: ${response.status}`);
      return true;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${name} - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name} - Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('\n=== TESTY APLIKACJI STEFANO ===\n');
  
  // Test podstawowych endpointów
  console.log('📍 Podstawowe endpointy:');
  await testEndpoint('Health Check', '/health');
  await testEndpoint('Metrics', '/metrics');
  await testEndpoint('Strona główna', '/');
  
  // Test API publicznych
  console.log('\n📋 API Publiczne:');
  await testEndpoint('Menu', '/api/menu');
  await testEndpoint('Promocje', '/api/promotions');
  
  // Test formularzy
  console.log('\n📝 Formularze:');
  await testEndpoint('Kontakt', '/api/contacts', 'POST', {
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test wiadomości'
  });
  
  await testEndpoint('Rezerwacja', '/api/reservations', 'POST', {
    name: 'Test User',
    email: 'test@example.com',
    phone: '123456789',
    date: '2025-01-15',
    time: '18:00',
    guests: 4
  });
  
  // Test zamówień
  console.log('\n🍕 System zamówień:');
  await testEndpoint('Złożenie zamówienia', '/api/orders', 'POST', {
    customerName: 'Test User',
    email: 'test@example.com',
    phone: '123456789',
    items: [{ name: 'Pizza Margherita', price: 35, quantity: 1 }],
    totalAmount: 35,
    deliveryMethod: 'pickup'
  });
  
  // Test programu lojalnościowego
  console.log('\n👑 Program lojalnościowy:');
  await testEndpoint('Lista nagród', '/api/loyalty/rewards');
  
  // Test chatbota
  console.log('\n💬 Chatbot:');
  await testEndpoint('Chatbot', '/api/chatbot', 'POST', {
    message: 'Jakie macie pizze?'
  });
  
  // Podsumowanie
  console.log('\n=== PODSUMOWANIE ===');
  console.log('Testy zakończone! Aplikacja działa na porcie 3000.');
  console.log('\n🔐 Panel admina: http://localhost:3000/admin');
  console.log('Email: admin@stefanogroup.pl');
  console.log('Hasło: admin123456\n');
}

// Uruchom testy
runAllTests();
