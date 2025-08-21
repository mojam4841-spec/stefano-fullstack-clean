import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, User, ShieldCheck, Activity, Check, X } from "lucide-react";

export default function SystemTest() {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, { status: 'pending' | 'success' | 'error', message?: string }>>({});
  const [loading, setLoading] = useState(false);

  const updateTestResult = (test: string, status: 'pending' | 'success' | 'error', message?: string) => {
    setTestResults(prev => ({ ...prev, [test]: { status, message } }));
  };

  const testEmailSending = async () => {
    updateTestResult('email', 'pending');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Test Email',
          customerPhone: '500600700',
          customerEmail: 'test@stefanogroup.pl',
          items: JSON.stringify([{ name: 'Test Pizza', price: 45, quantity: 1 }]),
          totalAmount: 45,
          status: 'pending',
          paymentMethod: 'cash',
          deliveryAddress: 'Test Address',
          sendEmail: true
        })
      });
      
      if (response.ok) {
        updateTestResult('email', 'success', 'Email wysłany pomyślnie');
        toast({ title: "✅ Email wysłany", description: "Potwierdzenie zamówienia zostało wysłane" });
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      updateTestResult('email', 'error', 'Błąd wysyłki email');
      toast({ title: "❌ Błąd", description: "Nie udało się wysłać email", variant: "destructive" });
    }
  };

  const testSMSSending = async () => {
    updateTestResult('sms', 'pending');
    try {
      const response = await fetch('/api/sms/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '500600700',
          message: 'Test SMS z systemu Stefano'
        })
      });
      
      if (response.ok) {
        updateTestResult('sms', 'success', 'SMS wysłany pomyślnie');
        toast({ title: "✅ SMS wysłany", description: "Wiadomość testowa została wysłana" });
      } else {
        updateTestResult('sms', 'error', 'Brak konfiguracji Twilio');
        toast({ title: "⚠️ SMS", description: "Wymagana konfiguracja Twilio", variant: "destructive" });
      }
    } catch (error) {
      updateTestResult('sms', 'error', 'Błąd wysyłki SMS');
    }
  };

  const testCustomerScoring = async () => {
    updateTestResult('scoring', 'pending');
    try {
      const response = await fetch('/api/customers/1/score');
      const data = await response.json();
      
      if (response.ok) {
        updateTestResult('scoring', 'success', `Score: ${data.score || 'N/A'}`);
        toast({ title: "✅ Scoring działa", description: "System oceny klientów aktywny" });
      } else {
        throw new Error('Scoring failed');
      }
    } catch (error) {
      updateTestResult('scoring', 'error', 'Błąd systemu scoringu');
    }
  };

  const testAdminAccess = async () => {
    updateTestResult('admin', 'pending');
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        updateTestResult('admin', 'success', `Zalogowany jako: ${user.email}`);
        toast({ title: "✅ Dostęp do panelu", description: `Role: ${user.role}` });
      } else {
        updateTestResult('admin', 'error', 'Brak autoryzacji');
        toast({ title: "❌ Brak dostępu", description: "Zaloguj się jako admin", variant: "destructive" });
      }
    } catch (error) {
      updateTestResult('admin', 'error', 'Błąd autoryzacji');
    }
  };

  const testAllFeatures = async () => {
    setLoading(true);
    
    // Test all features sequentially
    await testEmailSending();
    await new Promise(r => setTimeout(r, 1000));
    
    await testSMSSending();
    await new Promise(r => setTimeout(r, 1000));
    
    await testCustomerScoring();
    await new Promise(r => setTimeout(r, 1000));
    
    await testAdminAccess();
    
    setLoading(false);
  };

  const renderTestStatus = (test: string) => {
    const result = testResults[test];
    if (!result) return <Badge variant="outline">Nie testowano</Badge>;
    
    switch (result.status) {
      case 'pending':
        return <Badge variant="secondary"><Activity className="w-3 h-3 mr-1 animate-spin" /> Testowanie...</Badge>;
      case 'success':
        return <Badge variant="default"><Check className="w-3 h-3 mr-1" /> {result.message}</Badge>;
      case 'error':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" /> {result.message}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">System Test Dashboard</h1>
          <p className="text-gray-400">Kompleksowe testowanie wszystkich funkcji systemu Stefano</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Panel Testowy</CardTitle>
            <CardDescription>Kliknij aby przetestować poszczególne funkcje</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Test */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-semibold">Wysyłka Email</h3>
                  <p className="text-sm text-gray-400">SendGrid API</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {renderTestStatus('email')}
                <Button onClick={testEmailSending} size="sm" variant="outline">
                  Test
                </Button>
              </div>
            </div>

            {/* SMS Test */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="font-semibold">Wysyłka SMS</h3>
                  <p className="text-sm text-gray-400">Twilio API</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {renderTestStatus('sms')}
                <Button onClick={testSMSSending} size="sm" variant="outline">
                  Test
                </Button>
              </div>
            </div>

            {/* Customer Scoring */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="font-semibold">Scoring Klienta</h3>
                  <p className="text-sm text-gray-400">System oceny klientów</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {renderTestStatus('scoring')}
                <Button onClick={testCustomerScoring} size="sm" variant="outline">
                  Test
                </Button>
              </div>
            </div>

            {/* Admin Access */}
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="font-semibold">Panel Admina</h3>
                  <p className="text-sm text-gray-400">Autoryzacja i dostęp</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {renderTestStatus('admin')}
                <Button onClick={testAdminAccess} size="sm" variant="outline">
                  Test
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-600 pt-6">
              <Button 
                onClick={testAllFeatures} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Testowanie w toku...
                  </>
                ) : (
                  'Testuj Wszystkie Funkcje'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Form for Admin */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Logowanie do Panelu Admina</CardTitle>
            <CardDescription>Zaloguj się aby uzyskać dostęp do funkcji administracyjnych</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              
              try {
                const response = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                  })
                });
                
                if (response.ok) {
                  const data = await response.json();
                  localStorage.setItem('token', data.token);
                  toast({ title: "✅ Zalogowano", description: "Możesz teraz testować funkcje admina" });
                  testAdminAccess();
                } else {
                  toast({ title: "❌ Błąd logowania", description: "Nieprawidłowe dane", variant: "destructive" });
                }
              } catch (error) {
                toast({ title: "❌ Błąd", description: "Nie udało się zalogować", variant: "destructive" });
              }
            }} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="admin@stefanogroup.pl"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="password">Hasło</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <Button type="submit" className="w-full">
                Zaloguj jako Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}