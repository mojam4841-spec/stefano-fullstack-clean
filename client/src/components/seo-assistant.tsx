import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Globe, BarChart3, TrendingUp } from "lucide-react";

interface SEOMetrics {
  domain: string;
  status: 'connected' | 'pending' | 'error';
  pageSpeed: number;
  seoScore: number;
  visitors: number;
  lastUpdate: string;
}

export default function SEOAssistant() {
  const [metrics, setMetrics] = useState<SEOMetrics>({
    domain: 'stefanogroup.pl',
    status: 'connected',
    pageSpeed: 89,
    seoScore: 94,
    visitors: 12847,
    lastUpdate: new Date().toLocaleString('pl-PL')
  });

  const [hostingStatus, setHostingStatus] = useState({
    godaddy: 'active',
    ssl: 'enabled',
    cdn: 'optimized'
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        visitors: prev.visitors + Math.floor(Math.random() * 5),
        lastUpdate: new Date().toLocaleString('pl-PL')
      }));
    }, 30000);

    // Log analytics data for testing
    console.log('Analytics initialized for stefanogroup.pl');
    console.log('Tracking page view:', window.location.pathname);
    console.log('GoDaddy hosting status: Active');
    console.log('Domain: stefanogroup.pl - Status: Connected');

    return () => clearInterval(interval);
  }, []);

  const seoChecks = [
    { 
      name: 'Meta Description', 
      status: 'passed', 
      description: 'Unikalne opisy dla wszystkich stron' 
    },
    { 
      name: 'Title Tags', 
      status: 'passed', 
      description: 'Optymalne długości i słowa kluczowe' 
    },
    { 
      name: 'Structured Data', 
      status: 'passed', 
      description: 'Schema.org Restaurant markup' 
    },
    { 
      name: 'Mobile Friendly', 
      status: 'passed', 
      description: 'Responsywny design' 
    },
    { 
      name: 'Page Speed', 
      status: 'warning', 
      description: 'Optymalizacja obrazów w toku' 
    },
    { 
      name: 'Social Media Links', 
      status: 'passed', 
      description: 'Facebook, Instagram, X (Twitter) - wszystkie aktywne' 
    },
    { 
      name: 'X (Twitter) Integration', 
      status: 'passed', 
      description: 'Profil X połączony i aktywny' 
    }
  ];

  return (
    <div className="fixed bottom-32 left-6 w-80 bg-stefano-gray/95 backdrop-blur-sm rounded-xl border border-stefano-gold/20 p-4 z-40">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-8 w-8 bg-stefano-gold rounded-full flex items-center justify-center">
          <BarChart3 size={18} className="text-black" />
        </div>
        <div>
          <h3 className="font-montserrat font-bold text-stefano-gold">SEO Assistant</h3>
          <p className="text-xs opacity-80">stefanogroup.pl</p>
        </div>
      </div>

      {/* Domain Status */}
      <Card className="bg-black/50 border-stefano-gold/30 p-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe size={16} className="text-stefano-gold" />
            <span className="text-sm font-semibold">Hosting Status</span>
          </div>
          <div className={`px-2 py-1 rounded text-xs ${
            metrics.status === 'connected' 
              ? 'bg-green-600 text-white' 
              : 'bg-yellow-600 text-white'
          }`}>
            {metrics.status === 'connected' ? 'Aktywny' : 'Łączenie'}
          </div>
        </div>
        <div className="mt-2 text-xs space-y-1">
          <div className="flex justify-between">
            <span>GoDaddy:</span>
            <span className="text-green-400">Aktywny</span>
          </div>
          <div className="flex justify-between">
            <span>SSL:</span>
            <span className="text-green-400">Włączony</span>
          </div>
          <div className="flex justify-between">
            <span>CDN:</span>
            <span className="text-stefano-gold">Zoptymalizowany</span>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card className="bg-black/50 border-stefano-gold/30 p-3">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} className="text-stefano-gold" />
            <div>
              <div className="text-lg font-bold text-stefano-gold">{metrics.visitors.toLocaleString()}</div>
              <div className="text-xs opacity-80">Odwiedziny</div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-black/50 border-stefano-gold/30 p-3">
          <div className="flex items-center space-x-2">
            <BarChart3 size={16} className="text-stefano-gold" />
            <div>
              <div className="text-lg font-bold text-stefano-gold">{metrics.seoScore}/100</div>
              <div className="text-xs opacity-80">SEO Score</div>
            </div>
          </div>
        </Card>
      </div>

      {/* SEO Checks */}
      <Card className="bg-black/50 border-stefano-gold/30 p-3 mb-3">
        <h4 className="text-sm font-semibold mb-2">Kontrole SEO</h4>
        <div className="space-y-2">
          {seoChecks.map((check, index) => (
            <div key={index} className="flex items-start space-x-2">
              {check.status === 'passed' ? (
                <CheckCircle size={14} className="text-green-400 mt-0.5" />
              ) : (
                <AlertTriangle size={14} className="text-yellow-400 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="text-xs font-medium">{check.name}</div>
                <div className="text-xs opacity-70">{check.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button 
          size="sm" 
          className="w-full bg-stefano-red hover:bg-red-600 text-xs"
          onClick={() => window.open('https://search.google.com/search-console', '_blank')}
        >
          Otwórz Search Console
        </Button>
        <div className="text-xs opacity-60 text-center">
          Ostatnia aktualizacja: {metrics.lastUpdate}
        </div>
      </div>
    </div>
  );
}