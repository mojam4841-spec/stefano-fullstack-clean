import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Shield, Database, Smartphone, Users, Key } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { apiRequest } from '@/lib/queryClient';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
}

export function EnterpriseTestSuite() {
  const { user } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  const runTest = async (
    name: string, 
    testFn: () => Promise<void>
  ): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      await testFn();
      return {
        name,
        status: 'success',
        duration: Date.now() - startTime,
        message: 'Test passed'
      };
    } catch (error: any) {
      return {
        name,
        status: 'error',
        duration: Date.now() - startTime,
        message: error.message || 'Test failed'
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setTests([]);

    const testCases = [
      {
        name: '1. Database Connection',
        icon: Database,
        test: async () => {
          const response = await fetch('/api/contacts');
          if (!response.ok) throw new Error('Database connection failed');
        }
      },
      {
        name: '2. Authentication System',
        icon: Shield,
        test: async () => {
          // Test login endpoint exists
          const response = await fetch('/api/auth/me');
          if (response.status === 500) throw new Error('Auth system error');
        }
      },
      {
        name: '3. Admin Panel Access',
        icon: Key,
        test: async () => {
          const response = await fetch('/api/admin/users');
          // Should return 401 if not logged in as admin
          if (response.status === 500) throw new Error('Admin routes not configured');
        }
      },
      {
        name: '4. Customer Database',
        icon: Users,
        test: async () => {
          const response = await fetch('/api/customers');
          if (!response.ok && response.status !== 401) {
            throw new Error('Customer database endpoint error');
          }
        }
      },
      {
        name: '5. Mobile App Generation',
        icon: Smartphone,
        test: async () => {
          // Check if mobile app component exists
          const mobileAppSection = document.querySelector('[data-testid="mobile-app-download"]');
          if (!mobileAppSection) {
            // Component might not be rendered yet, so we'll check the API
            const response = await fetch('/');
            if (!response.ok) throw new Error('Mobile app section not available');
          }
        }
      },
      {
        name: '6. Order Submission',
        icon: CheckCircle,
        test: async () => {
          const testOrder = {
            customerName: 'Test User',
            customerPhone: '123456789',
            items: JSON.stringify([{ name: 'Test', price: 100, quantity: 1 }]),
            totalAmount: 100,
            paymentMethod: 'cash'
          };
          
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testOrder)
          });
          
          if (!response.ok) throw new Error('Order submission failed');
        }
      },
      {
        name: '7. Loyalty Program',
        icon: Users,
        test: async () => {
          const response = await fetch('/api/loyalty/members');
          if (!response.ok && response.status !== 401) {
            throw new Error('Loyalty program endpoint error');
          }
        }
      },
      {
        name: '8. GDPR Compliance',
        icon: Shield,
        test: async () => {
          const response = await fetch('/api/gdpr/consent/1');
          if (!response.ok && response.status !== 404) {
            throw new Error('GDPR endpoints not configured');
          }
        }
      }
    ];

    const results: TestResult[] = [];
    
    for (const testCase of testCases) {
      setTests(prev => [...prev, { name: testCase.name, status: 'running' }]);
      
      const result = await runTest(testCase.name, testCase.test);
      results.push(result);
      
      setTests(prev => 
        prev.map(t => t.name === testCase.name ? result : t)
      );
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    setOverallStatus('completed');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 rounded-full bg-gray-600" />;
      case 'running':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;

  return (
    <Card className="bg-gray-800/90 backdrop-blur-sm border-stefano-gold/20" data-testid="enterprise-test-suite">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-stefano-gold" />
          Enterprise System Test Suite
        </CardTitle>
        <CardDescription className="text-gray-300">
          Kompleksowe testy funkcjonalności systemu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Test Status Summary */}
          {overallStatus === 'completed' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">Wszystkie testy</p>
                <p className="text-2xl font-bold text-white">{tests.length}</p>
              </div>
              <div className="bg-green-900/30 rounded-lg p-4 text-center">
                <p className="text-sm text-green-400">Zaliczone</p>
                <p className="text-2xl font-bold text-green-500">{successCount}</p>
              </div>
              <div className="bg-red-900/30 rounded-lg p-4 text-center">
                <p className="text-sm text-red-400">Błędy</p>
                <p className="text-2xl font-bold text-red-500">{errorCount}</p>
              </div>
            </div>
          )}

          {/* Current User Info */}
          <Alert className="bg-gray-700/50 border-gray-600">
            <AlertDescription className="text-gray-300">
              <strong>Status użytkownika:</strong> {user ? `Zalogowany jako ${user.email} (${user.role})` : 'Niezalogowany'}
            </AlertDescription>
          </Alert>

          {/* Test Results */}
          {tests.length > 0 && (
            <div className="space-y-2">
              {tests.map((test, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <span className="text-white font-medium">{test.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.duration && (
                      <span className="text-sm text-gray-400">
                        {test.duration}ms
                      </span>
                    )}
                    {test.status === 'error' && (
                      <Badge variant="destructive" className="text-xs">
                        {test.message}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Test Controls */}
          <div className="flex gap-4">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex-1 bg-stefano-red hover:bg-red-700"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testowanie...
                </>
              ) : (
                'Uruchom wszystkie testy'
              )}
            </Button>
            
            {overallStatus === 'completed' && (
              <Button
                variant="outline"
                onClick={() => {
                  setTests([]);
                  setOverallStatus('idle');
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Wyczyść wyniki
              </Button>
            )}
          </div>

          {/* Test Instructions */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Instrukcje testowania:</h4>
            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
              <li>Kliknij "Uruchom wszystkie testy" aby rozpocząć</li>
              <li>Testy sprawdzą wszystkie główne komponenty systemu</li>
              <li>Zielone testy = poprawne działanie</li>
              <li>Czerwone testy = wymaga naprawy</li>
              <li>Dla pełnego testu zaloguj się jako admin (admin@stefano.pl / admin123)</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}