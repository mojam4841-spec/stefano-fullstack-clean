import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Custom metrics
const errorRate = new Rate('errors');
const orderSuccessRate = new Rate('order_success');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 500 }, // Ramp up to 500 users
    { duration: '5m', target: 500 }, // Stay at 500 users
    { duration: '2m', target: 1000 }, // Ramp up to 1000 users
    { duration: '5m', target: 1000 }, // Stay at 1000 users
    { duration: '5m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.05'], // Error rate under 5%
    errors: ['rate<0.05'], // Custom error rate under 5%
    order_success: ['rate>0.95'], // Order success rate above 95%
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://staging.stefanogroup.pl';

// Test scenarios
export default function () {
  // Scenario 1: Browse menu (70% of traffic)
  if (Math.random() < 0.7) {
    browseMenu();
  }
  // Scenario 2: Place order (20% of traffic)
  else if (Math.random() < 0.9) {
    placeOrder();
  }
  // Scenario 3: Check loyalty points (10% of traffic)
  else {
    checkLoyalty();
  }
  
  sleep(Math.random() * 3 + 1); // Random think time between 1-4 seconds
}

function browseMenu() {
  // Load homepage
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads quickly': (r) => r.timings.duration < 2000,
  });
  errorRate.add(res.status !== 200);
  
  sleep(1);
  
  // Load menu
  res = http.get(`${BASE_URL}/api/v1/menu`);
  check(res, {
    'menu API status is 200': (r) => r.status === 200,
    'menu API responds quickly': (r) => r.timings.duration < 200,
    'menu has items': (r) => JSON.parse(r.body).items?.length > 0,
  });
  errorRate.add(res.status !== 200);
}

function placeOrder() {
  // Get menu first
  let res = http.get(`${BASE_URL}/api/v1/menu`);
  if (res.status !== 200) {
    errorRate.add(1);
    return;
  }
  
  const menu = JSON.parse(res.body);
  const randomItem = menu.items[Math.floor(Math.random() * menu.items.length)];
  
  // Place order
  const orderPayload = {
    customerName: `Test User ${__VU}`,
    customerPhone: `500${Math.floor(Math.random() * 1000000)}`,
    customerEmail: `test${__VU}@example.com`,
    items: JSON.stringify([{ 
      id: randomItem.id, 
      name: randomItem.name, 
      price: randomItem.price, 
      quantity: 1 
    }]),
    totalAmount: randomItem.price,
    paymentMethod: 'cash',
    deliveryAddress: 'ul. Testowa 123',
  };
  
  res = http.post(`${BASE_URL}/api/v1/orders`, JSON.stringify(orderPayload), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const success = check(res, {
    'order created': (r) => r.status === 201 || r.status === 200,
    'order has ID': (r) => JSON.parse(r.body).id !== undefined,
    'order processed quickly': (r) => r.timings.duration < 3000,
  });
  
  orderSuccessRate.add(success);
  errorRate.add(!success);
}

function checkLoyalty() {
  // Simulate logged-in user
  const authToken = authenticateUser();
  if (!authToken) {
    errorRate.add(1);
    return;
  }
  
  // Check loyalty points
  const res = http.get(`${BASE_URL}/api/v1/loyalty/points`, {
    headers: { 'Authorization': `Bearer ${authToken}` },
  });
  
  check(res, {
    'loyalty API status is 200': (r) => r.status === 200,
    'loyalty API responds quickly': (r) => r.timings.duration < 300,
    'points data returned': (r) => JSON.parse(r.body).points !== undefined,
  });
  
  errorRate.add(res.status !== 200);
}

function authenticateUser() {
  const res = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: `loadtest${__VU % 100}@stefano.pl`,
    password: 'testpassword123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (res.status === 200) {
    return JSON.parse(res.body).token;
  }
  return null;
}

// Generate HTML report
export function handleSummary(data) {
  return {
    "performance-report.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}