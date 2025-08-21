import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Key, Shield, CheckCircle, XCircle, Lock, AlertTriangle, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  name: string;
  key: string;
  status: 'not_set' | 'valid' | 'invalid' | 'testing';
  description: string;
  example: string;
  required: boolean;
  features: string[];
}

export default function ApiConfig() {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [apiKeys, setApiKeys] = useState<{[key: string]: ApiKey}>({
    'OPENAI_API_KEY': {
      name: 'OpenAI API Key',
      key: '',
      status: 'not_set',
      description: 'Klucz dla inteligentnego chatbota i AI funkcji',
      example: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      required: false,
      features: ['Inteligentny chatbot', 'Rekomendacje dań', 'Analiza komentarzy', 'AI asystent']
    },
    'STRIPE_SECRET_KEY': {
      name: 'Stripe Secret Key',
      key: '',
      status: 'not_set', 
      description: 'Klucz prywatny dla płatności online',
      example: 'STRIPE_SK_PLACEHOLDER',
      required: false,
      features: ['Płatności kartą', 'BLIK online', 'Automatyczne faktury', 'Subskrypcje']
    },
    'VITE_STRIPE_PUBLIC_KEY': {
      name: 'Stripe Public Key',
      key: '',
      status: 'not_set',
      description: 'Klucz publiczny Stripe (bezpieczny)',
      example: 'STRIPE_PK_PLACEHOLDER',
      required: false,
      features: ['Frontend płatności', 'Formularz karty', 'Stripe Elements']
    },
    'SENDGRID_API_KEY': {
      name: 'SendGrid API Key',
      key: '',
      status: 'not_set',
      description: 'Klucz dla wysyłania emaili i newslettera',
      example: 'SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      required: false,
      features: ['Potwierdzenia zamówień', 'Newsletter', 'Powiadomienia', 'Kampanie email']
    },
    'VITE_GA_MEASUREMENT_ID': {
      name: 'Google Analytics ID',
      key: '',
      status: 'not_set',
      description: 'ID dla Google Analytics (bezpieczne)',
      example: 'G-XXXXXXXXXX',
      required: false,
      features: ['Śledzenie ruchu', 'Analiza użytkowników', 'Raporty sprzedaży', 'ROI kampanii']
    }
  });

  const toggleShowKey = (keyName: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyName]: !prev[keyName]
    }));
  };

  const updateApiKey = (keyName: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [keyName]: {
        ...prev[keyName],
        key: value,
        status: value ? 'testing' : 'not_set'
      }
    }));
  };

  const validateKey = async (keyName: string) => {
    const key = apiKeys[keyName];
    if (!key.key) return;

    setApiKeys(prev => ({
      ...prev,
      [keyName]: { ...prev[keyName], status: 'testing' }
    }));

    try {
      const response = await fetch('/api/admin/test-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyName,
          keyValue: key.key
        })
      });

      const result = await response.json();

      setApiKeys(prev => ({
        ...prev,
        [keyName]: { 
          ...prev[keyName], 
          status: result.valid ? 'valid' : 'invalid' 
        }
      }));

      toast({
        title: result.valid ? "Klucz zweryfikowany" : "Błędny klucz",
        description: result.message,
        variant: result.valid ? "default" : "destructive"
      });

    } catch (error) {
      setApiKeys(prev => ({
        ...prev,
        [keyName]: { ...prev[keyName], status: 'invalid' }
      }));

      toast({
        title: "Błąd weryfikacji",
        description: "Nie udało się zweryfikować klucza API",
        variant: "destructive"
      });
    }
  };

  const saveAllKeys = async () => {
    setIsUpdating(true);
    
    try {
      const keysToSave = Object.entries(apiKeys)
        .filter(([_, keyData]) => keyData.key && keyData.status === 'valid')
        .map(([keyName, keyData]) => ({ keyName, keyValue: keyData.key }));

      if (keysToSave.length === 0) {
        toast({
          title: "Brak kluczy do zapisania",
          description: "Dodaj i zweryfikuj klucze przed zapisaniem",
          variant: "destructive"
        });
        return;
      }

      const results = await Promise.all(
        keysToSave.map(async ({ keyName, keyValue }) => {
          const response = await fetch('/api/admin/api-keys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyName, keyValue })
          });
          return response.json();
        })
      );

      const successful = results.filter(r => r.success).length;
      const failed = results.length - successful;

      if (failed === 0) {
        toast({
          title: "Klucze zapisane",
          description: `Wszystkie ${successful} kluczy API zostało bezpiecznie zapisanych`,
        });
      } else {
        toast({
          title: "Częściowy sukces",
          description: `Zapisano ${successful} kluczy, ${failed} się nie powiodło`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      toast({
        title: "Błąd zapisu",
        description: "Nie udało się zapisać kluczy API",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      default:
        return <Key className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aktywny</Badge>;
      case 'invalid':
        return <Badge variant="destructive">Błędny</Badge>;
      case 'testing':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Testowanie...</Badge>;
      default:
        return <Badge variant="outline">Nieskonfigurowany</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-stefano-gold">Konfiguracja API</h2>
          <p className="text-gray-300">Bezpieczne zarządzanie kluczami API</p>
        </div>
        <Button 
          onClick={saveAllKeys}
          disabled={isUpdating}
          className="bg-stefano-red hover:bg-red-700"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Zapisywanie...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Zapisz Wszystkie
            </>
          )}
        </Button>
      </div>

      <Alert className="border-yellow-500/30 bg-yellow-500/10">
        <Shield className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-200">
          <strong>Bezpieczeństwo:</strong> Klucze są szyfrowane i przechowywane bezpiecznie. 
          Nie są wysyłane na zewnętrzne serwery. Dostęp tylko dla administratorów.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="configure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="configure">Konfiguracja</TabsTrigger>
          <TabsTrigger value="status">Status i Funkcje</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          {Object.entries(apiKeys).map(([keyName, keyData]) => (
            <Card key={keyName} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(keyData.status)}
                      {keyData.name}
                    </CardTitle>
                    <CardDescription>{keyData.description}</CardDescription>
                  </div>
                  {getStatusBadge(keyData.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showKeys[keyName] ? "text" : "password"}
                      placeholder={keyData.example}
                      value={keyData.key}
                      onChange={(e) => updateApiKey(keyName, e.target.value)}
                      className="bg-gray-800 border-gray-600 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => toggleShowKey(keyName)}
                    >
                      {showKeys[keyName] ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  <Button
                    onClick={() => validateKey(keyName)}
                    disabled={!keyData.key || keyData.status === 'testing'}
                    variant="outline"
                  >
                    {keyData.status === 'testing' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Testuj'
                    )}
                  </Button>
                </div>

                <div className="text-sm text-gray-400">
                  <strong>Aktywuje funkcje:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {keyData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(apiKeys).map(([keyName, keyData]) => (
              <Card key={keyName} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(keyData.status)}
                    {keyData.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getStatusBadge(keyData.status)}
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Dostępne funkcje:</h4>
                    <ul className="text-xs space-y-1">
                      {keyData.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {keyData.status === 'valid' ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <Lock className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={keyData.status === 'valid' ? 'text-green-300' : 'text-gray-400'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Instrukcje Bezpieczeństwa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Klucze są szyfrowane AES-256 przed zapisem</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Dostęp tylko przez panel administracyjny</span>
                </li>
                <li className="flex items-start gap-2">
                  <Key className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Regularnie rotuj klucze API (co 90 dni)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <span>Nigdy nie udostępniaj kluczy osobom nieuprawnionym</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}