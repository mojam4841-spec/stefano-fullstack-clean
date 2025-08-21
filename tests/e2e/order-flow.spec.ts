import { test, expect } from '@playwright/test';

test.describe('Order Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000');
  });

  test('complete order flow from menu to confirmation', async ({ page }) => {
    // Navigate to menu
    await page.click('text=Menu');
    await page.waitForSelector('.menu-categories');

    // Select pizza
    await page.click('text=Pizza');
    await page.click('text=Margherita');
    await page.click('button:has-text("Dodaj do koszyka")');

    // Go to cart
    await page.click('text=Koszyk (1)');
    
    // Fill order form
    await page.fill('input[name="customerName"]', 'Test Customer');
    await page.fill('input[name="customerPhone"]', '500600700');
    await page.fill('input[name="customerEmail"]', 'test@example.com');
    await page.fill('input[name="deliveryAddress"]', 'ul. Testowa 123');
    
    // Select payment method
    await page.click('input[value="card"]');
    
    // Submit order
    await page.click('button:has-text("Złóż zamówienie")');
    
    // Verify confirmation
    await expect(page.locator('text=Zamówienie zostało złożone')).toBeVisible();
    await expect(page.locator('text=Test Customer')).toBeVisible();
  });

  test('mobile responsive order flow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.click('[aria-label="Menu"]');
    
    // Navigate and verify mobile UI
    await page.click('text=Zamów online');
    await expect(page.locator('.mobile-menu')).toBeVisible();
  });

  test('loyalty program integration', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:5000/login');
    await page.fill('input[name="email"]', 'test@stefano.pl');
    await page.fill('input[name="password"]', 'test123456');
    await page.click('button:has-text("Zaloguj")');
    
    // Navigate to loyalty program
    await page.click('text=Program lojalnościowy');
    
    // Verify points display
    await expect(page.locator('text=Twoje punkty')).toBeVisible();
    
    // Try to redeem reward
    await page.click('text=Wymień punkty');
    await page.click('text=Darmowa kawa');
    await page.click('button:has-text("Wymień")');
    
    // Verify redemption
    await expect(page.locator('text=Nagroda wymieniona')).toBeVisible();
  });

  test('error handling and recovery', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/orders', route => route.abort());
    
    // Try to submit order
    await page.goto('http://localhost:5000/order');
    await page.fill('input[name="customerName"]', 'Test');
    await page.click('button:has-text("Złóż zamówienie")');
    
    // Verify error message
    await expect(page.locator('text=Wystąpił błąd')).toBeVisible();
    
    // Verify retry button
    await expect(page.locator('button:has-text("Spróbuj ponownie")'));
  });
});