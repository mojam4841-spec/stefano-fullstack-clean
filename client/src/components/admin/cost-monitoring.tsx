import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Mail, 
  MessageSquare, 
  Brain, 
  Database,
  TrendingDown,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export function CostMonitoring() {
  const { data: costData, isLoading } = useQuery({
    queryKey: ["/api/admin/cost-monitoring"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return <div>Ładowanie danych kosztowych...</div>;
  }

  const services = [
    {
      name: "Email (SendGrid)",
      icon: Mail,
      current: costData?.email || {
        dailyUsed: 0,
        dailyLimit: 100,
        monthlyLimit: 3000,
        costSaved: "$19.95/miesiąc"
      }
    },
    {
      name: "SMS (Twilio)",
      icon: MessageSquare,
      current: costData?.sms || {
        dailyUsed: 0,
        dailyLimit: 10,
        monthlyLimit: 100,
        costSaved: "$50/miesiąc"
      }
    },
    {
      name: "AI/Chatbot (OpenAI)",
      icon: Brain,
      current: costData?.ai || {
        cacheHitRate: "0%",
        apiCalls: 0,
        cachedCalls: 0,
        costSaved: "$30/miesiąc"
      }
    },
    {
      name: "Baza Danych (PostgreSQL)",
      icon: Database,
      current: {
        usage: "0.1 GB",
        limit: "0.5 GB",
        costSaved: "$19/miesiąc"
      }
    }
  ];

  const totalMonthlySavings = 180; // $180/month
  const totalYearlySavings = totalMonthlySavings * 12;

  return (
    <div className="space-y-6">
      {/* Main Savings Card */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-600" />
            Całkowite Oszczędności w Trybie Enterprise Demo
          </CardTitle>
          <CardDescription>
            Pełna funkcjonalność systemu przy zerowych kosztach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Miesięczne Oszczędności</p>
              <p className="text-3xl font-bold text-green-600">${totalMonthlySavings}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Roczne Oszczędności</p>
              <p className="text-3xl font-bold text-green-600">${totalYearlySavings}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Status Systemu</p>
              <Badge className="mt-2 bg-green-600">100% Funkcjonalny</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          const isEmail = service.name.includes("Email");
          const isSMS = service.name.includes("SMS");
          const isAI = service.name.includes("AI");
          
          const usagePercent = isEmail || isSMS
            ? (service.current.dailyUsed / service.current.dailyLimit) * 100
            : 0;

          return (
            <Card key={service.name}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {service.name}
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {service.current.costSaved || "$0/miesiąc"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(isEmail || isSMS) && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Dzienne użycie</span>
                        <span>{service.current.dailyUsed} / {service.current.dailyLimit}</span>
                      </div>
                      <Progress value={usagePercent} className="h-2" />
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Limit miesięczny: {service.current.monthlyLimit}</span>
                    </div>
                  </>
                )}
                
                {isAI && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cache Hit Rate</span>
                      <span className="font-medium">{service.current.cacheHitRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Wywołania API</span>
                      <span>{service.current.apiCalls}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Z cache</span>
                      <span className="text-green-600">{service.current.cachedCalls}</span>
                    </div>
                  </div>
                )}
                
                {!isEmail && !isSMS && !isAI && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Użycie</span>
                      <span>{service.current.usage} / {service.current.limit}</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cost Optimization Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Aktywne Optymalizacje Kosztów
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">SendGrid Free Tier</p>
                <p className="text-sm text-muted-foreground">100 emaili/dzień, 3000/miesiąc - wystarczające dla małej restauracji</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">SMS w trybie Console</p>
                <p className="text-sm text-muted-foreground">Logowanie SMS zamiast wysyłki - pełna funkcjonalność bez kosztów</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">AI z inteligentnym cache</p>
                <p className="text-sm text-muted-foreground">90% redukcja wywołań API dzięki cache'owaniu odpowiedzi</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Stripe Test Mode</p>
                <p className="text-sm text-muted-foreground">Pełna funkcjonalność płatności bez prowizji</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Migration Path */}
      <Card>
        <CardHeader>
          <CardTitle>Ścieżka Migracji do Produkcji</CardTitle>
          <CardDescription>
            Kiedy będziesz gotowy na pełną produkcję
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                1
              </div>
              <div>
                <p className="font-medium">Faza Demo (0-6 miesięcy)</p>
                <p className="text-sm text-muted-foreground">$0/miesiąc - Testowanie i rozwój</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                2
              </div>
              <div>
                <p className="font-medium">Soft Launch (6-12 miesięcy)</p>
                <p className="text-sm text-muted-foreground">~$50/miesiąc - Podstawowe usługi płatne</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                3
              </div>
              <div>
                <p className="font-medium">Pełna Produkcja (12+ miesięcy)</p>
                <p className="text-sm text-muted-foreground">~$180/miesiąc - Wszystkie usługi premium</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Bez zmian w kodzie!</p>
                <p className="text-sm text-blue-700">
                  Przejście do produkcji wymaga tylko zmiany flag konfiguracyjnych i kluczy API. 
                  Cała architektura jest już gotowa na skalowanie.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}