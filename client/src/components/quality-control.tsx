import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, XCircle, Clock, Star, TrendingUp, Shield, Award, Eye, Target, BarChart3 } from "lucide-react";

interface QualityMetric {
  id: string;
  name: string;
  value: number;
  status: 'high' | 'medium' | 'low';
  trend: number;
  description: string;
}

interface QualityCheck {
  id: string;
  category: string;
  title: string;
  status: 'passed' | 'warning' | 'failed' | 'pending';
  score: number;
  details: string;
  timestamp: Date;
  assignedTo: string;
}

export default function QualityControl() {
  const [metrics, setMetrics] = useState<QualityMetric[]>([
    {
      id: 'overall',
      name: 'Ogólna Jakość',
      value: 94,
      status: 'high',
      trend: 8,
      description: 'Ogólny wskaźnik jakości wszystkich procesów'
    },
    {
      id: 'code',
      name: 'Jakość Kodu',
      value: 91,
      status: 'high',
      trend: 5,
      description: 'Analiza jakości kodu TypeScript/React'
    },
    {
      id: 'performance',
      name: 'Wydajność',
      value: 87,
      status: 'high',
      trend: 12,
      description: 'Metryki wydajności aplikacji'
    },
    {
      id: 'security',
      name: 'Bezpieczeństwo',
      value: 89,
      status: 'high',
      trend: 3,
      description: 'Audyt bezpieczeństwa systemu'
    },
    {
      id: 'ux',
      name: 'Doświadczenie UX',
      value: 76,
      status: 'medium',
      trend: -2,
      description: 'Analiza interfejsu użytkownika'
    },
    {
      id: 'api',
      name: 'Jakość API',
      value: 85,
      status: 'high',
      trend: 7,
      description: 'Stabilność i dokumentacja API'
    }
  ]);

  const [checks, setChecks] = useState<QualityCheck[]>([
    {
      id: '1',
      category: 'Kod',
      title: 'TypeScript Coverage',
      status: 'passed',
      score: 98,
      details: 'Wszystkie komponenty mają pełne typowanie TypeScript',
      timestamp: new Date(),
      assignedTo: 'Dev Team'
    },
    {
      id: '2',
      category: 'Kod',
      title: 'ESLint Rules',
      status: 'warning',
      score: 85,
      details: '3 ostrzeżenia do naprawienia w komponentach',
      timestamp: new Date(),
      assignedTo: 'Senior Dev'
    },
    {
      id: '3',
      category: 'Bezpieczeństwo',
      title: 'API Security Headers',
      status: 'passed',
      score: 95,
      details: 'Wszystkie nagłówki bezpieczeństwa są aktywne',
      timestamp: new Date(),
      assignedTo: 'Security Team'
    },
    {
      id: '4',
      category: 'Wydajność',
      title: 'Lighthouse Score',
      status: 'passed',
      score: 92,
      details: 'Wynik Lighthouse powyżej 90 punktów',
      timestamp: new Date(),
      assignedTo: 'Performance Team'
    },
    {
      id: '5',
      category: 'UX',
      title: 'Mobile Responsiveness',
      status: 'warning',
      score: 78,
      details: 'Niektóre komponenty wymagają optymalizacji na mobile',
      timestamp: new Date(),
      assignedTo: 'UX Designer'
    },
    {
      id: '6',
      category: 'API',
      title: 'Database Performance',
      status: 'passed',
      score: 88,
      details: 'Zapytania wykonują się w średnio 200ms',
      timestamp: new Date(),
      assignedTo: 'Backend Team'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-emerald-900/20 text-emerald-400 border-emerald-400/20';
      case 'warning':
        return 'bg-amber-900/20 text-amber-400 border-amber-400/20';
      case 'failed':
        return 'bg-red-900/20 text-red-400 border-red-400/20';
      default:
        return 'bg-blue-900/20 text-blue-400 border-blue-400/20';
    }
  };

  const getQualityColor = (status: 'high' | 'medium' | 'low') => {
    switch (status) {
      case 'high':
        return 'text-emerald-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-red-400';
    }
  };

  const overallScore = Math.round(metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length);

  const styles = `
    .quality-control-container {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      min-height: 100vh;
      color: #ffffff;
    }
    
    .enterprise-header {
      background: rgba(10, 10, 20, 0.9);
      padding: 25px 40px;
      border-bottom: 1px solid #0f3460;
      backdrop-filter: blur(10px);
    }
    
    .quality-card {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    
    .quality-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      border-color: #e94560;
    }
    
    .metric-circle {
      background: conic-gradient(from 0deg, #e94560 0%, #4361ee 50%, #0f3460 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .approval-stats {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      border: 1px solid rgba(233, 69, 96, 0.2);
    }
    
    .stat-value {
      color: #e94560;
      font-weight: 700;
    }
    
    .trend-positive {
      color: #4caf50;
    }
    
    .trend-negative {
      color: #e94560;
    }
  `;

  return (
    <div className="quality-control-container p-6">
      <style>{styles}</style>
      
      {/* Header */}
      <div className="enterprise-header rounded-xl mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Stefano <span className="text-red-500">Kontrola Jakości</span>
              </h1>
              <p className="text-gray-300 mt-1">Enterprise Quality Assurance System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2 border-red-500 text-red-400">
              <Award className="w-4 h-4 mr-2" />
              Quality Score: {overallScore}%
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-red-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Przegląd
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-red-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Metryki
          </TabsTrigger>
          <TabsTrigger value="checks" className="data-[state=active]:bg-red-600">
            <Eye className="w-4 h-4 mr-2" />
            Kontrole
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600">
            <Target className="w-4 h-4 mr-2" />
            Analityka
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.id} className="quality-card border-slate-700">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{metric.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${metric.trend > 0 ? 'trend-positive' : 'trend-negative'}`}>
                        {metric.trend > 0 ? '+' : ''}{metric.trend}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="metric-circle w-16 h-16">
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                        <span className={`text-xl font-bold ${getQualityColor(metric.status)}`}>
                          {metric.value}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Progress value={metric.value} className="h-2 mb-2" />
                      <p className="text-sm text-gray-400">{metric.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="approval-stats p-6">
              <div className="text-center">
                <div className="stat-value text-2xl font-bold mb-2">{checks.filter(c => c.status === 'passed').length}</div>
                <div className="text-gray-300 text-sm">Testy Zaliczone</div>
              </div>
            </div>
            <div className="approval-stats p-6">
              <div className="text-center">
                <div className="text-amber-400 text-2xl font-bold mb-2">{checks.filter(c => c.status === 'warning').length}</div>
                <div className="text-gray-300 text-sm">Ostrzeżenia</div>
              </div>
            </div>
            <div className="approval-stats p-6">
              <div className="text-center">
                <div className="text-red-400 text-2xl font-bold mb-2">{checks.filter(c => c.status === 'failed').length}</div>
                <div className="text-gray-300 text-sm">Błędy</div>
              </div>
            </div>
            <div className="approval-stats p-6">
              <div className="text-center">
                <div className="text-blue-400 text-2xl font-bold mb-2">{checks.filter(c => c.status === 'pending').length}</div>
                <div className="text-gray-300 text-sm">Oczekujące</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.id} className="quality-card border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Star className="w-5 h-5 text-red-500" />
                    {metric.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {metric.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Aktualny wynik:</span>
                      <span className={`text-xl font-bold ${getQualityColor(metric.status)}`}>
                        {metric.value}%
                      </span>
                    </div>
                    <Progress value={metric.value} className="h-3" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Trend miesięczny:</span>
                      <span className={metric.trend > 0 ? 'trend-positive' : 'trend-negative'}>
                        {metric.trend > 0 ? '+' : ''}{metric.trend}%
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-700">
                      <Badge variant="outline" className={getStatusColor(metric.status)}>
                        {metric.status === 'high' ? 'Wysoka jakość' : 
                         metric.status === 'medium' ? 'Średnia jakość' : 'Niska jakość'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Checks Tab */}
        <TabsContent value="checks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {checks.map((check) => (
              <Card key={check.id} className="quality-card border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        {check.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-1">
                        Kategoria: {check.category} • Przypisane: {check.assignedTo}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(check.status)}>
                      {check.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{check.details}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Ostatnia kontrola:</span>
                    <span>{check.timestamp.toLocaleDateString('pl-PL')}</span>
                  </div>
                  <Progress value={check.score} className="h-2 mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="quality-card border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Trend Jakości (30 dni)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <p>Wykres trendu jakości</p>
                    <p className="text-sm mt-2">Średni wzrost: +5.2% miesięcznie</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="quality-card border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Target className="w-5 h-5 text-red-500" />
                  Cele Jakości
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Cel Q1 2025</span>
                      <span className="text-red-400 font-bold">95%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <p className="text-xs text-gray-400 mt-1">1% do celu</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Zero błędów krytycznych</span>
                      <span className="text-emerald-400 font-bold">✓</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-xs text-gray-400 mt-1">Cel osiągnięty</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Pokrycie testów</span>
                      <span className="text-amber-400 font-bold">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-gray-400 mt-1">Cel: 90%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="quality-card border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Award className="w-5 h-5 text-red-500" />
                Rekomendacje Poprawy Jakości
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold text-blue-400 mb-2">🔧 Optymalizacja wydajności</h4>
                  <p className="text-sm text-gray-300">Implementacja lazy loading dla komponentów</p>
                </div>
                <div className="p-4 bg-amber-900/20 rounded-lg border border-amber-500/20">
                  <h4 className="font-semibold text-amber-400 mb-2">📱 Mobile UX</h4>
                  <p className="text-sm text-gray-300">Poprawa responsywności na urządzeniach mobilnych</p>
                </div>
                <div className="p-4 bg-emerald-900/20 rounded-lg border border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 mb-2">🔒 Bezpieczeństwo</h4>
                  <p className="text-sm text-gray-300">Dodanie dodatkowej walidacji danych wejściowych</p>
                </div>
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                  <h4 className="font-semibold text-purple-400 mb-2">📊 Monitoring</h4>
                  <p className="text-sm text-gray-300">Rozszerzenie systemu logowania błędów</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}