import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Smartphone, Monitor, Settings, Zap, Crown, Star, Globe, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DownloadCenter() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const { toast } = useToast();

  const downloadFile = async (endpoint: string, filename: string, title: string) => {
    setDownloading(endpoint);
    
    toast({
      title: `📥 Pobieranie ${title}`,
      description: "Generowanie pakietu...",
      duration: 3000,
    });

    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Błąd pobierania: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ Pobrano pomyślnie",
        description: `${title} został pobrany`,
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "❌ Błąd pobierania",
        description: error.message || "Spróbuj ponownie za chwilę",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Download className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Centrum Pobierania
            </h1>
            <Download className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-xl text-gray-300">
            Stefano Restaurant - Wszystkie wersje aplikacji
          </p>
          <Badge variant="outline" className="mt-2 border-purple-500 text-purple-400">
            3 wersje • Autostart • Online/Offline
          </Badge>
        </div>

        <Tabs defaultValue="downloads" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-8">
            <TabsTrigger value="downloads" className="data-[state=active]:bg-purple-600">
              <Download className="w-4 h-4 mr-2" />
              Pobieranie
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-purple-600">
              <Star className="w-4 h-4 mr-2" />
              Funkcje
            </TabsTrigger>
            <TabsTrigger value="autostart" className="data-[state=active]:bg-purple-600">
              <Zap className="w-4 h-4 mr-2" />
              Autostart
            </TabsTrigger>
            <TabsTrigger value="panel" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Panel
            </TabsTrigger>
          </TabsList>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Complete Standalone App */}
              <Card className="bg-gray-800/50 border-green-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-bold">
                  POLECANE
                </div>
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Complete Standalone App
                  </CardTitle>
                  <CardDescription>
                    Pełna funkcjonalność strony Stefano w jednym pakiecie
                  </CardDescription>
                  <Badge className="w-fit bg-green-600">11KB</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-green-400" />
                      <span>Pełna funkcjonalność online</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <WifiOff className="w-4 h-4 text-blue-400" />
                      <span>100% działanie offline</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Autostart Windows/Android/iOS</span>
                    </div>
                  </div>
                  
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 🍽️ Kompletne menu z cenami</li>
                    <li>• 📝 System zamówień online</li>
                    <li>• 🎨 Cyberpunkowe avatary</li>
                    <li>• 👑 Program lojalnościowy</li>
                    <li>• 📞 Formularz kontaktowy</li>
                    <li>• 💾 Local Storage + PWA</li>
                  </ul>
                  
                  <Button
                    onClick={() => downloadFile('/api/download/complete-app', 'stefano-restaurant-complete-standalone.zip', 'Complete App')}
                    disabled={downloading === '/api/download/complete-app'}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {downloading === '/api/download/complete-app' ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Pobieranie...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Pobierz Complete App
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Standalone Mobile App */}
              <Card className="bg-gray-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Standalone Mobile App
                  </CardTitle>
                  <CardDescription>
                    Aplikacja mobilna z podstawową funkcjonalnością
                  </CardDescription>
                  <Badge className="w-fit bg-blue-600">8.1KB</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="w-4 h-4 text-blue-400" />
                      <span>Optymalizacja mobilna</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <WifiOff className="w-4 h-4 text-purple-400" />
                      <span>Działanie offline</span>
                    </div>
                  </div>
                  
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 🎨 2 Cyberpunkowe avatary</li>
                    <li>• 📱 Touch-friendly interface</li>
                    <li>• ⚙️ Ustawienia lokalne</li>
                    <li>• 🔄 PWA functionality</li>
                    <li>• 🎵 Efekty dźwiękowe</li>
                  </ul>
                  
                  <Button
                    onClick={() => downloadFile('/api/download/mobile-app', 'stefano-restaurant-mobile-app.zip', 'Mobile App')}
                    disabled={downloading === '/api/download/mobile-app'}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {downloading === '/api/download/mobile-app' ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Pobieranie...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4 mr-2" />
                        Pobierz Mobile App
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* ZIP z Autostartowaniem */}
              <Card className="bg-gray-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    ZIP z Autostartowaniem
                  </CardTitle>
                  <CardDescription>
                    SVG avatary z skryptami autostart
                  </CardDescription>
                  <Badge className="w-fit bg-purple-600">5.4KB</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span>Autostart scripts</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-cyan-400" />
                      <span>SVG z animacjami</span>
                    </div>
                  </div>
                  
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 🎨 2 SVG avatary HD</li>
                    <li>• 🪟 Windows autostart.bat</li>
                    <li>• 🤖 Android autostart.sh</li>
                    <li>• 📱 iOS autostart.sh</li>
                    <li>• ⚙️ Pliki konfiguracyjne</li>
                  </ul>
                  
                  <Button
                    onClick={() => downloadFile('/api/download/avatars-mobile', 'stefano-restaurant-mobile-autostart.zip', 'ZIP Autostart')}
                    disabled={downloading === '/api/download/avatars-mobile'}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {downloading === '/api/download/avatars-mobile' ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Pobieranie...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Pobierz ZIP Autostart
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <Card className="bg-gray-800/30 border-gray-600">
              <CardHeader>
                <CardTitle className="text-cyan-400">🔗 Bezpośrednie Linki</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-700/50 p-3 rounded">
                    <strong className="text-green-400">Complete App:</strong>
                    <br />
                    <code className="text-xs text-gray-300">/api/download/complete-app</code>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded">
                    <strong className="text-blue-400">Mobile App:</strong>
                    <br />
                    <code className="text-xs text-gray-300">/api/download/mobile-app</code>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded">
                    <strong className="text-purple-400">ZIP Autostart:</strong>
                    <br />
                    <code className="text-xs text-gray-300">/api/download/avatars-mobile</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-green-400">🚀 Complete Standalone App</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Pełne Menu Restauracji</strong>
                        <p className="text-sm text-gray-400">Pizza (46-72zł), Burgery (24-29zł), Tortille (22-26zł)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>System Zamówień Online</strong>
                        <p className="text-sm text-gray-400">Formularz + integracja WhatsApp (516 166 18)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Program Lojalnościowy</strong>
                        <p className="text-sm text-gray-400">Bronze/Silver/Gold/Platinum z punktami i nagrodami</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Cyberpunkowe Avatary</strong>
                        <p className="text-sm text-gray-400">2 animowane SVG z efektami glow</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-blue-400">📱 Mobile & Offline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Progressive Web App</strong>
                        <p className="text-sm text-gray-400">Service Worker + manifst.json</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Local Storage</strong>
                        <p className="text-sm text-gray-400">Zamówienia, członkowie, kontakty zapisywane lokalnie</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Responsive Design</strong>
                        <p className="text-sm text-gray-400">Działa na telefonach, tabletach i komputerach</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong>Online/Offline Sync</strong>
                        <p className="text-sm text-gray-400">Automatyczna synchronizacja gdy połączenie wróci</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Autostart Tab */}
          <TabsContent value="autostart" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400">🪟 Windows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-700/50 p-3 rounded">
                      <strong>autostart.bat</strong>
                      <p className="text-gray-400 mt-1">Uruchom jako administrator</p>
                    </div>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Kopiuje app do %USERPROFILE%</li>
                      <li>• Dodaje do autostartu Windows</li>
                      <li>• Uruchamia w domyślnej przeglądarce</li>
                      <li>• Rejestr Windows Run</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">🤖 Android</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-700/50 p-3 rounded">
                      <strong>autostart.sh</strong>
                      <p className="text-gray-400 mt-1">Uruchom w Termux</p>
                    </div>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Kopiuje do /sdcard/Documents/</li>
                      <li>• Uruchamia przez Activity Manager</li>
                      <li>• Dodaje do .bashrc</li>
                      <li>• Chrome/Firefox support</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">📱 iOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-700/50 p-3 rounded">
                      <strong>autostart.sh</strong>
                      <p className="text-gray-400 mt-1">Uruchom w Shortcuts</p>
                    </div>
                    <ul className="text-gray-400 space-y-1">
                      <li>• Kopiuje do Documents</li>
                      <li>• Otwiera w Safari</li>
                      <li>• Shortcuts automation</li>
                      <li>• Add to Home Screen</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-yellow-900/30 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-yellow-400">⚡ Instrukcje Autostart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">Windows:</h4>
                    <ol className="text-gray-300 space-y-1">
                      <li>1. Rozpakuj ZIP</li>
                      <li>2. Kliknij prawym na autostart.bat</li>
                      <li>3. "Uruchom jako administrator"</li>
                      <li>4. App uruchomi się przy starcie PC</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Android:</h4>
                    <ol className="text-gray-300 space-y-1">
                      <li>1. Rozpakuj na telefonie</li>
                      <li>2. Otwórz Termux</li>
                      <li>3. bash autostart.sh</li>
                      <li>4. Dodaj do Shortcuts</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">iOS:</h4>
                    <ol className="text-gray-300 space-y-1">
                      <li>1. Rozpakuj w Files</li>
                      <li>2. Uruchom autostart.sh</li>
                      <li>3. Otwórz w Safari</li>
                      <li>4. "Dodaj do ekranu głównego"</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Panel Tab */}
          <TabsContent value="panel" className="space-y-6">
            <Card className="bg-gray-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">⚙️ Panel Administratora</CardTitle>
                <CardDescription>
                  Zarządzaj aplikacją Stefano z poziomu panelu administracyjnego
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => window.open('/admin', '_blank')}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Panel Administratora
                  </Button>
                  
                  <Button
                    onClick={() => window.open('/avatar-settings', '_blank')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Ustawienia Avatarów
                  </Button>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-cyan-400 mb-3">Funkcje Panelu:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <ul className="text-gray-300 space-y-1">
                        <li>• 📊 Statystyki zamówień</li>
                        <li>• 👑 Zarządzanie programem lojalnościowym</li>
                        <li>• 💬 System komunikacji (SMS/Email)</li>
                        <li>• 🔐 Zarządzanie kluczami API</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="text-gray-300 space-y-1">
                        <li>• 📈 Monitoring kuchni</li>
                        <li>• 📧 Newsletter i kampanie</li>
                        <li>• 🎨 Konfiguracja avatarów</li>
                        <li>• ⚙️ Ustawienia aplikacji</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-600">
              <CardHeader>
                <CardTitle className="text-gray-300">📱 Informacje Kontaktowe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">🍽️ Restaurant & Pub Stefano</h4>
                    <div className="text-gray-300 space-y-1">
                      <p>📍 Bełchatów, ul. Kościuszki</p>
                      <p>📞 Tel: 516 166 18</p>
                      <p>🌐 stefanogroup.pl</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">💻 Aplikacja</h4>
                    <div className="text-gray-300 space-y-1">
                      <p>📦 Wersja: 2.0.0</p>
                      <p>📅 Data: {new Date().toLocaleDateString('pl-PL')}</p>
                      <p>🚀 Status: Production Ready</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}