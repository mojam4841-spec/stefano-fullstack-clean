import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Users, Trophy, Gift, MapPin, Clock, Star, Zap, Target, TrendingUp, MessageCircle, Camera, Video, Heart, Send, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViralCampaign {
  id: string;
  title: string;
  description: string;
  type: 'referral' | 'challenge' | 'local-event' | 'influencer' | 'ugc';
  status: 'active' | 'pending' | 'completed';
  reach: number;
  engagement: number;
  conversions: number;
  reward: string;
  endDate: string;
  locations: string[];
}

interface LocalInfluencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement: number;
  location: string;
  category: string;
  rate: number;
  contact: string;
}

interface ViralContent {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  platforms: string[];
  viralScore: number;
  shares: number;
  likes: number;
  comments: number;
  localReach: number;
}

export default function ViralMarketing() {
  const { toast } = useToast();
  const [activeCampaigns, setActiveCampaigns] = useState<ViralCampaign[]>([
    {
      id: '1',
      title: 'Bełchatów Pizza Challenge',
      description: 'Zjedz całą XXL pizzę w 20 minut i wygraj voucher na 100zł',
      type: 'challenge',
      status: 'active',
      reach: 15600,
      engagement: 2340,
      conversions: 89,
      reward: 'Voucher 100zł + Koszulka Stefano',
      endDate: '2025-07-15',
      locations: ['Bełchatów', 'Piotrków Trybunalski', 'Radomsko', 'Wieluń']
    },
    {
      id: '2',
      title: 'Przyjacielu, sprawdź Stefano!',
      description: 'Za każdego polecenia znajomego - 20% zniżka na następne zamówienie',
      type: 'referral',
      status: 'active',
      reach: 8900,
      engagement: 1567,
      conversions: 234,
      reward: '20% zniżka + Punkty lojalnościowe',
      endDate: '2025-12-31',
      locations: ['Bełchatów', 'Klomnice', 'Szczerców', 'Kamieńsk']
    },
    {
      id: '3',
      title: 'Bełchatów Food Festival',
      description: 'Stefano na największym festiwalu kulinarnym w regionie',
      type: 'local-event',
      status: 'pending',
      reach: 25000,
      engagement: 4500,
      conversions: 0,
      reward: 'Degustacja + Konkursy',
      endDate: '2025-08-20',
      locations: ['Bełchatów', 'Piotrków Trybunalski', 'Tomaszów Mazowiecki']
    }
  ]);

  const [localInfluencers, setLocalInfluencers] = useState<LocalInfluencer[]>([
    {
      id: '1',
      name: 'Kasia Bełchatów Food',
      platform: 'Instagram',
      followers: 12500,
      engagement: 8.5,
      location: 'Bełchatów',
      category: 'Food & Lifestyle',
      rate: 800,
      contact: '@kasia.belchatow.food'
    },
    {
      id: '2',
      name: 'Tomek Łódzkie Smaki',
      platform: 'TikTok',
      followers: 45000,
      engagement: 15.2,
      location: 'Łódź',
      category: 'Food Reviews',
      rate: 2500,
      contact: '@tomek.lodzkie.smaki'
    },
    {
      id: '3',
      name: 'Młodzież Bełchatów',
      platform: 'YouTube',
      followers: 8900,
      engagement: 12.3,
      location: 'Bełchatów',
      category: 'Lifestyle',
      rate: 600,
      contact: 'mlodziez.belchatow@gmail.com'
    }
  ]);

  const [viralContent, setViralContent] = useState<ViralContent[]>([
    {
      id: '1',
      title: 'Jak robią pizzę w Stefano - Behind the scenes',
      content: 'Sprawdź jak powstaje najlepsza pizza w Bełchatowie! 🍕✨ #StefanoPizza #BełchatówEats',
      hashtags: ['#StefanoPizza', '#BełchatówEats', '#PizzaTime', '#ŁódzkieSmaki', '#LocalFood'],
      platforms: ['TikTok', 'Instagram', 'YouTube'],
      viralScore: 85,
      shares: 1240,
      likes: 8900,
      comments: 234,
      localReach: 15600
    },
    {
      id: '2',
      title: 'Bełchatów vs Piotrków - Która pizza lepsza?',
      content: 'Wielki pojedynek pizzy! Stefano Bełchatów vs reszta regionu 🥊🍕',
      hashtags: ['#PizzaWars', '#BełchatówFood', '#PiotrkowFood', '#ŁódzkieSmaki'],
      platforms: ['TikTok', 'Instagram', 'Facebook'],
      viralScore: 92,
      shares: 2100,
      likes: 12400,
      comments: 567,
      localReach: 28900
    },
    {
      id: '3',
      title: 'Student z Bełchatowa zjadł pizzę XXL!',
      content: 'Nie uwierzysz co zrobił ten student! Pizza challenge w Stefano 😱',
      hashtags: ['#PizzaChallenge', '#BełchatówStudents', '#StefanoChallenge', '#Viral'],
      platforms: ['TikTok', 'Instagram', 'YouTube', 'Facebook'],
      viralScore: 96,
      shares: 3400,
      likes: 18700,
      comments: 890,
      localReach: 45000
    }
  ]);

  const [newCampaign, setNewCampaign] = useState<Partial<ViralCampaign>>({});
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [copiedContent, setCopiedContent] = useState<string>('');

  const localCities = [
    'Bełchatów', 'Piotrków Trybunalski', 'Radomsko', 'Wieluń', 'Tomaszów Mazowiecki', 
    'Opoczno', 'Częstochowa', 'Łódź', 'Klomnice', 'Szczerców', 'Kamieńsk', 'Zelów'
  ];

  const viralStrategies = [
    {
      strategy: 'Lokalne Challenge',
      description: 'Wyzwania kulinarne specyficzne dla Bełchatowa',
      examples: ['Pizza XXL Challenge', 'Burger Speed Challenge', 'Sosowy Challenge'],
      reach: 'Lokalny + Regionalny',
      cost: 'Niski',
      engagement: 'Bardzo Wysoki'
    },
    {
      strategy: 'Influencer Marketing',
      description: 'Współpraca z lokalnymi influencerami',
      examples: ['Food bloggers', 'Lokalni youtuberzy', 'Instagramerzy'],
      reach: 'Regionalny',
      cost: 'Średni',
      engagement: 'Wysoki'
    },
    {
      strategy: 'User Generated Content',
      description: 'Zachęcanie klientów do tworzenia treści',
      examples: ['#StefanoMoment', '#BełchatówEats', '#MojaStefanoPizza'],
      reach: 'Lokalny',
      cost: 'Bardzo Niski',
      engagement: 'Średni'
    },
    {
      strategy: 'Lokalne Wydarzenia',
      description: 'Organizacja i uczestnictwo w lokalnych wydarzeniach',
      examples: ['Food festival', 'Dni Bełchatowa', 'Koncerty lokalne'],
      reach: 'Lokalny + Turystyczny',
      cost: 'Wysoki',
      engagement: 'Bardzo Wysoki'
    }
  ];

  const copyToClipboard = async (text: string, contentId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedContent(contentId);
      toast({
        title: "Skopiowano!",
        description: "Treść została skopiowana do schowka",
      });
      setTimeout(() => setCopiedContent(''), 2000);
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się skopiować treści",
        variant: "destructive",
      });
    }
  };

  const shareContent = (content: ViralContent) => {
    const shareText = `${content.title}\n\n${content.content}\n\n${content.hashtags.join(' ')}`;
    
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: shareText,
        url: 'https://stefanogroup.pl'
      });
    } else {
      copyToClipboard(shareText, content.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-stefano-gold">System Wirusowego Marketingu</h2>
        <p className="text-gray-300">Rozprzestrzenianie Stefano w Bełchatowie i okolicach</p>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="campaigns">Kampanie</TabsTrigger>
          <TabsTrigger value="influencers">Influencerzy</TabsTrigger>
          <TabsTrigger value="content">Treści</TabsTrigger>
          <TabsTrigger value="strategies">Strategie</TabsTrigger>
          <TabsTrigger value="analytics">Analityka</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-stefano-gold">Aktywne Kampanie Wirusowe</h3>
            <Button className="bg-stefano-red hover:bg-red-700">
              <Zap className="w-4 h-4 mr-2" />
              Nowa Kampania
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-stefano-gold text-lg">{campaign.title}</CardTitle>
                    <Badge variant={campaign.status === 'active' ? 'default' : campaign.status === 'pending' ? 'secondary' : 'outline'}>
                      {campaign.status === 'active' ? 'Aktywna' : campaign.status === 'pending' ? 'Oczekuje' : 'Zakończona'}
                    </Badge>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">{campaign.reach.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Zasięg</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{campaign.engagement.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Engagement</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-stefano-gold">{campaign.conversions}</div>
                      <div className="text-xs text-gray-400">Konwersje</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-stefano-gold" />
                      <span className="text-sm">{campaign.reward}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Do: {campaign.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{campaign.locations.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-1" />
                      Udostępnij
                    </Button>
                    <Button size="sm" className="flex-1 bg-stefano-red hover:bg-red-700">
                      Edytuj
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-stefano-gold">Lokalni Influencerzy</h3>
            <Button className="bg-stefano-red hover:bg-red-700">
              <Users className="w-4 h-4 mr-2" />
              Dodaj Influencera
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localInfluencers.map((influencer) => (
              <Card key={influencer.id} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-stefano-gold">{influencer.name}</CardTitle>
                  <CardDescription>{influencer.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{influencer.platform}</Badge>
                    <Badge variant="secondary">{influencer.location}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-400">{influencer.followers.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Obserwujących</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-400">{influencer.engagement}%</div>
                      <div className="text-xs text-gray-400">Engagement</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Stawka:</span>
                      <span className="font-bold text-stefano-gold">{influencer.rate}zł</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Kontakt:</span>
                      <span className="text-sm">{influencer.contact}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Kontakt
                    </Button>
                    <Button size="sm" className="flex-1 bg-stefano-red hover:bg-red-700">
                      Współpraca
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-stefano-gold">Treści Wirusowe</h3>
            <Button className="bg-stefano-red hover:bg-red-700">
              <Camera className="w-4 h-4 mr-2" />
              Nowa Treść
            </Button>
          </div>

          <div className="space-y-4">
            {viralContent.map((content) => (
              <Card key={content.id} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-stefano-gold">{content.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="font-bold text-green-400">{content.viralScore}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{content.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {content.hashtags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-400">{content.shares.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Udostępnień</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-400">{content.likes.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Polubień</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-400">{content.comments.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Komentarzy</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-stefano-gold">{content.localReach.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Zasięg</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {content.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => copyToClipboard(content.content + '\n\n' + content.hashtags.join(' '), content.id)}
                    >
                      {copiedContent === content.id ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      Kopiuj
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-stefano-red hover:bg-red-700"
                      onClick={() => shareContent(content)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Udostępnij
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <h3 className="text-xl font-semibold text-stefano-gold">Strategie Wirusowe dla Bełchatowa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {viralStrategies.map((strategy, index) => (
              <Card key={index} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-stefano-gold">{strategy.strategy}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Przykłady:</h4>
                    <ul className="text-sm space-y-1">
                      {strategy.examples.map((example, i) => (
                        <li key={i} className="text-gray-300">• {example}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xs text-gray-400">Zasięg</div>
                      <div className="text-sm font-bold">{strategy.reach}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Koszt</div>
                      <div className="text-sm font-bold">{strategy.cost}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Engagement</div>
                      <div className="text-sm font-bold">{strategy.engagement}</div>
                    </div>
                  </div>

                  <Button className="w-full bg-stefano-red hover:bg-red-700">
                    <Target className="w-4 h-4 mr-2" />
                    Uruchom Strategię
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h3 className="text-xl font-semibold text-stefano-gold">Analityka Wirusowa</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-green-400">Łączny Zasięg</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89,500</div>
                <div className="text-sm text-gray-400">+23% w tym miesiącu</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12.8%</div>
                <div className="text-sm text-gray-400">Powyżej średniej</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-stefano-gold">Konwersje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">323</div>
                <div className="text-sm text-gray-400">Nowe zamówienia</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-purple-400">ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">340%</div>
                <div className="text-sm text-gray-400">Zwrot z inwestycji</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-stefano-gold">Mapa Rozprzestrzeniania</CardTitle>
              <CardDescription>Jak Stefano podbija Bełchatów i okolice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {localCities.map((city) => (
                  <div key={city} className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="font-semibold text-sm">{city}</div>
                    <div className="text-xs text-gray-400">
                      {Math.floor(Math.random() * 1000) + 100} zasięg
                    </div>
                    <div className="text-xs text-stefano-gold">
                      {Math.floor(Math.random() * 50) + 10} konwersji
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}