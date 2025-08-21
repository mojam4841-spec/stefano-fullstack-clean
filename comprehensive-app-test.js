#!/usr/bin/env node

/**
 * Comprehensive Application Testing & Quality Assurance Suite
 * Tests all functionality and provides recommendations for production deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class StefanoAppTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: [],
      recommendations: []
    };
    this.baseUrl = 'http://localhost:5000';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async test(name, testFn) {
    try {
      this.log(`Testing: ${name}`, 'info');
      await testFn();
      this.results.passed++;
      this.log(`✓ ${name} - PASSED`, 'success');
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: name, error: error.message });
      this.log(`✗ ${name} - FAILED: ${error.message}`, 'error');
    }
  }

  // Test 1: Core Application Routes
  async testCoreRoutes() {
    const routes = [
      { path: '/', name: 'Homepage' },
      { path: '/order', name: 'Order Page' },
      { path: '/loyalty', name: 'Loyalty Program' },
      { path: '/admin', name: 'Admin Panel' }
    ];

    for (const route of routes) {
      await this.test(`Route ${route.path}`, async () => {
        const response = await fetch(`${this.baseUrl}${route.path}`);
        if (!response.ok) {
          throw new Error(`${route.name} returned ${response.status}`);
        }
        const html = await response.text();
        if (!html.includes('Stefano')) {
          throw new Error(`${route.name} doesn't contain brand name`);
        }
      });
    }
  }

  // Test 2: API Endpoints
  async testApiEndpoints() {
    const endpoints = [
      { path: '/api/contacts', method: 'GET', name: 'Contacts API' },
      { path: '/api/orders', method: 'GET', name: 'Orders API' },
      { path: '/api/reservations', method: 'GET', name: 'Reservations API' },
      { path: '/api/loyalty/members', method: 'GET', name: 'Loyalty Members API' },
      { path: '/api/rewards', method: 'GET', name: 'Rewards API' }
    ];

    for (const endpoint of endpoints) {
      await this.test(`API ${endpoint.method} ${endpoint.path}`, async () => {
        const response = await fetch(`${this.baseUrl}${endpoint.path}`);
        if (!response.ok) {
          throw new Error(`${endpoint.name} returned ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error(`${endpoint.name} doesn't return array`);
        }
      });
    }
  }

  // Test 3: Order Submission Flow
  async testOrderSubmission() {
    await this.test('Order Submission Flow', async () => {
      const orderData = {
        customerName: 'Test Customer',
        customerPhone: '+48123456789',
        customerEmail: 'test@stefano.pl',
        avatar: '🧙‍♂️',
        items: 'Pizza Margherita 42cm - 1x46zł',
        totalAmount: 4600, // 46 PLN in cents
        paymentMethod: 'cash',
        orderType: 'pickup'
      };

      const response = await fetch(`${this.baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Order submission failed: ${response.status}`);
      }

      const result = await response.json();
      if (!result.id) {
        throw new Error('Order doesn\'t return ID');
      }
    });
  }

  // Test 4: Database Schema Validation
  async testDatabaseSchema() {
    await this.test('Database Schema Validation', async () => {
      // Test that we can fetch data without errors
      const response = await fetch(`${this.baseUrl}/api/orders`);
      if (!response.ok) {
        throw new Error('Cannot fetch orders - schema issue');
      }
      
      // Test loyalty program schema
      const loyaltyResponse = await fetch(`${this.baseUrl}/api/loyalty/members`);
      if (!loyaltyResponse.ok) {
        throw new Error('Cannot fetch loyalty members - schema issue');
      }
    });
  }

  // Test 5: Frontend Component Loading
  async testFrontendComponents() {
    await this.test('Frontend Components Loading', async () => {
      const response = await fetch(`${this.baseUrl}/`);
      const html = await response.text();
      
      // Check for critical components
      const requiredElements = [
        'Stefano',
        'menu',
        'zamówienie',
        'loyalność',
        'cyberpunk'
      ];

      for (const element of requiredElements) {
        if (!html.toLowerCase().includes(element.toLowerCase())) {
          throw new Error(`Missing critical element: ${element}`);
        }
      }
    });
  }

  // Test 6: Code Quality Check
  testCodeQuality() {
    this.log('Checking code quality...', 'info');
    
    // Check TypeScript compilation
    try {
      execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
      this.log('✓ TypeScript compilation - PASSED', 'success');
      this.results.passed++;
    } catch (error) {
      this.log('✗ TypeScript compilation - FAILED', 'error');
      this.results.failed++;
      this.results.errors.push({ test: 'TypeScript', error: 'Compilation errors found' });
    }

    // Check for unused files
    const clientFiles = this.scanDirectory('./client/src', ['.tsx', '.ts']);
    const unusedFiles = clientFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf8');
      return content.length < 100; // Very small files might be unused
    });

    if (unusedFiles.length > 0) {
      this.results.warnings++;
      this.results.recommendations.push(`Consider removing unused files: ${unusedFiles.join(', ')}`);
    }
  }

  // Test 7: Security Check
  testSecurity() {
    this.log('Running security analysis...', 'info');
    
    // Check for npm vulnerabilities
    try {
      execSync('npm audit --audit-level moderate', { stdio: 'pipe' });
      this.log('✓ Security audit - PASSED', 'success');
      this.results.passed++;
    } catch (error) {
      this.log('⚠ Security vulnerabilities found', 'warning');
      this.results.warnings++;
      this.results.recommendations.push('Run npm audit fix to address security vulnerabilities');
    }

    // Check for sensitive data exposure
    const sensitivePatterns = [
      { pattern: /sk_test_[a-zA-Z0-9]+/, name: 'Stripe test key' },
      { pattern: /sk_live_[a-zA-Z0-9]+/, name: 'Stripe live key' },
      { pattern: /password\s*[=:]\s*['"]/i, name: 'Hardcoded password' }
    ];

    let foundSensitive = false;
    this.scanDirectory('.', ['.ts', '.tsx', '.js']).forEach(file => {
      if (file.includes('node_modules')) return;
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        sensitivePatterns.forEach(({ pattern, name }) => {
          if (pattern.test(content)) {
            this.log(`⚠ Found ${name} in ${file}`, 'warning');
            this.results.warnings++;
            foundSensitive = true;
          }
        });
      } catch (error) {
        // Ignore files that can't be read
      }
    });

    if (!foundSensitive) {
      this.log('✓ No sensitive data found in code', 'success');
      this.results.passed++;
    }
  }

  // Test 8: Performance Check
  async testPerformance() {
    await this.test('Performance - Page Load Speed', async () => {
      const start = Date.now();
      const response = await fetch(`${this.baseUrl}/`);
      const end = Date.now();
      
      const loadTime = end - start;
      if (loadTime > 3000) {
        throw new Error(`Page load too slow: ${loadTime}ms (limit: 3000ms)`);
      }
      
      this.log(`Page load time: ${loadTime}ms`, 'info');
      
      // Check response size
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 1000000) { // 1MB
        this.results.warnings++;
        this.results.recommendations.push('Consider optimizing page size (>1MB)');
      }
    });
  }

  // Utility: Scan directory for files
  scanDirectory(dir, extensions = []) {
    const files = [];
    
    const scan = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            scan(fullPath);
          } else if (stat.isFile()) {
            if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
              files.push(fullPath);
            }
          }
        });
      } catch (error) {
        // Ignore permission errors
      }
    };
    
    scan(dir);
    return files;
  }

  // Generate production readiness report
  generateProductionReport() {
    this.log('\n=== STEFANO APP - PRODUCTION READINESS REPORT ===', 'info');
    this.log(`Tests Run: ${this.results.passed + this.results.failed}`, 'info');
    this.log(`Passed: ${this.results.passed}`, 'success');
    this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'success');
    this.log(`Warnings: ${this.results.warnings}`, this.results.warnings > 0 ? 'warning' : 'success');

    // Production readiness score
    const totalTests = this.results.passed + this.results.failed;
    const successRate = totalTests > 0 ? (this.results.passed / totalTests) * 100 : 0;
    
    this.log(`\nProduction Readiness Score: ${successRate.toFixed(1)}%`, 
      successRate >= 90 ? 'success' : successRate >= 70 ? 'warning' : 'error');

    // Critical errors
    if (this.results.errors.length > 0) {
      this.log('\n=== CRITICAL ERRORS TO FIX ===', 'error');
      this.results.errors.forEach((error, index) => {
        this.log(`${index + 1}. ${error.test}: ${error.error}`, 'error');
      });
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      this.log('\n=== RECOMMENDATIONS ===', 'warning');
      this.results.recommendations.forEach((rec, index) => {
        this.log(`${index + 1}. ${rec}`, 'warning');
      });
    }

    // Final verdict
    this.log('\n=== DEPLOYMENT VERDICT ===', 'info');
    if (this.results.failed === 0 && successRate >= 90) {
      this.log('✅ READY FOR PRODUCTION DEPLOYMENT', 'success');
      this.log('Application meets all quality criteria', 'success');
    } else if (this.results.failed <= 2 && successRate >= 70) {
      this.log('⚠️ CONDITIONALLY READY - Fix errors first', 'warning');
      this.log('Application can be deployed after addressing critical issues', 'warning');
    } else {
      this.log('❌ NOT READY FOR PRODUCTION', 'error');
      this.log('Multiple critical issues need to be resolved', 'error');
    }

    // Usage instructions
    this.log('\n=== RECOMMENDED TOOLS FOR ONGOING QUALITY ===', 'info');
    this.log('1. Run this test suite before each deployment', 'info');
    this.log('2. Use `npm run lint` for code quality checks', 'info');
    this.log('3. Use `npm audit` for security monitoring', 'info');
    this.log('4. Monitor performance with browser dev tools', 'info');
    this.log('5. Set up automated testing in CI/CD pipeline', 'info');
  }

  // Main test runner
  async runAllTests() {
    this.log('🧪 Starting Stefano App Quality Assurance Suite...', 'info');
    
    // Wait for server
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await this.testCoreRoutes();
      await this.testApiEndpoints();
      await this.testOrderSubmission();
      await this.testDatabaseSchema();
      await this.testFrontendComponents();
      this.testCodeQuality();
      this.testSecurity();
      await this.testPerformance();
      
      this.generateProductionReport();
      
    } catch (error) {
      this.log(`Critical testing error: ${error.message}`, 'error');
      this.results.failed++;
    }
    
    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run tests
const tester = new StefanoAppTester();
tester.runAllTests().catch(console.error);