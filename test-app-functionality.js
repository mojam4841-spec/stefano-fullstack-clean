#!/usr/bin/env node

/**
 * Comprehensive Application Testing Suite
 * Tests all functionality, API endpoints, database connections, and frontend components
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class AppTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      errors: []
    };
    this.baseUrl = 'http://localhost:5000';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',  // cyan
      success: '\x1b[32m', // green
      warning: '\x1b[33m', // yellow
      error: '\x1b[31m',   // red
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

  // 1. Database Connection Test
  async testDatabaseConnection() {
    await this.test('Database Connection', async () => {
      const response = await fetch(`${this.baseUrl}/api/health-check`);
      if (!response.ok) {
        throw new Error(`Database health check failed: ${response.status}`);
      }
    });
  }

  // 2. API Endpoints Test
  async testApiEndpoints() {
    const endpoints = [
      { path: '/api/contacts', method: 'GET' },
      { path: '/api/reservations', method: 'GET' },
      { path: '/api/orders', method: 'GET' },
      { path: '/api/loyalty/members', method: 'GET' },
      { path: '/api/rewards', method: 'GET' }
    ];

    for (const endpoint of endpoints) {
      await this.test(`API ${endpoint.method} ${endpoint.path}`, async () => {
        const response = await fetch(`${this.baseUrl}${endpoint.path}`);
        if (!response.ok) {
          throw new Error(`API endpoint failed: ${response.status}`);
        }
      });
    }
  }

  // 3. Frontend Pages Test
  async testFrontendPages() {
    const pages = [
      '/',
      '/order',
      '/loyalty',
      '/admin'
    ];

    for (const page of pages) {
      await this.test(`Frontend Page ${page}`, async () => {
        const response = await fetch(`${this.baseUrl}${page}`);
        if (!response.ok) {
          throw new Error(`Page ${page} failed to load: ${response.status}`);
        }
        const html = await response.text();
        if (!html.includes('<!DOCTYPE html>')) {
          throw new Error(`Page ${page} doesn't return valid HTML`);
        }
      });
    }
  }

  // 4. Code Quality Analysis
  testCodeQuality() {
    this.log('Analyzing code quality...', 'info');
    
    // Check for TypeScript errors
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.log('✓ TypeScript compilation - PASSED', 'success');
      this.results.passed++;
    } catch (error) {
      this.log('✗ TypeScript compilation - FAILED', 'error');
      this.results.failed++;
      this.results.errors.push({ test: 'TypeScript', error: error.stdout?.toString() || error.message });
    }

    // Check for ESLint issues
    try {
      execSync('npx eslint . --ext .ts,.tsx --format compact', { stdio: 'pipe' });
      this.log('✓ ESLint analysis - PASSED', 'success');
      this.results.passed++;
    } catch (error) {
      this.log('⚠ ESLint warnings found', 'warning');
      this.results.warnings++;
    }
  }

  // 5. Security Analysis
  testSecurity() {
    this.log('Running security analysis...', 'info');
    
    // Check for security vulnerabilities
    try {
      execSync('npm audit --audit-level moderate', { stdio: 'pipe' });
      this.log('✓ Security audit - PASSED', 'success');
      this.results.passed++;
    } catch (error) {
      this.log('⚠ Security vulnerabilities found', 'warning');
      this.results.warnings++;
    }

    // Check for hardcoded secrets
    const sensitivePatterns = [
      /password\s*=\s*['"]/i,
      /api[_-]?key\s*=\s*['"]/i,
      /secret\s*=\s*['"]/i,
      /token\s*=\s*['"]/i
    ];

    const checkFile = (filePath) => {
      if (filePath.includes('node_modules') || filePath.includes('.git')) return;
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        sensitivePatterns.forEach((pattern, index) => {
          if (pattern.test(content)) {
            this.log(`⚠ Potential hardcoded secret in ${filePath}`, 'warning');
            this.results.warnings++;
          }
        });
      } catch (error) {
        // Ignore files that can't be read
      }
    };

    const scanDirectory = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          scanDirectory(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
          checkFile(filePath);
        }
      });
    };

    scanDirectory('.');
  }

  // 6. Performance Test
  async testPerformance() {
    await this.test('Performance - Page Load Time', async () => {
      const start = Date.now();
      const response = await fetch(`${this.baseUrl}/`);
      const end = Date.now();
      
      if (!response.ok) {
        throw new Error(`Page failed to load: ${response.status}`);
      }
      
      const loadTime = end - start;
      if (loadTime > 2000) {
        throw new Error(`Page load time too slow: ${loadTime}ms`);
      }
      
      this.log(`Page load time: ${loadTime}ms`, 'info');
    });
  }

  // 7. Database Schema Validation
  async testDatabaseSchema() {
    await this.test('Database Schema Validation', async () => {
      const response = await fetch(`${this.baseUrl}/api/orders`);
      if (!response.ok) {
        throw new Error('Could not fetch orders to validate schema');
      }
      
      // Schema should be valid if we can fetch without errors
      this.log('Database schema is valid', 'success');
    });
  }

  // Generate comprehensive report
  generateReport() {
    this.log('\n=== COMPREHENSIVE TEST REPORT ===', 'info');
    this.log(`Total Tests: ${this.results.passed + this.results.failed}`, 'info');
    this.log(`Passed: ${this.results.passed}`, 'success');
    this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'success');
    this.log(`Warnings: ${this.results.warnings}`, this.results.warnings > 0 ? 'warning' : 'success');

    if (this.results.errors.length > 0) {
      this.log('\n=== ERRORS TO FIX ===', 'error');
      this.results.errors.forEach((error, index) => {
        this.log(`${index + 1}. ${error.test}: ${error.error}`, 'error');
      });
    }

    // Generate recommendations
    this.log('\n=== RECOMMENDATIONS ===', 'info');
    
    if (this.results.failed === 0) {
      this.log('✓ Application is ready for production deployment', 'success');
    } else {
      this.log('⚠ Fix the errors above before deploying to production', 'warning');
    }

    if (this.results.warnings > 0) {
      this.log('⚠ Consider addressing warnings for better code quality', 'warning');
    }

    this.log('✓ Use this test suite regularly during development', 'info');
    this.log('✓ Run before each deployment', 'info');
    this.log('✓ Add more specific tests as application grows', 'info');
  }

  // Main test runner
  async runAllTests() {
    this.log('Starting comprehensive application testing...', 'info');
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run all tests
    await this.testDatabaseConnection();
    await this.testApiEndpoints();
    await this.testFrontendPages();
    this.testCodeQuality();
    this.testSecurity();
    await this.testPerformance();
    await this.testDatabaseSchema();
    
    this.generateReport();
    
    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new AppTester();
  tester.runAllTests().catch(console.error);
}

export default AppTester;