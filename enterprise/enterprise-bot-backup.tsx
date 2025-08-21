import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Users, Eye, MessageSquare, Globe, Search, Award, Zap, Shield, Crown, Target, Rocket, Brain, Bot, ChartBar, DollarSign, Calendar, Clock, Star, Download, Refresh, Settings, Activity, Database, Cpu, Network } from "lucide-react";

interface EnterpriseMetrics {
  totalRevenue: number;
  monthlyOrders: number;
  customerSatisfaction: number;
  marketShare: number;
  seoScore: number;
  conversionRate: number;
  avgOrderValue: number;
  customerRetention: number;
}

interface CompetitorData {
  name: string;
  rating: number;
  location: string;
  marketShare: number;
  avgPrice: number;
  strengths: string[];
  weaknesses: string[];
}

interface SEOAnalysis {
  keywords: Array<{ keyword: string; position: number; traffic: number; revenue: number }>;
  backlinks: number;
  organicTraffic: number;
  pageSpeed: number;
  mobileScore: number;
}

export default function EnterpriseBot() {
  const [metrics, setMetrics] = useState<EnterpriseMetrics>({
    totalRevenue: 84562,
    monthlyOrders: 1248,
    customerSatisfaction: 4.7,
    marketShare: 12.3,
    seoScore: 89,
    conversionRate: 3.2,
    avgOrderValue: 67.8,
    customerRetention: 78.5
  });

  const [competitors, setCompetitors] = useState<CompetitorData[]>([
    {
      name: "Pizzeria Bella",
      rating: 4.5,
      location: "ul. Piotrkowska 24",
      marketShare: 8.7,
      avgPrice: 42,
      strengths: ["Szybka dostawa", "Tradycyjne przepisy"],
      weaknesses: ["Ograniczone menu", "Przestarzała strona"]
    },
    {
      name: "Kurczak Express",
      rating: 4.3,
      location: "ul. Wojska Polskiego 8", 
      marketShare: 6.2,
      avgPrice: 38,
      strengths: ["Niskie ceny", "Duże porcje"],
      weaknesses: ["Słaba jakość", "Brak opcji online"]
    },
    {
      name: "Burger House",
      rating: 4.2,
      location: "ul. Czapliniecka 15",
      marketShare: 5.8,
      avgPrice: 45,
      strengths: ["Świeże składniki", "Nowoczesny lokal"],
      weaknesses: ["Wysokie ceny", "Mała lokalizacja"]
    }
  ]);

  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis>({
    keywords: [
      { keyword: "pizza Bełchatów", position: 1, traffic: 820, revenue: 5200 },
      { keyword: "restauracja Bełchatów", position: 2, traffic: 450, revenue: 2800 },
      { keyword: "burger Bełchatów", position: 3, traffic: 280, revenue: 1800 },
      { keyword: "dostawa jedzenia", position: 4, traffic: 380, revenue: 2100 },
      { keyword: "kurczak Bełchatów", position: 2, traffic: 220, revenue: 1600 }
    ],
    backlinks: 23,
    organicTraffic: 1820,
    pageSpeed: 95,
    mobileScore: 92
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const runComprehensiveAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const generateBusinessInsights = () => {
    return [
      {
        title: "Dominacja w SEO",
        description: "Stefano przoduje w lokalnych wyszukiwaniach dla 'pizza Bełchatów' (pozycja #1)",
        impact: "Wysoki",
        action: "Rozszerz strategię SEO na inne kategorie jedzenia",
        color: "text-green-400"
      },
      {
        title: "Przewaga konkurencyjna",
        description: "12.3% udziału w rynku lokalnym - lider w segmencie premium",
        impact: "Krytyczny",
        action: "Utrzymaj wysoką jakość, rozwijaj program lojalnościowy",
        color: "text-blue-400"
      },
      {
        title: "Optymalizacja konwersji",
        description: "3.2% współczynnik konwersji - możliwość poprawy do 5%",
        impact: "Średni",
        action: "Uprość proces zamawiania, dodaj więcej opcji płatności",
        color: "text-yellow-400"
      },
      {
        title: "Retencja klientów",
        description: "78.5% klientów powraca - dobry wynik, ale można poprawić",
        impact: "Średni", 
        action: "Rozwijaj personalizowane oferety, program VIP",
        color: "text-purple-400"
      }
    ];
  };

  const getMarketAnalysis = () => {
    return {
      totalMarketValue: 680000, // zł/miesiąc
      stefanoShare: 84562,
      growthOpportunity: 156000,
      recommendations: [
        "Ekspansja na catering firmowy (+23% potencjalnego wzrostu)",
        "Rozwój aplikacji mobilnej (+18% lepszej konwersji)",
        "Marketing w social media (+15% zasięgu)",
        "Program partnerski z lokalnym biznesem (+12% nowych klientów)"
      ]
    };
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Stefano Enterprise AI</h1>
              <p className="text-gray-400">Zaawansowany system analizy biznesowej</p>
            </div>
          </div>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            Enterprise v2.0
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="competitors" className="data-[state=active]:bg-purple-600">
            <Target className="w-4 h-4 mr-2" />
            Konkurencja
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-green-600">
            <Search className="w-4 h-4 mr-2" />
            SEO & Marketing
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-orange-600">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-red-600">
            <Rocket className="w-4 h-4 mr-2" />
            Analiza
          </TabsTrigger>
        </TabsList>

        {/* Enterprise Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Przychód Miesięczny</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.totalRevenue.toLocaleString()} zł</div>
                <p className="text-xs text-green-400">+12.4% vs poprzedni miesiąc</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Zamówienia</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.monthlyOrders}</div>
                <p className="text-xs text-blue-400">+8.7% wzrost</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Satysfakcja Klientów</CardTitle>
                <Star className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.customerSatisfaction}/5.0</div>
                <p className="text-xs text-yellow-400">Bardzo wysokie zadowolenie</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Udział w Rynku</CardTitle>
                <Crown className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.marketShare}%</div>
                <p className="text-xs text-purple-400">Lider lokalny</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Wydajność Biznesowa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">SEO Score</span>
                    <span className="text-white">{metrics.seoScore}/100</span>
                  </div>
                  <Progress value={metrics.seoScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Konwersja</span>
                    <span className="text-white">{metrics.conversionRate}%</span>
                  </div>
                  <Progress value={metrics.conversionRate * 20} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Retencja Klientów</span>
                    <span className="text-white">{metrics.customerRetention}%</span>
                  </div>
                  <Progress value={metrics.customerRetention} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Analiza Rynku</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wartość rynku lokalnego</span>
                    <span className="text-white font-bold">680,000 zł/mies.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Udział Stefano</span>
                    <span className="text-green-400 font-bold">{metrics.totalRevenue.toLocaleString()} zł</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Potencjał wzrostu</span>
                    <span className="text-blue-400 font-bold">+156,000 zł</span>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Pozycja lidera potwierdzona
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competitor Analysis */}
        <TabsContent value="competitors" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Analiza Konkurencji - Bełchatów
              </CardTitle>
              <CardDescription className="text-gray-400">
                Porównanie głównych konkurentów w segmencie gastronomicznym
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors.map((competitor, index) => (
                  <div key={index} className="p-4 bg-gray-900 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{competitor.name}</h4>
                        <p className="text-sm text-gray-400">{competitor.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">{competitor.rating}</div>
                        <div className="text-xs text-gray-400">Google Rating</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-400">Udział w rynku:</span>
                        <div className="text-lg font-semibold text-white">{competitor.marketShare}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Średnia cena:</span>
                        <div className="text-lg font-semibold text-white">{competitor.avgPrice} zł</div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-green-400">Mocne strony:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {competitor.strengths.map((strength, i) => (
                              <Badge key={i} variant="outline" className="border-green-500 text-green-400 text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-red-400">Słabe strony:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {competitor.weaknesses.map((weakness, i) => (
                              <Badge key={i} variant="outline" className="border-red-500 text-red-400 text-xs">
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO & Marketing */}
        <TabsContent value="seo" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-green-400" />
                  Analiza SEO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-green-400 mb-2">{seoAnalysis.pageSpeed}/100</div>
                  <p className="text-gray-400">Ogólny wynik SEO</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ruch organiczny</span>
                    <span className="text-white font-semibold">{seoAnalysis.organicTraffic}/mies.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Backlinki</span>
                    <span className="text-white font-semibold">{seoAnalysis.backlinks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Page Speed</span>
                    <span className="text-white font-semibold">{seoAnalysis.pageSpeed}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mobile Score</span>
                    <span className="text-white font-semibold">{seoAnalysis.mobileScore}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Słowa Kluczowe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoAnalysis.keywords.map((keyword, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{keyword.keyword}</div>
                        <div className="text-sm text-gray-400">Pozycja #{keyword.position}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">{keyword.revenue} zł/mies.</div>
                        <div className="text-xs text-gray-400">{keyword.traffic} odwiedzin</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                AI Business Insights
              </CardTitle>
              <CardDescription className="text-gray-400">
                Zaawansowana analiza AI dla optymalizacji biznesu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generateBusinessInsights().map((insight, index) => (
                  <div key={index} className="p-4 bg-gray-900 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                      <Badge variant="outline" className={`border-current ${insight.color}`}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-3">{insight.description}</p>
                    <div className="bg-gray-800 p-3 rounded border-l-4 border-blue-500">
                      <span className="text-sm text-blue-400 font-medium">Rekomendacja:</span>
                      <p className="text-sm text-gray-300 mt-1">{insight.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comprehensive Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Rocket className="w-5 h-5 text-red-400" />
                Kompleksowa Analiza Biznesowa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Button 
                    onClick={runComprehensiveAnalysis}
                    disabled={isAnalyzing}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        Analizuję...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Uruchom Analizę Enterprise
                      </>
                    )}
                  </Button>
                  
                  {analysisProgress > 0 && (
                    <div className="flex-1 ml-4">
                      <Progress value={analysisProgress} className="h-3" />
                      <p className="text-sm text-gray-400 mt-1">Postęp: {analysisProgress}%</p>
                    </div>
                  )}
                </div>

                {analysisProgress === 100 && (
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-600">
                    <h4 className="text-lg font-semibold text-white mb-4">Wyniki Analizy Enterprise</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-md font-semibold text-green-400 mb-3">Kluczowe Sukcesy:</h5>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>✓ #1 pozycja w Google dla "pizza Bełchatów"</li>
                          <li>✓ 12.3% udziału w lokalnym rynku gastronomicznym</li>
                          <li>✓ 4.7/5.0 średnia ocena klientów</li>
                          <li>✓ 78.5% wskaźnik retencji klientów</li>
                          <li>✓ Silna pozycja w segmencie premium</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="text-md font-semibold text-yellow-400 mb-3">Obszary Rozwoju:</h5>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>→ Zwiększenie konwersji z 3.2% do 5%</li>
                          <li>→ Ekspansja na catering firmowy</li>
                          <li>→ Rozwój aplikacji mobilnej</li>
                          <li>→ Wzmocnienie social media</li>
                          <li>→ Program partnerski z lokalnym biznesem</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <h5 className="text-md font-semibold text-blue-400 mb-2">Prognoza Wzrostu na 2025:</h5>
                      <p className="text-sm text-gray-300">
                        Przy wdrożeniu rekomendowanych strategii, przewidywany wzrost przychodów o <strong className="text-blue-400">23-35%</strong> w ciągu następnych 12 miesięcy.
                        Potencjalny dodatkowy przychód: <strong className="text-green-400">156,000 zł/rok</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}