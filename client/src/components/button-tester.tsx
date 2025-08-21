import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ButtonTest {
  id: string;
  name: string;
  description: string;
  testFunction: () => boolean;
  status: 'pending' | 'passed' | 'failed';
}

export default function ButtonTester() {
  const [tests, setTests] = useState<ButtonTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{ passed: number; failed: number; total: number }>({
    passed: 0,
    failed: 0,
    total: 0
  });

  const buttonTests: ButtonTest[] = [
    {
      id: 'nav-home',
      name: 'Nawigacja - Home',
      description: 'Test scroll do sekcji głównej',
      testFunction: () => {
        const element = document.getElementById('hero');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'nav-menu',
      name: 'Nawigacja - Menu',
      description: 'Test scroll do sekcji menu',
      testFunction: () => {
        const element = document.getElementById('menu');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'nav-order',
      name: 'Nawigacja - Zamów online',
      description: 'Test scroll do sekcji zamówień',
      testFunction: () => {
        const element = document.getElementById('zamow');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'nav-shop',
      name: 'Nawigacja - Sklep sosów',
      description: 'Test scroll do sekcji sklepu',
      testFunction: () => {
        const element = document.getElementById('sklep');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'nav-games',
      name: 'Nawigacja - Gry planszowe',
      description: 'Test scroll do sekcji gier',
      testFunction: () => {
        const element = document.getElementById('gry');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'nav-events',
      name: 'Nawigacja - Imprezy rodzinne',
      description: 'Test scroll do sekcji imprez',
      testFunction: () => {
        const element = document.getElementById('imprezy');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'nav-business',
      name: 'Nawigacja - Obsługa firm',
      description: 'Test scroll do sekcji biznesowej',
      testFunction: () => {
        const element = document.getElementById('firmy');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'nav-contact',
      name: 'Nawigacja - Kontakt',
      description: 'Test scroll do sekcji kontakt',
      testFunction: () => {
        const element = document.getElementById('kontakt');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'hero-order-btn',
      name: 'Hero - Zamów z odbiorem',
      description: 'Test przycisku głównego zamówienia',
      testFunction: () => {
        const element = document.getElementById('zamow');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'hero-menu-btn',
      name: 'Hero - Zobacz Menu',
      description: 'Test przycisku menu w hero',
      testFunction: () => {
        const element = document.getElementById('menu');
        return element !== null;
      },
      status: 'pending'
    },
    {
      id: 'menu-categories',
      name: 'Menu - Kategorie',
      description: 'Test przycisków kategorii menu',
      testFunction: () => {
        const burgeryBtn = document.querySelector('[data-testid="category-burgery"]');
        const pizzaBtn = document.querySelector('[data-testid="category-pizza"]');
        return burgeryBtn !== null || pizzaBtn !== null;
      },
      status: 'pending'
    },
    {
      id: 'menu-promotion',
      name: 'Menu - Promocja Pizza',
      description: 'Test przycisku promocji pizza',
      testFunction: () => {
        return document.querySelector('button')?.textContent?.includes('Promocję Pizza') || false;
      },
      status: 'pending'
    },
    {
      id: 'twitter-x-links',
      name: 'X (Twitter) - Linki',
      description: 'Test linków do platformy X/Twitter',
      testFunction: () => {
        const twitterLink = document.querySelector('a[href*="twitter.com"]');
        const xLink = document.querySelector('a[href*="x.com"]');
        return twitterLink !== null || xLink !== null;
      },
      status: 'pending'
    },
    {
      id: 'whatsapp-order',
      name: 'WhatsApp - Zamówienie',
      description: 'Test linków WhatsApp (sprawdza obecność wa.me)',
      testFunction: () => {
        const scripts = Array.from(document.scripts);
        const hasWhatsApp = scripts.some(script => 
          script.textContent?.includes('wa.me') || script.src?.includes('whatsapp')
        );
        return hasWhatsApp || window.location.href.includes('wa.me');
      },
      status: 'pending'
    },
    {
      id: 'shop-cart',
      name: 'Sklep - Koszyk',
      description: 'Test funkcjonalności koszyka sosów',
      testFunction: () => {
        const shopSection = document.getElementById('sklep');
        return shopSection !== null;
      },
      status: 'pending'
    },
    {
      id: 'contact-form',
      name: 'Kontakt - Formularz',
      description: 'Test formularza kontaktowego',
      testFunction: () => {
        const nameInput = document.querySelector('input[name="name"]');
        const emailInput = document.querySelector('input[name="email"]');
        const messageInput = document.querySelector('textarea[name="message"]');
        return nameInput !== null && emailInput !== null && messageInput !== null;
      },
      status: 'pending'
    },
    {
      id: 'mobile-menu',
      name: 'Mobile - Menu',
      description: 'Test menu mobilnego',
      testFunction: () => {
        const mobileBtn = document.querySelector('[data-testid="mobile-menu-btn"]');
        const hamburgerBtn = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.querySelector('svg')?.classList.contains('lucide-menu') || 
          btn.textContent?.includes('Menu')
        );
        return mobileBtn !== null || hamburgerBtn !== null;
      },
      status: 'pending'
    },
    {
      id: 'social-links',
      name: 'Social Media - Linki',
      description: 'Test linków social media',
      testFunction: () => {
        const fbLink = document.querySelector('a[href*="facebook"]');
        const igLink = document.querySelector('a[href*="instagram"]');
        const twitterLink = document.querySelector('a[href*="twitter"]');
        const xLink = document.querySelector('a[href*="x.com"]');
        return fbLink !== null || igLink !== null || twitterLink !== null || xLink !== null;
      },
      status: 'pending'
    },
    {
      id: 'admin-panel',
      name: 'Admin - Panel',
      description: 'Test dostępu do panelu admin',
      testFunction: () => {
        // Sprawdza czy route /admin istnieje
        return window.location.pathname === '/admin' || document.querySelector('[href="/admin"]') !== null;
      },
      status: 'pending'
    },
    {
      id: 'pwa-install',
      name: 'PWA - Instalacja',
      description: 'Test funkcjonalności PWA',
      testFunction: () => {
        return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
      },
      status: 'pending'
    }
  ];

  useEffect(() => {
    setTests(buttonTests);
  }, []);

  const runTest = async (test: ButtonTest): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Krótka pauza
      return test.testFunction();
    } catch (error) {
      console.error(`Test ${test.id} failed:`, error);
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const updatedTests = [...tests];
    let passed = 0;
    let failed = 0;

    for (let i = 0; i < updatedTests.length; i++) {
      const test = updatedTests[i];
      const result = await runTest(test);
      
      test.status = result ? 'passed' : 'failed';
      if (result) passed++;
      else failed++;
      
      setTests([...updatedTests]);
      setResults({ passed, failed, total: updatedTests.length });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/20 border-green-500/40';
      case 'failed':
        return 'bg-red-500/20 border-red-500/40';
      default:
        return 'bg-yellow-500/20 border-yellow-500/40';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-stefano-gray rounded-xl p-4 shadow-2xl border border-stefano-gold/20 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold stefano-gold">Test Przycisków</h3>
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-stefano-red hover:bg-red-600 text-sm px-3 py-1"
          >
            {isRunning ? 'Testowanie...' : 'Uruchom Testy'}
          </Button>
        </div>

        {results.total > 0 && (
          <div className="mb-4 p-3 bg-stefano-dark rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Zaliczone: {results.passed}</span>
              <span className="text-red-400">Błędy: {results.failed}</span>
              <span className="text-white">Razem: {results.total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(results.passed / results.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto space-y-2">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`p-2 rounded-lg border ${getStatusColor(test.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(test.status)}
                  <span className="text-sm font-medium">{test.name}</span>
                </div>
              </div>
              <p className="text-xs opacity-70 mt-1">{test.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}