import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle, Mail, MessageSquare, Phone, Send, TestTube } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
// Avatar system removed

interface CommunicationStatus {
  sms: {
    configured: boolean;
    missing: string[];
  };
  email: {
    configured: boolean;
    missing: string[];
  };
  overall: boolean;
}

interface TestResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

export default function CommunicationTesting() {
  const [status, setStatus] = useState<CommunicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Test forms state
  const [testPhone, setTestPhone] = useState('+48');
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  
  // Bulk communication state
  const [emailList, setEmailList] = useState('');
  const [phoneList, setPhoneList] = useState('');
  const [campaignTitle, setCampaignTitle] = useState('Newsletter Stefano');
  const [promotionMessage, setPromotionMessage] = useState('Specjalna promocja w Stefano! Pizza za połowę ceny!');
  
  // Test results
  const [testResults, setTestResults] = useState<{[key: string]: TestResult}>({});

  useEffect(() => {
    loadCommunicationStatus();
  }, []);

  const loadCommunicationStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/communication/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to load communication status:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSMS = async () => {
    if (!testPhone || testPhone.length < 10) {
      toast({
        title: "Błąd",
        description: "Podaj prawidłowy numer telefonu",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await apiRequest('POST', '/api/communication/test-sms', {
        phone: testPhone
      });
      
      setTestResults(prev => ({ ...prev, sms: result }));
      
      if (result.success) {
        toast({
          title: "SMS wysłany!",
          description: "Sprawdź swój telefon"
        });
      } else {
        toast({
          title: "Błąd SMS",
          description: result.error || "Nie udało się wysłać SMS",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast({
        title: "Błąd",
        description: "Podaj prawidłowy adres email",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await apiRequest('POST', '/api/communication/test-email', {
        email: testEmail
      });
      
      setTestResults(prev => ({ ...prev, email: result }));
      
      if (result.success) {
        toast({
          title: "Email wysłany!",
          description: "Sprawdź swoją skrzynkę pocztową"
        });
      } else {
        toast({
          title: "Błąd Email",
          description: result.error || "Nie udało się wysłać email",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendWelcomeMessage = async () => {
    if (!testName) {
      toast({
        title: "Błąd",
        description: "Podaj imię do wiadomości powitalnej",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await apiRequest('POST', '/api/communication/send-welcome', {
        phone: testPhone || null,
        email: testEmail || null,
        name: testName,
        loyaltyData: {
          customerType: 'customer',
          tier: 'bronze',
          points: 100
        }
      });
      
      setTestResults(prev => ({ ...prev, welcome: result }));
      
      if (result.success) {
        toast({
          title: "Wiadomość powitalna wysłana!",
          description: "Sprawdź swój telefon i email"
        });
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się wysłać wiadomości powitalnej",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendOrderConfirmation = async () => {
    try {
      setLoading(true);
      const result = await apiRequest('POST', '/api/communication/send-order-confirmation', {
        phone: testPhone || null,
        email: testEmail || null,
        orderData: {
          id: 'TEST-' + Date.now(),
          amount: 6500, // 65.00 zł
          estimatedTime: '35 min',
          paymentMethod: 'BLIK'
        }
      });
      
      setTestResults(prev => ({ ...prev, order: result }));
      
      if (result.success) {
        toast({
          title: "Potwierdzenie zamówienia wysłane!",
          description: "Test potwierdzenia zamówienia zakończony sukcesem"
        });
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się wysłać potwierdzenia zamówienia",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendLoyaltyReward = async () => {
    try {
      setLoading(true);
      const result = await apiRequest('POST', '/api/communication/send-loyalty-reward', {
        phone: testPhone || null,
        email: testEmail || null,
        reward: {
          name: 'Darmowa kawa',
          description: 'Odbierz darmową kawę w restauracji Stefano',
          code: 'COFFEE' + Math.random().toString(36).substring(2, 8).toUpperCase()
        }
      });
      
      setTestResults(prev => ({ ...prev, loyalty: result }));
      
      if (result.success) {
        toast({
          title: "Nagroda lojalnościowa wysłana!",
          description: "Test nagrody programu lojalnościowego zakończony sukcesem"
        });
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się wysłać nagrody",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async () => {
    const emails = emailList.split('\n').filter(email => email.trim() && email.includes('@'));
    
    if (emails.length === 0) {
      toast({
        title: "Błąd",
        description: "Dodaj przynajmniej jeden prawidłowy adres email",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await apiRequest('POST', '/api/communication/send-newsletter', {
        emails,
        campaign: {
          title: campaignTitle,
          subject: `${campaignTitle} - Restaurant Stefano`
        }
      });
      
      setTestResults(prev => ({ ...prev, newsletter: result }));
      
      if (result.success) {
        toast({
          title: "Newsletter wysłany!",
          description: `Wysłano do ${result.sent}/${result.total} adresów`
        });
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się wysłać newslettera",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendPromotionSMS = async () => {
    const phones = phoneList.split('\n').filter(phone => phone.trim().length > 9);
    
    if (phones.length === 0) {
      toast({
        title: "Błąd",
        description: "Dodaj przynajmniej jeden prawidłowy numer telefonu",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await apiRequest('POST', '/api/communication/send-promotion', {
        phones,
        promotion: promotionMessage
      });
      
      setTestResults(prev => ({ ...prev, promotion: result }));
      
      if (result.success) {
        toast({
          title: "SMS promocyjny wysłany!",
          description: `Wysłano do ${result.sent}/${result.total} numerów`
        });
      } else {
        toast({
          title: "Błąd",
          description: "Nie udało się wysłać SMS promocyjnego",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const StatusIndicator = ({ configured, type }: { configured: boolean; type: string }) => (
    <div className="flex items-center gap-2">
      {configured ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <span className={configured ? "text-green-500" : "text-red-500"}>
        {type}: {configured ? "Skonfigurowane" : "Brak konfiguracji"}
      </span>
    </div>
  );

  const TestResultBadge = ({ result }: { result?: TestResult }) => {
    if (!result) return null;
    
    return (
      <Badge variant={result.success ? "default" : "destructive"}>
        {result.success ? "✓ Sukces" : "✗ Błąd"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stefano-gold flex items-center gap-2">
            <TestTube className="w-6 h-6" />
            Test Komunikacji SMS & Email
          </h2>
          <p className="text-gray-300">System powiadomień restauracji Stefano</p>
        </div>
        <Button onClick={loadCommunicationStatus} disabled={loading} className="bg-stefano-red hover:bg-red-600">
          Odśwież Status
        </Button>
      </div>

      {/* Status Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-stefano-gold">Status Systemów Komunikacji</CardTitle>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="space-y-3">
              <StatusIndicator configured={status.sms.configured} type="SMS (Twilio)" />
              <StatusIndicator configured={status.email.configured} type="Email (SendGrid)" />
              
              {!status.overall && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                  <h4 className="font-semibold text-red-400 mb-2">Brakujące klucze API:</h4>
                  <ul className="text-sm text-red-300 space-y-1">
                    {status.sms.missing.map(key => (
                      <li key={key}>• {key}</li>
                    ))}
                    {status.email.missing.map(key => (
                      <li key={key}>• {key}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">Ładowanie statusu...</div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="individual">Testy Podstawowe</TabsTrigger>
          <TabsTrigger value="scenarios">Scenariusze</TabsTrigger>
          <TabsTrigger value="bulk">Wysyłka Masowa</TabsTrigger>
          <TabsTrigger value="profiles">Profile klientów</TabsTrigger>
        </TabsList>

        {/* Individual Tests */}
        <TabsContent value="individual" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-stefano-gold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Test SMS
                  <TestResultBadge result={testResults.sms} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-phone">Numer telefonu</Label>
                  <Input
                    id="test-phone"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+48123456789"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <Button 
                  onClick={testSMS} 
                  disabled={loading || !status?.sms.configured}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Wyślij Test SMS
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-stefano-gold flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Test Email
                  <TestResultBadge result={testResults.email} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-email">Adres email</Label>
                  <Input
                    id="test-email"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <Button 
                  onClick={testEmail} 
                  disabled={loading || !status?.email.configured}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Wyślij Test Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scenario Tests */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-stefano-gold">Scenariusze Komunikacji</CardTitle>
              <CardDescription>Testuj kompletne przepływy komunikacji</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="test-name">Imię klienta</Label>
                <Input
                  id="test-name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Jan Kowalski"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={sendWelcomeMessage}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <TestResultBadge result={testResults.welcome} />
                  Wiadomość Powitalna
                </Button>
                
                <Button 
                  onClick={sendOrderConfirmation}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <TestResultBadge result={testResults.order} />
                  Potwierdzenie Zamówienia
                </Button>
                
                <Button 
                  onClick={sendLoyaltyReward}
                  disabled={loading}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <TestResultBadge result={testResults.loyalty} />
                  Nagroda Lojalnościowa
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Communication */}
        <TabsContent value="bulk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-stefano-gold">Newsletter Email</CardTitle>
                <TestResultBadge result={testResults.newsletter} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="campaign-title">Tytuł kampanii</Label>
                  <Input
                    id="campaign-title"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="email-list">Lista adresów email (jeden na linię)</Label>
                  <Textarea
                    id="email-list"
                    value={emailList}
                    onChange={(e) => setEmailList(e.target.value)}
                    placeholder="test1@example.com&#10;test2@example.com"
                    className="bg-gray-700 border-gray-600 h-32"
                  />
                </div>
                <Button 
                  onClick={sendNewsletter}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Wyślij Newsletter
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-stefano-gold">SMS Promocyjny</CardTitle>
                <TestResultBadge result={testResults.promotion} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="promotion-message">Wiadomość promocyjna</Label>
                  <Textarea
                    id="promotion-message"
                    value={promotionMessage}
                    onChange={(e) => setPromotionMessage(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="phone-list">Lista numerów (jeden na linię)</Label>
                  <Textarea
                    id="phone-list"
                    value={phoneList}
                    onChange={(e) => setPhoneList(e.target.value)}
                    placeholder="+48123456789&#10;+48987654321"
                    className="bg-gray-700 border-gray-600 h-32"
                  />
                </div>
                <Button 
                  onClick={sendPromotionSMS}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Wyślij SMS Promocyjny
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Profiles Integration */}
        <TabsContent value="profiles" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-stefano-gold">Profile klientów</CardTitle>
              <CardDescription>Uproszczone profile klientów w systemie komunikacji</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { id: 'woman', name: 'Kobieta', emoji: '👩' },
                  { id: 'man', name: 'Mężczyzna', emoji: '👨' }
                ].map(profile => (
                  <div key={profile.id} className="text-center space-y-3">
                    <div className="text-4xl">{profile.emoji}</div>
                    <div>
                      <h4 className="font-semibold text-stefano-gold">{profile.name}</h4>
                      <p className="text-sm text-gray-400">Profil standardowy</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-stefano-red/10 border border-stefano-red rounded-lg">
                <h4 className="font-semibold text-stefano-gold mb-2">Integracja z komunikacją:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Profile wyświetlane w emailach powitalnych</li>
                  <li>• SMS zawiera podstawowe informacje klienta</li>
                  <li>• Automatyczne powiadomienia o statusie zamówień</li>
                  <li>• Personalizowane wiadomości bazowane na poziomie</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}