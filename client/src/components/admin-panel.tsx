import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TrendingUp, Users, Eye, MessageSquare, Hash, Globe, Search, Award, Zap, Image, Send, Facebook, Instagram, Youtube, Clock, Camera, Palette, FileImage, Share2, Settings, Gift, Shield, Lock, FileText, FileCheck, UserCheck, AlertTriangle, ShoppingCart, Crown, BarChart3, Trash2, UserPlus, Mail, Edit2, Download, Database, Home, ArrowLeft } from "lucide-react";
import ApiConfig from "./api-config";
import QualityControl from "./quality-control";
import { CostMonitoring } from "./admin/cost-monitoring";
import { Switch } from "@/components/ui/switch";

interface AdminStats {
  dailyVisitors: number;
  totalOrders: number;
  totalReservations: number;
  seoScore: number;
  keywordRanking: { keyword: string; position: number; trend: string }[];
  socialMedia: { platform: string; followers: number; engagement: number }[];
  pageViews: { page: string; views: number }[];
}

interface SocialPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledDate: Date | null;
  status: 'draft' | 'scheduled' | 'published';
  imageUrl?: string;
  hashtags: string[];
}

interface GraphicTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  dimensions: { width: number; height: number };
}

export default function AdminPanel() {
  const [stats, setStats] = useState<AdminStats>({
    dailyVisitors: 0,
    totalOrders: 0,
    totalReservations: 0,
    seoScore: 0,
    keywordRanking: [],
    socialMedia: [],
    pageViews: []
  });

  const [seoContent, setSeoContent] = useState({
    metaTags: '',
    hashtags: '',
    socialPosts: '',
    keywords: ''
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Social Media Management States
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState<Partial<SocialPost>>({
    content: '',
    platforms: [],
    hashtags: [],
    status: 'draft'
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  
  // Graphics Management
  const [graphicTemplates, setGraphicTemplates] = useState<GraphicTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customText, setCustomText] = useState('');
  const [generatedGraphic, setGeneratedGraphic] = useState<string>('');
  
  // Image Management
  const [uploadedImages, setUploadedImages] = useState<Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    uploadDate: string;
    category: string;
  }>>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImageCategory, setSelectedImageCategory] = useState('menu');
  
  // Platform Configuration Management
  const [platformConfigs, setPlatformConfigs] = useState<{[key: string]: {
    enabled: boolean;
    address: string;
    apiKey: string;
    status: 'connected' | 'disconnected' | 'error';
  }}>({
    'Facebook': { enabled: true, address: 'https://facebook.com/stefano.restaurant', apiKey: '', status: 'connected' },
    'Instagram': { enabled: true, address: 'https://instagram.com/stefano.restaurant', apiKey: '', status: 'connected' },
    'TikTok': { enabled: true, address: 'https://tiktok.com/@stefano.restaurant', apiKey: '', status: 'connected' },
    'YouTube': { enabled: true, address: 'https://youtube.com/@stefano.restaurant', apiKey: '', status: 'connected' },
    'WhatsApp Status': { enabled: true, address: '+48517616618', apiKey: '', status: 'connected' },
    'Telegram': { enabled: false, address: '', apiKey: '', status: 'disconnected' },
    'Discord': { enabled: false, address: '', apiKey: '', status: 'disconnected' },
    'LinkedIn': { enabled: false, address: '', apiKey: '', status: 'disconnected' },
    'Twitter': { enabled: false, address: '', apiKey: '', status: 'disconnected' },
    'Pinterest': { enabled: false, address: '', apiKey: '', status: 'disconnected' },
    'Snapchat': { enabled: false, address: '', apiKey: '', status: 'disconnected' },
    'Reddit': { enabled: false, address: '', apiKey: '', status: 'disconnected' }
  });

  // Content Management
  const [aboutUsContent, setAboutUsContent] = useState({
    title: 'O Restauracji Stefano',
    description: 'Restauracja & Pub Stefano w Bełchatowie to miejsce, gdzie tradycja spotyka się z nowoczesnością.',
    mainText: `Oferujemy najlepszą pizzę, soczyste burgery, chrupiące kurczaki oraz wiele innych specjałów. 
    
Nasza restauracja to także miejsce spotkań przy grach planszowych, organizacji imprez rodzinnych i obsługi wydarzeń firmowych.

Zapraszamy do skorzystania z naszego systemu zamówień online z wygodnym odbiorem oraz do zakupu naszych autorskich sosów w sklepie Stefano.`,
    workingHours: {
      'Poniedziałek-Środa': '15:00-21:00',
      'Czwartek-Sobota': '15:00-24:00', 
      'Niedziela': '13:00-22:00'
    } as {[key: string]: string},
    contact: {
      phone: '517-616-618',
      email: 'stefano@stefanogroup.pl',
      address: 'ul. Kościuszki 12, 97-400 Bełchatów'
    }
  });

  // Detailed Statistics with Social Media Analytics
  const [detailedStats] = useState({
    daily: {
      visitors: 287,
      orders: 45,
      reservations: 12,
      revenue: 2850,
      topDish: 'Pizza Margherita',
      avgOrderValue: 63.33,
      peakHour: '19:00-20:00'
    },
    weekly: {
      visitors: 1890,
      orders: 298,
      reservations: 67,
      revenue: 18920,
      growth: '+15%',
      newCustomers: 89,
      returningCustomers: 209
    },
    monthly: {
      visitors: 7650,
      orders: 1205,
      reservations: 278,
      revenue: 76400,
      bestDay: 'Sobota',
      worstDay: 'Poniedziałek',
      avgDailyRevenue: 2467
    },
    // Avatar statistics removed for simplified ordering
    topDishes: [
      { name: 'Pizza Margherita', orders: 89, revenue: 4005 },
      { name: 'Kurczak Family King', orders: 67, revenue: 3015 },
      { name: 'Burger Classic', orders: 54, revenue: 1350 },
      { name: 'Tortilla Wege', orders: 43, revenue: 1032 },
      { name: 'Pizza Pepperoni', orders: 38, revenue: 1900 }
    ],
    socialMedia: {
      facebook: {
        followers: 12500,
        engagement: 8.5,
        dailyReach: 3200,
        weeklyGrowth: 2.1,
        topPost: 'Pizza Margherita zdjęcie',
        avgLikes: 145,
        avgComments: 12,
        avgShares: 8,
        monthlyRevenue: 4200
      },
      instagram: {
        followers: 8900,
        engagement: 12.3,
        dailyReach: 2800,
        weeklyGrowth: 3.2,
        topPost: 'Story: Making pizza',
        avgLikes: 280,
        avgComments: 18,
        avgShares: 22,
        monthlyRevenue: 3100
      },
      tiktok: {
        followers: 15600,
        engagement: 18.7,
        dailyReach: 8500,
        weeklyGrowth: 12.5,
        topPost: 'Pizza flip challenge',
        avgLikes: 890,
        avgComments: 45,
        avgShares: 120,
        monthlyRevenue: 6800
      },
      youtube: {
        subscribers: 2300,
        engagement: 7.2,
        dailyViews: 1200,
        weeklyGrowth: 1.8,
        topVideo: 'Jak robimy pizzę',
        avgLikes: 67,
        avgComments: 8,
        avgShares: 5,
        monthlyRevenue: 1200
      },
      whatsapp: {
        statusViews: 4500,
        businessProfile: 850,
        dailyMessages: 89,
        weeklyGrowth: 5.4,
        orderConversion: 34.2,
        avgOrderValue: 67,
        monthlyRevenue: 12500
      },
      linkedin: {
        followers: 450,
        engagement: 4.2,
        dailyReach: 120,
        weeklyGrowth: 0.8,
        topPost: 'Oferta cateringowa',
        avgLikes: 12,
        avgComments: 2,
        avgShares: 3,
        monthlyRevenue: 2800
      },
      telegram: {
        subscribers: 0,
        engagement: 0,
        dailyReach: 0,
        weeklyGrowth: 0,
        topPost: 'Brak aktywności',
        avgLikes: 0,
        avgComments: 0,
        avgShares: 0,
        monthlyRevenue: 0
      },
      twitter: {
        followers: 0,
        engagement: 0,
        dailyReach: 0,
        weeklyGrowth: 0,
        topPost: 'Brak aktywności',
        avgLikes: 0,
        avgComments: 0,
        avgShares: 0,
        monthlyRevenue: 0
      },
      x: {
        followers: 0,
        engagement: 0,
        dailyReach: 0,
        weeklyGrowth: 0,
        topPost: 'Brak aktywności',
        avgLikes: 0,
        avgComments: 0,
        avgShares: 0,
        monthlyRevenue: 0
      },
      pinterest: {
        followers: 0,
        engagement: 0,
        dailyReach: 0,
        weeklyGrowth: 0,
        topPost: 'Brak aktywności',
        avgLikes: 0,
        avgComments: 0,
        avgShares: 0,
        monthlyRevenue: 0
      },
      snapchat: {
        followers: 0,
        engagement: 0,
        dailyReach: 0,
        weeklyGrowth: 0,
        topPost: 'Brak aktywności',
        avgLikes: 0,
        avgComments: 0,
        avgShares: 0,
        monthlyRevenue: 0
      },
      reddit: {
        karma: 0,
        engagement: 0,
        dailyReach: 0,
        weeklyGrowth: 0,
        topPost: 'Brak aktywności',
        avgUpvotes: 0,
        avgComments: 0,
        avgShares: 0,
        monthlyRevenue: 0
      },
      discord: {
        members: 0,
        engagement: 0,
        dailyActive: 0,
        weeklyGrowth: 0,
        topMessage: 'Brak aktywności',
        avgReactions: 0,
        avgMessages: 0,
        monthlyRevenue: 0
      }
    },
    seo: {
      googleRanking: [
        { keyword: 'restauracja bełchatów', position: 2, traffic: 450, revenue: 2800 },
        { keyword: 'pizza bełchatów', position: 1, traffic: 820, revenue: 5200 },
        { keyword: 'stefano restaurant', position: 1, traffic: 120, revenue: 900 },
        { keyword: 'burger bełchatów', position: 3, traffic: 280, revenue: 1800 },
        { keyword: 'catering bełchatów', position: 4, traffic: 150, revenue: 2200 }
      ],
      totalTraffic: 1820,
      organicRevenue: 12900,
      clickThroughRate: 12.5,
      avgPosition: 2.2,
      indexedPages: 15,
      backlinks: 23
    },
    googleAds: {
      impressions: 45000,
      clicks: 1200,
      ctr: 2.67,
      cpc: 1.85,
      spend: 2220,
      conversions: 89,
      revenue: 5670,
      roas: 2.55
    },
    email: {
      subscribers: 2300,
      openRate: 24.5,
      clickRate: 4.2,
      unsubscribeRate: 0.8,
      weeklyGrowth: 3.1,
      campaignsSent: 8,
      revenue: 3400
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      generateSEOContent();
      loadGraphicTemplates();
      loadSocialPosts();
      loadUploadedImages();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    // Symulacja rzeczywistych statystyk (w produkcji: API call)
    const mockStats: AdminStats = {
      dailyVisitors: Math.floor(Math.random() * 500) + 200,
      totalOrders: Math.floor(Math.random() * 50) + 20,
      totalReservations: Math.floor(Math.random() * 30) + 10,
      seoScore: Math.floor(Math.random() * 20) + 80,
      keywordRanking: [
        { keyword: "restauracja bełchatów", position: Math.floor(Math.random() * 5) + 1, trend: "up" },
        { keyword: "pizza bełchatów", position: Math.floor(Math.random() * 3) + 1, trend: "up" },
        { keyword: "stefano restaurant", position: Math.floor(Math.random() * 2) + 1, trend: "stable" },
        { keyword: "najlepsza restauracja", position: Math.floor(Math.random() * 10) + 5, trend: "up" },
        { keyword: "zamówienia online", position: Math.floor(Math.random() * 7) + 3, trend: "up" }
      ],
      socialMedia: [
        { platform: "Facebook", followers: 2500, engagement: 8.5 },
        { platform: "Instagram", followers: 1800, engagement: 12.3 },
        { platform: "Google My Business", followers: 950, engagement: 15.2 }
      ],
      pageViews: [
        { page: "/", views: Math.floor(Math.random() * 1000) + 500 },
        { page: "/#menu", views: Math.floor(Math.random() * 800) + 300 },
        { page: "/#zamow", views: Math.floor(Math.random() * 600) + 200 },
        { page: "/#kontakt", views: Math.floor(Math.random() * 400) + 150 }
      ]
    };
    setStats(mockStats);
  };

  const loadGraphicTemplates = () => {
    const templates: GraphicTemplate[] = [
      { id: '1', name: 'Pizza Promo', category: 'Promocje', preview: '🍕', dimensions: { width: 1080, height: 1080 } },
      { id: '2', name: 'Daily Special', category: 'Menu', preview: '🌟', dimensions: { width: 1200, height: 630 } },
      { id: '3', name: 'Story Template', category: 'Stories', preview: '📱', dimensions: { width: 1080, height: 1920 } },
      { id: '4', name: 'Event Announcement', category: 'Wydarzenia', preview: '🎉', dimensions: { width: 1200, height: 630 } },
      { id: '5', name: 'Menu Showcase', category: 'Menu', preview: '📋', dimensions: { width: 1080, height: 1350 } },
      { id: '6', name: 'Customer Review', category: 'Opinie', preview: '⭐', dimensions: { width: 1080, height: 1080 } }
    ];
    setGraphicTemplates(templates);
  };

  const loadSocialPosts = () => {
    const posts: SocialPost[] = [
      {
        id: '1',
        content: 'Dzisiaj specjalna promocja na nasze autorskie pizze! Zamów teraz online!',
        platforms: ['Facebook', 'Instagram'],
        scheduledDate: new Date(),
        status: 'published',
        hashtags: ['#StefanoRestaurant', '#PizzaBełchatów', '#DailySpecial']
      }
    ];
    setSocialPosts(posts);
  };

  const generateSEOContent = () => {
    const hashtags = [
      "#StefanoRestaurant", "#BełchatówEats", "#PizzaBełchatów", "#RestauracjaPolska",
      "#JedzenieOnline", "#DostawaJedzenia", "#StefanoFamily", "#PolskaSzoicja",
      "#RestaurantLife", "#FoodLovers", "#ItalianFood", "#PolishCuisine",
      "#OrderOnline", "#FreshIngredients", "#FamilyRestaurant", "#LocalBusiness",
      "#QualityFood", "#BestPizza", "#AuthenticTaste", "#CustomerFirst",
      "#DailySpecials", "#FoodDelivery", "#DineIn", "#Takeaway",
      "#RestaurantPromo", "#WeekendSpecial", "#FoodPhoto", "#DeliciousFood",
      "#HomemadeStyle", "#FreshDaily", "#TopRated", "#CommunityFavorite"
    ];

    const keywords = [
      "restauracja bełchatów", "pizza bełchatów", "stefano restaurant", "najlepsza restauracja",
      "zamówienia online", "dostawa jedzenia", "włoska kuchnia", "polska restauracja",
      "family restaurant", "fresh ingredients", "daily specials", "weekend promotions",
      "authentic taste", "homemade style", "local business", "quality food",
      "customer service", "dine in", "takeaway", "food delivery"
    ];

    const socialPosts = [
      "🍕 Dzisiaj specjalna promocja na nasze autorskie pizze! Zamów teraz online! #StefanoRestaurant #PizzaBełchatów #DailySpecial",
      "👨‍👩‍👧‍👦 Rodzinne weekendy w Stefano to czysta radość! Przyjdź z całą rodziną na nasze specjalne menu! #FamilyTime #StefanoFamily #WeekendSpecial",
      "🎮 Wieczory z grami planszowymi już dziś! Rezervuj stolik i ciesz się doskonałym jedzeniem! #BoardGames #RestaurantLife #FunTime",
      "🏢 Obsługa firm na najwyższym poziomie! Organizujemy spotkania biznesowe i catering! #BusinessEvents #CorporateService #StefanoServices",
      "🌟 Nasze sosy autorskie teraz dostępne w sklepie online! Zamów i ciesz się smakiem w domu! #HomemadeStyle #StefanoSauces #OrderOnline",
      "🍗 Kurczak Family King - nasza specjalność! Świeże składniki, niepowtarzalny smak! #FamilyChicken #FreshIngredients #StefanoSpecial"
    ];

    setSeoContent({
      metaTags: `Stefano Restaurant Bełchatów - Najlepsza restauracja w mieście z unikalną pizzą, kurczakiem Family King i atmosferą rodzinną. Zamówienia online z odbiorem.`,
      hashtags: hashtags.join(' '),
      socialPosts: socialPosts.join('\n\n'),
      keywords: keywords.join(', ')
    });
  };

  const handleLogin = () => {
    if (password === 'stefano2025admin') {
      setIsAuthenticated(true);
    }
  };

  // Social Media Functions
  const createSocialPost = () => {
    const post: SocialPost = {
      id: Date.now().toString(),
      content: newPost.content || '',
      platforms: selectedPlatforms,
      scheduledDate: scheduledDate || null,
      status: scheduledDate ? 'scheduled' : 'published',
      hashtags: newPost.hashtags || [],
      imageUrl: generatedGraphic
    };
    setSocialPosts([...socialPosts, post]);
    setNewPost({ content: '', platforms: [], hashtags: [], status: 'draft' });
    setSelectedPlatforms([]);
    setScheduledDate(undefined);
    setGeneratedGraphic('');
  };

  const generateGraphic = (templateId: string, text: string) => {
    const template = graphicTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Symulacja generowania grafiki (w produkcji: Canvas API lub zewnętrzny serwis)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = template.dimensions.width;
    canvas.height = template.dimensions.height;
    
    if (ctx) {
      // Tło gradientowe Stefano
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(1, '#DC2626');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Tekst główny
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('STEFANO', canvas.width / 2, canvas.height / 2 - 50);
      
      // Tekst niestandardowy
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '32px Arial';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 20);
      
      // Emoji z szablonu
      ctx.font = '64px Arial';
      ctx.fillText(template.preview, canvas.width / 2, canvas.height / 2 + 100);
      
      setGeneratedGraphic(canvas.toDataURL());
    }
  };

  const publishToSocialMedia = async (post: SocialPost) => {
    // Symulacja publikacji (w produkcji: API integracje)
    console.log('Publishing to:', post.platforms);
    console.log('Content:', post.content);
    console.log('Hashtags:', post.hashtags.join(' '));
    
    // Aktualizacja statusu posta
    setSocialPosts(socialPosts.map(p => 
      p.id === post.id ? { ...p, status: 'published' } : p
    ));
  };

  const scheduleBulkPosts = () => {
    const bulkPosts = [
      "🍕 Codziennie świeże pizze z najlepszych składników! #StefanoRestaurant #FreshPizza #DailyFresh",
      "🍗 Kurczak Family King - nasza autorska specjalność! #FamilyChicken #StefanoSpecial #AuthenticTaste", 
      "🎮 Wieczory z grami planszowymi! Zabierz przyjaciół i spędź miły czas! #BoardGames #FriendsTime #GoodFood",
      "🌟 Weekendowe promocje już od piątku! Sprawdź nasze specjalne oferty! #WeekendSpecial #Promotions #BestDeals",
      "🏢 Catering i obsługa wydarzeń firmowych! Zaufaj profesjonalistom! #CorporateEvents #Catering #BusinessMeals"
    ];

    const platforms = ['Facebook', 'Instagram', 'LinkedIn'];
    const today = new Date();

    bulkPosts.forEach((content, index) => {
      const post: SocialPost = {
        id: `bulk_${Date.now()}_${index}`,
        content,
        platforms,
        scheduledDate: new Date(today.getTime() + (index + 1) * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        hashtags: content.match(/#\w+/g) || []
      };
      setSocialPosts(prev => [...prev, post]);
    });
  };

  // Image Management Functions
  const loadUploadedImages = () => {
    const mockImages = [
      {
        id: '1',
        name: 'pizza-margherita.jpg',
        url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
        size: 245760,
        uploadDate: '2024-01-15',
        category: 'menu'
      },
      {
        id: '2', 
        name: 'restaurant-interior.jpg',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        size: 318920,
        uploadDate: '2024-01-14',
        category: 'interior'
      },
      {
        id: '3',
        name: 'stefano-logo.png',
        url: '/attached_assets/Asset 1@2x-1-80_1750909127916.png',
        size: 89600,
        uploadDate: '2024-01-13',
        category: 'branding'
      }
    ];
    setUploadedImages(mockImages);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now().toString(),
            name: file.name,
            url: e.target?.result as string,
            size: file.size,
            uploadDate: new Date().toISOString().split('T')[0],
            category: selectedImageCategory
          };
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const deleteImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const exportSEOData = () => {
    const seoData = {
      timestamp: new Date().toISOString(),
      stats: stats,
      content: seoContent,
      recommendations: [
        "Publikuj codziennie 2-3 posty z hashtagami",
        "Aktualizuj meta opisy co tydzień",
        "Dodawaj nowe słowa kluczowe co miesiąc",
        "Monitoruj pozycje w Google Search Console",
        "Odpowiadaj na wszystkie recenzje Google",
        "Dodawaj zdjęcia potraw codziennie"
      ]
    };
    
    const blob = new Blob([JSON.stringify(seoData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stefano-seo-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const resetStats = async (resetType: string) => {
    try {
      const confirmed = window.confirm(
        `Czy na pewno chcesz wyzerować statystyki: ${resetType}?\n\nTa operacja jest nieodwracalna.`
      );
      
      if (!confirmed) return;

      const response = await fetch('/api/admin/reset-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetType }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Pomyślnie wyzerowano statystyki: ${resetType}\n\nData: ${new Date(result.resetDate).toLocaleString('pl-PL')}`);
        
        // Refresh stats after reset
        loadStats();
      } else {
        alert(`❌ Błąd podczas zerowania: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Błąd połączenia: ${error}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Panel Administracyjny</CardTitle>
            <CardDescription className="text-center">Wprowadź hasło dostępu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Zaloguj się
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">
            <span className="stefano-gold">STEFANO</span> Admin Panel
          </h1>
          <div className="flex gap-3">
            <a href="/" className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Powrót do strony głównej
            </a>
            <Button onClick={exportSEOData} className="bg-stefano-red hover:bg-red-600">
              Export SEO Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="stats">Statystyki</TabsTrigger>
            <TabsTrigger value="detailed-stats">Szczegóły</TabsTrigger>
            <TabsTrigger value="content">Treści</TabsTrigger>
            <TabsTrigger value="images">Zdjęcia</TabsTrigger>
            <TabsTrigger value="platforms">Platformy</TabsTrigger>
            <TabsTrigger value="kitchen">Zarządzanie Kuchnią</TabsTrigger>
            <TabsTrigger value="loyalty">Program Lojalnościowy</TabsTrigger>
            <TabsTrigger value="customers">👥 Baza Klientów</TabsTrigger>
            <TabsTrigger value="quality">🔍 Kontrola Jakości</TabsTrigger>
            <TabsTrigger value="ai-bot">AI Bot</TabsTrigger>
            <TabsTrigger value="api-config">🔐 API Keys</TabsTrigger>
            <TabsTrigger value="cost-monitoring">💰 Koszty</TabsTrigger>
            <TabsTrigger value="legal">Prawne & RODO</TabsTrigger>
            <TabsTrigger value="social-manager">Social Media</TabsTrigger>
            <TabsTrigger value="graphics">Grafiki</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="automation">Auto Pilot</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Dzisiejsi Odwiedzający
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{stats.dailyVisitors}</div>
                  <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                    +15% vs wczoraj
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Zamówienia Dziś
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{stats.totalOrders}</div>
                  <Badge variant="outline" className="mt-2 text-blue-400 border-blue-400">
                    +8% vs wczoraj
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Rezerwacje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{stats.totalReservations}</div>
                  <Badge variant="outline" className="mt-2 text-purple-400 border-purple-400">
                    +22% vs wczoraj
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    SEO Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{stats.seoScore}/100</div>
                  <Badge variant="outline" className="mt-2 text-yellow-400 border-yellow-400">
                    Excellent
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Pozycje Słów Kluczowych
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.keywordRanking.map((keyword, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{keyword.keyword}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            #{keyword.position}
                          </Badge>
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.socialMedia.map((platform, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{platform.platform}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{platform.followers} obserwujących</div>
                          <div className="text-xs text-gray-400">{platform.engagement}% engagement</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed-stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daily Stats */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-stefano-gold">Statystyki Dzisiejsze</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Odwiedzający:</span>
                    <span className="font-bold text-green-400">{detailedStats.daily.visitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zamówienia:</span>
                    <span className="font-bold text-blue-400">{detailedStats.daily.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rezerwacje:</span>
                    <span className="font-bold text-purple-400">{detailedStats.daily.reservations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Przychód:</span>
                    <span className="font-bold text-stefano-gold">{detailedStats.daily.revenue}zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top danie:</span>
                    <span className="font-bold">{detailedStats.daily.topDish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Średnie zamówienie:</span>
                    <span className="font-bold">{detailedStats.daily.avgOrderValue}zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Szczyt:</span>
                    <span className="font-bold">{detailedStats.daily.peakHour}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Stats */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-blue-400">Statystyki Tygodniowe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Odwiedzający:</span>
                    <span className="font-bold text-green-400">{detailedStats.weekly.visitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zamówienia:</span>
                    <span className="font-bold text-blue-400">{detailedStats.weekly.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rezerwacje:</span>
                    <span className="font-bold text-purple-400">{detailedStats.weekly.reservations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Przychód:</span>
                    <span className="font-bold text-stefano-gold">{detailedStats.weekly.revenue}zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wzrost:</span>
                    <span className="font-bold text-green-400">{detailedStats.weekly.growth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nowi klienci:</span>
                    <span className="font-bold">{detailedStats.weekly.newCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Powracający:</span>
                    <span className="font-bold">{detailedStats.weekly.returningCustomers}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Stats */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-purple-400">Statystyki Miesięczne</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Odwiedzający:</span>
                    <span className="font-bold text-green-400">{detailedStats.monthly.visitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zamówienia:</span>
                    <span className="font-bold text-blue-400">{detailedStats.monthly.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rezerwacje:</span>
                    <span className="font-bold text-purple-400">{detailedStats.monthly.reservations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Przychód:</span>
                    <span className="font-bold text-stefano-gold">{detailedStats.monthly.revenue}zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Najlepszy dzień:</span>
                    <span className="font-bold">{detailedStats.monthly.bestDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Najgorszy dzień:</span>
                    <span className="font-bold">{detailedStats.monthly.worstDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Średnio dziennie:</span>
                    <span className="font-bold">{detailedStats.monthly.avgDailyRevenue}zł</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avatar statistics removed - simplified ordering system */}

            {/* Top Dishes */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-stefano-gold">Top 5 Dań</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {detailedStats.topDishes.map((dish, index) => (
                    <div key={dish.name} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-stefano-gold text-black rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{dish.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stefano-gold">{dish.revenue}zł</div>
                        <div className="text-sm text-gray-400">{dish.orders} zamówień</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-stefano-gold">Edycja Treści - O Nas</CardTitle>
                <CardDescription>Zarządzaj tekstami wyświetlanymi na stronie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tytuł sekcji</label>
                  <Input
                    value={aboutUsContent.title}
                    onChange={(e) => setAboutUsContent(prev => ({...prev, title: e.target.value}))}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Krótki opis</label>
                  <Input
                    value={aboutUsContent.description}
                    onChange={(e) => setAboutUsContent(prev => ({...prev, description: e.target.value}))}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Główny tekst</label>
                  <Textarea
                    value={aboutUsContent.mainText}
                    onChange={(e) => setAboutUsContent(prev => ({...prev, mainText: e.target.value}))}
                    className="min-h-[200px] bg-gray-800 border-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Godziny otwarcia</label>
                    <div className="space-y-2">
                      {Object.entries(aboutUsContent.workingHours).map(([day, hours]) => (
                        <div key={day} className="flex gap-2">
                          <Input
                            value={day}
                            onChange={(e) => {
                              const newHours = {...aboutUsContent.workingHours} as {[key: string]: string};
                              delete newHours[day];
                              newHours[e.target.value] = hours;
                              setAboutUsContent(prev => ({...prev, workingHours: newHours as any}));
                            }}
                            className="bg-gray-800 border-gray-600 flex-1"
                          />
                          <Input
                            value={hours}
                            onChange={(e) => {
                              setAboutUsContent(prev => ({
                                ...prev, 
                                workingHours: {...prev.workingHours, [day]: e.target.value}
                              }));
                            }}
                            className="bg-gray-800 border-gray-600 flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Dane kontaktowe</label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Telefon"
                        value={aboutUsContent.contact.phone}
                        onChange={(e) => setAboutUsContent(prev => ({
                          ...prev, 
                          contact: {...prev.contact, phone: e.target.value}
                        }))}
                        className="bg-gray-800 border-gray-600"
                      />
                      <Input
                        placeholder="Email"
                        value={aboutUsContent.contact.email}
                        onChange={(e) => setAboutUsContent(prev => ({
                          ...prev, 
                          contact: {...prev.contact, email: e.target.value}
                        }))}
                        className="bg-gray-800 border-gray-600"
                      />
                      <Input
                        placeholder="Adres"
                        value={aboutUsContent.contact.address}
                        onChange={(e) => setAboutUsContent(prev => ({
                          ...prev, 
                          contact: {...prev.contact, address: e.target.value}
                        }))}
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => {
                      console.log('Saving content:', aboutUsContent);
                      // Tu byłaby implementacja zapisu do bazy danych
                    }}
                    className="bg-stefano-red hover:bg-red-600"
                  >
                    Zapisz zmiany
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Reset do wartości domyślnych
                      setAboutUsContent({
                        title: 'O Restauracji Stefano',
                        description: 'Restauracja & Pub Stefano w Bełchatowie to miejsce, gdzie tradycja spotyka się z nowoczesnością.',
                        mainText: `Oferujemy najlepszą pizzę, soczyste burgery, chrupiące kurczaki oraz wiele innych specjałów. 
    
Nasza restauracja to także miejsce spotkań przy grach planszowych, organizacji imprez rodzinnych i obsługi wydarzeń firmowych.

Zapraszamy do skorzystania z naszego systemu zamówień online z wygodnym odbiorem oraz do zakupu naszych autorskich sosów w sklepie Stefano.`,
                        workingHours: {
                          'Poniedziałek-Środa': '15:00-21:00',
                          'Czwartek-Sobota': '15:00-24:00', 
                          'Niedziela': '13:00-22:00'
                        },
                        contact: {
                          phone: '517-616-618',
                          email: 'stefano@stefanogroup.pl',
                          address: 'ul. Kościuszki 12, 97-400 Bełchatów'
                        }
                      });
                    }}
                    className="border-gray-600"
                  >
                    Resetuj
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const preview = `
                      **${aboutUsContent.title}**
                      
                      ${aboutUsContent.description}
                      
                      ${aboutUsContent.mainText}
                      
                      **Godziny otwarcia:**
                      ${Object.entries(aboutUsContent.workingHours).map(([day, hours]) => `${day}: ${hours}`).join('\n')}
                      
                      **Kontakt:**
                      Tel: ${aboutUsContent.contact.phone}
                      Email: ${aboutUsContent.contact.email}
                      Adres: ${aboutUsContent.contact.address}
                      `;
                      alert(preview);
                    }}
                    className="border-stefano-gold text-stefano-gold"
                  >
                    Podgląd
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="w-5 h-5 text-stefano-gold" />
                    Dodaj Nowe Zdjęcia
                  </CardTitle>
                  <CardDescription>Przeciągnij i upuść pliki lub kliknij aby wybrać</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedImageCategory} onValueChange={setSelectedImageCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menu">Menu - Dania</SelectItem>
                      <SelectItem value="interior">Wnętrze restauracji</SelectItem>
                      <SelectItem value="branding">Logo i branding</SelectItem>
                      <SelectItem value="events">Wydarzenia</SelectItem>
                      <SelectItem value="staff">Zespół</SelectItem>
                      <SelectItem value="promotions">Promocje</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-stefano-gold bg-stefano-gold/10' 
                        : 'border-gray-600 hover:border-stefano-gold/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-semibold mb-2">Przeciągnij zdjęcia tutaj</p>
                    <p className="text-sm text-gray-400 mb-4">lub</p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <Button className="bg-stefano-red hover:bg-red-600">
                        Wybierz pliki
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Obsługiwane formaty: JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Szybkie Akcje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setSelectedImageCategory('menu')}
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700"
                  >
                    🍕 Dodaj zdjęcia menu
                  </Button>
                  <Button 
                    onClick={() => setSelectedImageCategory('interior')}
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700"
                  >
                    🏠 Zdjęcia wnętrza
                  </Button>
                  <Button 
                    onClick={() => setSelectedImageCategory('events')}
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700"
                  >
                    🎉 Wydarzenia i imprezy
                  </Button>
                  <Button 
                    onClick={() => setSelectedImageCategory('promotions')}
                    className="w-full justify-start bg-gray-800 hover:bg-gray-700"
                  >
                    📢 Zdjęcia promocji
                  </Button>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Statystyki:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Menu: {uploadedImages.filter(img => img.category === 'menu').length}</div>
                      <div>Wnętrze: {uploadedImages.filter(img => img.category === 'interior').length}</div>
                      <div>Branding: {uploadedImages.filter(img => img.category === 'branding').length}</div>
                      <div>Razem: {uploadedImages.length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Images Gallery */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-green-400" />
                  Galeria Zdjęć ({uploadedImages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="group relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-stefano-gold text-black hover:bg-yellow-400"
                            onClick={() => navigator.clipboard.writeText(image.url)}
                          >
                            📋
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImage(image.id)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium truncate">{image.name}</p>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span className="capitalize">{image.category}</span>
                          <span>{formatFileSize(image.size)}</span>
                        </div>
                        <p className="text-xs text-gray-500">{image.uploadDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {uploadedImages.length === 0 && (
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">Brak zdjęć. Dodaj pierwsze zdjęcie powyżej.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Hashtagi do Postów (Kopiuj i Wklej)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={seoContent.hashtags}
                  readOnly
                  className="min-h-[120px] bg-gray-800 border-gray-600 text-xs"
                />
                <Button 
                  onClick={() => navigator.clipboard.writeText(seoContent.hashtags)}
                  className="mt-2 bg-stefano-red hover:bg-red-600"
                >
                  Kopiuj Hashtagi
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Gotowe Posty Social Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={seoContent.socialPosts}
                  readOnly
                  className="min-h-[200px] bg-gray-800 border-gray-600 text-xs"
                />
                <Button 
                  onClick={() => navigator.clipboard.writeText(seoContent.socialPosts)}
                  className="mt-2 bg-stefano-red hover:bg-red-600"
                >
                  Kopiuj Posty
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Słowa Kluczowe</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={seoContent.keywords}
                  readOnly
                  className="min-h-[100px] bg-gray-800 border-gray-600 text-xs"
                />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Meta Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={seoContent.metaTags}
                  readOnly
                  className="min-h-[100px] bg-gray-800 border-gray-600 text-xs"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-stefano-gold" />
                    Członkowie Aktywni
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">127</div>
                  <p className="text-sm text-gray-400">+12 w tym tygodniu</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Bronze: 89</span>
                      <span>Silver: 28</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Gold: 8</span>
                      <span>Platinum: 2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-stefano-gold" />
                    Punkty Rozdane
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">15,432</div>
                  <p className="text-sm text-gray-400">w tym miesiącu</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Za zamówienia:</span>
                      <span>12,890 pkt</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Bonusy:</span>
                      <span>2,542 pkt</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-stefano-gold" />
                    Nagrody Odebrane
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">89</div>
                  <p className="text-sm text-gray-400">w tym miesiącu</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Zniżki:</span>
                      <span>45</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Darmowe produkty:</span>
                      <span>44</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle>Top Członkowie</CardTitle>
                  <CardDescription>Najbardziej aktywni klienci w programie</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Anna Kowalska", phone: "123456789", tier: "Platinum", points: 2890, orders: 45 },
                      { name: "Jan Nowak", phone: "987654321", tier: "Gold", points: 1567, orders: 32 },
                      { name: "Maria Wiśniewska", phone: "555123456", tier: "Gold", points: 1234, orders: 28 },
                      { name: "Piotr Zieliński", phone: "666789123", tier: "Silver", points: 890, orders: 19 },
                      { name: "Katarzyna Lewandowska", phone: "777456789", tier: "Silver", points: 756, orders: 16 }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-gray-400">{member.phone}</div>
                        </div>
                        <div className="text-right">
                          <Badge className={`mb-1 ${
                            member.tier === 'Platinum' ? 'bg-purple-600' :
                            member.tier === 'Gold' ? 'bg-yellow-600' :
                            member.tier === 'Silver' ? 'bg-gray-600' : 'bg-amber-600'
                          }`}>
                            {member.tier}
                          </Badge>
                          <div className="text-sm">{member.points} pkt</div>
                          <div className="text-xs text-gray-400">{member.orders} zamówień</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle>Zarządzanie Nagrodami</CardTitle>
                  <CardDescription>Aktualne nagrody w systemie</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Darmowa kawa", cost: 50, category: "food", active: true, redeemed: 23 },
                      { name: "10% zniżka", cost: 100, category: "discount", active: true, redeemed: 45 },
                      { name: "Darmowy deser", cost: 150, category: "food", active: true, redeemed: 12 },
                      { name: "20% zniżka VIP", cost: 250, category: "discount", active: true, redeemed: 8 },
                      { name: "Darmowa pizza", cost: 500, category: "food", active: true, redeemed: 1 }
                    ].map((reward, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-xs text-gray-400">{reward.cost} punktów</div>
                        </div>
                        <div className="text-right">
                          <Badge variant={reward.active ? "default" : "outline"} className="mb-1">
                            {reward.active ? "Aktywna" : "Nieaktywna"}
                          </Badge>
                          <div className="text-sm">{reward.redeemed} wykorzystań</div>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full mt-4 bg-stefano-red hover:bg-red-600">
                      + Dodaj Nową Nagrodę
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Ostatnie Aktywności</CardTitle>
                <CardDescription>Najnowsze transakcje w programie lojalnościowym</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Zarejestrował się", member: "Jan Kowalski", points: "+100", time: "2 min temu", type: "join" },
                    { action: "Odebrał nagrodę", member: "Anna Nowak", points: "-150", time: "15 min temu", type: "redeem" },
                    { action: "Otrzymał punkty", member: "Piotr Wiśniewski", points: "+45", time: "32 min temu", type: "earn" },
                    { action: "Awansował na Silver", member: "Maria Kowalczyk", points: "0", time: "1 godz temu", type: "promotion" },
                    { action: "Odebrał nagrodę", member: "Tomasz Zieliński", points: "-100", time: "2 godz temu", type: "redeem" },
                    { action: "Otrzymał punkty", member: "Katarzyna Lewandowska", points: "+67", time: "3 godz temu", type: "earn" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'join' ? 'bg-green-500' :
                          activity.type === 'redeem' ? 'bg-red-500' :
                          activity.type === 'earn' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="font-medium">{activity.member}</div>
                          <div className="text-sm text-gray-400">{activity.action}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          activity.points.startsWith('+') ? 'text-green-400' :
                          activity.points.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {activity.points}
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kitchen" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-stefano-gold" />
                    Status Kuchni
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">0%</div>
                      <p className="text-sm text-gray-400">Obciążenie</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Aktywne zamówienia:</span>
                        <span className="font-bold text-blue-400">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>W kolejce:</span>
                        <span className="font-bold text-yellow-400">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. czas oczekiwania:</span>
                        <span className="font-bold text-green-400">30 min</span>
                      </div>
                    </div>
                    <Badge className="w-full justify-center bg-green-600">
                      Kuchnia działa normalnie
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-stefano-gold" />
                    Pojemność Kuchni
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Max pojemność:</p>
                        <p className="font-bold text-xl">15</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Personel:</p>
                        <p className="font-bold text-xl">3</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Sprzęt:</p>
                        <Badge className="bg-green-600">OK</Badge>
                      </div>
                      <div>
                        <p className="text-gray-400">Zmiana:</p>
                        <p className="font-bold">Dzienna</p>
                      </div>
                    </div>
                    <Button className="w-full bg-stefano-red hover:bg-red-600">
                      Edytuj Ustawienia
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-stefano-gold" />
                    Godziny Szczytu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-900/20 rounded-lg border border-red-700">
                      <div className="font-medium text-red-400">12:00-14:00</div>
                      <div className="text-sm text-gray-400">Lunch rush - max 3 zamówienia/slot</div>
                    </div>
                    <div className="p-3 bg-red-900/20 rounded-lg border border-red-700">
                      <div className="font-medium text-red-400">18:00-21:00</div>
                      <div className="text-sm text-gray-400">Dinner rush - max 3 zamówienia/slot</div>
                    </div>
                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-700">
                      <div className="font-medium text-green-400">Pozostałe godziny</div>
                      <div className="text-sm text-gray-400">Normal - max 5 zamówień/slot</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle>Aktywne Zamówienia</CardTitle>
                  <CardDescription>Zamówienia obecnie w przygotowaniu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center py-8 text-gray-400">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Brak aktywnych zamówień</p>
                      <p className="text-sm">Kuchnia gotowa do przyjęcia nowych zamówień</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle>Harmonogram Slotów</CardTitle>
                  <CardDescription>Dostępne terminy na dziś</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Array.from({ length: 22 }, (_, i) => {
                      const hour = 11 + Math.floor(i / 2);
                      const minutes = (i % 2) * 30;
                      const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                      const isPeak = (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 20);
                      const maxOrders = isPeak ? 3 : 5;
                      
                      return (
                        <div key={i} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                          <span className="font-medium">{timeSlot}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">0/{maxOrders}</span>
                            <Badge className={isPeak ? "bg-yellow-600" : "bg-green-600"}>
                              {isPeak ? "Szczyt" : "Dostępny"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle>Zarządzanie Czasami Realizacji</CardTitle>
                <CardDescription>Automatyczne dostosowanie czasów w zależności od obciążenia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pizza</label>
                    <div className="text-lg font-bold text-blue-400">25-35 min</div>
                    <div className="text-xs text-gray-400">Czas bazowy: 25 min + obciążenie</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Burgery</label>
                    <div className="text-lg font-bold text-green-400">20-30 min</div>
                    <div className="text-xs text-gray-400">Czas bazowy: 20 min + obciążenie</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tortilla</label>
                    <div className="text-lg font-bold text-yellow-400">15-25 min</div>
                    <div className="text-xs text-gray-400">Czas bazowy: 15 min + obciążenie</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dodatki</label>
                    <div className="text-lg font-bold text-purple-400">5-10 min</div>
                    <div className="text-xs text-gray-400">Czas bazowy: 5 min + obciążenie</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <h4 className="font-medium text-blue-400 mb-2">Inteligentne Zarządzanie</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Automatyczne wydłużanie czasów przy obciążeniu powyżej 70%</li>
                    <li>• Priorytet dla zamówień VIP (członkowie Platinum)</li>
                    <li>• Optymalizacja kolejki na podstawie złożoności dań</li>
                    <li>• Realny czas dla klienta uwzględnia aktualną sytuację</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-stefano-gold" />
                  Konfiguracja Platform - Jedną Akcją na Wszystkie
                </CardTitle>
                <CardDescription>Zarządzaj adresami, API kluczami i statusem połączeń dla każdej platformy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(platformConfigs).map(([platform, config]) => (
                    <div key={platform} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{platform}</h3>
                          <div className={`w-2 h-2 rounded-full ${
                            config.status === 'connected' ? 'bg-green-500' :
                            config.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                        </div>
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(checked) => {
                            setPlatformConfigs(prev => ({
                              ...prev,
                              [platform]: { ...prev[platform], enabled: checked }
                            }));
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-400">Adres/URL</label>
                          <Input
                            value={config.address}
                            onChange={(e) => {
                              setPlatformConfigs(prev => ({
                                ...prev,
                                [platform]: { ...prev[platform], address: e.target.value }
                              }));
                            }}
                            placeholder={`Adres ${platform}...`}
                            className="bg-gray-700 border-gray-600 text-xs"
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-400">API Key (opcjonalnie)</label>
                          <Input
                            type="password"
                            value={config.apiKey}
                            onChange={(e) => {
                              setPlatformConfigs(prev => ({
                                ...prev,
                                [platform]: { ...prev[platform], apiKey: e.target.value }
                              }));
                            }}
                            placeholder="API klucz..."
                            className="bg-gray-700 border-gray-600 text-xs"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            config.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                            config.status === 'error' ? 'bg-red-500/20 text-red-400' : 
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {config.status === 'connected' ? 'Połączono' :
                             config.status === 'error' ? 'Błąd' : 'Wyłączono'}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPlatformConfigs(prev => ({
                                ...prev,
                                [platform]: { 
                                  ...prev[platform], 
                                  status: prev[platform].status === 'connected' ? 'disconnected' : 'connected' 
                                }
                              }));
                            }}
                            className="text-xs"
                          >
                            Test
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-stefano-red/10 border border-stefano-red/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-stefano-gold">Szybkie Akcje</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      onClick={() => {
                        const platforms = ['Facebook', 'Instagram', 'TikTok', 'YouTube'];
                        setPlatformConfigs(prev => {
                          const updated = { ...prev };
                          platforms.forEach(p => {
                            if (updated[p]) updated[p].enabled = true;
                          });
                          return updated;
                        });
                      }}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      Włącz Główne
                    </Button>
                    <Button
                      onClick={() => {
                        setPlatformConfigs(prev => {
                          const updated = { ...prev };
                          Object.keys(updated).forEach(p => {
                            updated[p].enabled = true;
                          });
                          return updated;
                        });
                      }}
                      className="text-xs bg-stefano-gold text-black hover:bg-yellow-400"
                    >
                      Włącz Wszystkie
                    </Button>
                    <Button
                      onClick={() => {
                        setPlatformConfigs(prev => {
                          const updated = { ...prev };
                          Object.keys(updated).forEach(p => {
                            updated[p].enabled = false;
                          });
                          return updated;
                        });
                      }}
                      variant="outline"
                      className="text-xs border-gray-500"
                    >
                      Wyłącz Wszystkie
                    </Button>
                    <Button
                      onClick={() => {
                        console.log('Eksportowanie konfiguracji:', platformConfigs);
                        const dataStr = JSON.stringify(platformConfigs, null, 2);
                        const dataBlob = new Blob([dataStr], {type:'application/json'});
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'platform-config.json';
                        link.click();
                      }}
                      variant="outline"
                      className="text-xs border-stefano-gold text-stefano-gold"
                    >
                      Eksportuj Config
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 bg-gray-800 rounded-lg p-4">
                  <h5 className="font-semibold mb-2">Status Platformy Stefano:</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="text-green-400">✓ Facebook: Aktywny</div>
                    <div className="text-green-400">✓ Instagram: Aktywny</div>
                    <div className="text-green-400">✓ TikTok: Aktywny</div>
                    <div className="text-green-400">✓ WhatsApp: 516166180</div>
                    <div className="text-yellow-400">⚠ YouTube: Konfiguracja</div>
                    <div className="text-gray-400">○ LinkedIn: Wyłączony</div>
                    <div className="text-gray-400">○ Twitter: Wyłączony</div>
                    <div className="text-gray-400">○ Discord: Wyłączony</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-stefano-gold" />
                    Dane Firmy - NIP/REGON
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">NIP</label>
                      <Input 
                        placeholder="0000000000" 
                        className="bg-gray-800 border-gray-600"
                        defaultValue="7732557890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">REGON</label>
                      <Input 
                        placeholder="000000000" 
                        className="bg-gray-800 border-gray-600"
                        defaultValue="123456789"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Pełna Nazwa Firmy</label>
                    <Input 
                      placeholder="Nazwa spółki/działalności" 
                      className="bg-gray-800 border-gray-600"
                      defaultValue="Restaurant & Pub Stefano Sp. z o.o."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Adres Siedziby</label>
                      <Input 
                        placeholder="ul. Nazwa 1, 00-000 Miasto" 
                        className="bg-gray-800 border-gray-600"
                        defaultValue="ul. Kościuszki 1, 97-400 Bełchatów"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">KRS (jeśli sp. z o.o.)</label>
                      <Input 
                        placeholder="0000000000" 
                        className="bg-gray-800 border-gray-600"
                        defaultValue="0000987654"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Kapitał Zakładowy</label>
                      <Input 
                        placeholder="5000 PLN" 
                        className="bg-gray-800 border-gray-600"
                        defaultValue="5000 PLN"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Sąd Rejestrowy</label>
                      <Input 
                        placeholder="Sąd Rejonowy..." 
                        className="bg-gray-800 border-gray-600"
                        defaultValue="Sąd Rejonowy w Piotrkowie Trybunalskim"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-stefano-red hover:bg-red-600">
                    Zapisz Dane Firmy
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-stefano-gold" />
                    Administrator Danych (RODO)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Imię i Nazwisko Administratora</label>
                    <Input 
                      placeholder="Jan Kowalski" 
                      className="bg-gray-800 border-gray-600"
                      defaultValue="Stefan Nowak"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Kontaktowy RODO</label>
                      <Input 
                        placeholder="rodo@stefanogroup.pl" 
                        className="bg-gray-800 border-gray-600"
                        defaultValue="rodo@stefanogroup.pl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefon RODO</label>
                      <Input 
                        placeholder="517 616 618" 
                        className="bg-gray-800 border-gray-600"
                        defaultValue="517 616 618"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Adres Korespondencyjny RODO</label>
                    <Textarea 
                      placeholder="Adres do korespondencji RODO" 
                      className="bg-gray-800 border-gray-600"
                      defaultValue="Restaurant & Pub Stefano Sp. z o.o.
Administrator Danych Osobowych
ul. Kościuszki 1
97-400 Bełchatów"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Inspektor Ochrony Danych (IOD)</label>
                    <Input 
                      placeholder="iod@stefanogroup.pl (opcjonalnie)" 
                      className="bg-gray-800 border-gray-600"
                      defaultValue="Nie wyznaczono"
                    />
                  </div>

                  <Button className="w-full bg-stefano-red hover:bg-red-600">
                    Zapisz Dane RODO
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-stefano-gold" />
                  Licencje i Pozwolenia Restauracyjne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Koncesja na Alkohol</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-green-600">Aktywna</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Ważna do:</span>
                        <span>31.12.2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Numer:</span>
                        <span>KA/2024/001</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Pozwolenie Sanitarne</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-green-600">Aktywne</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Ważne do:</span>
                        <span>15.08.2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Numer:</span>
                        <span>PSSE/2024/045</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Pozwolenie Budowlane</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-green-600">Ważne</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Data wydania:</span>
                        <span>10.03.2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Numer:</span>
                        <span>PB/2023/078</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Zgłoszenie PKD</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>PKD Główny:</span>
                        <span>56.10.A</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PKD Dodatkowy:</span>
                        <span>56.30.Z</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-green-600">Aktywny</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">HACCP</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-green-600">Wdrożony</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Ostatnia Aktualizacja:</span>
                        <span>01.01.2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Odpowiedzialny:</span>
                        <span>Stefan Nowak</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Kasa Fiskalna</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span>Posnet Thermal HD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Numer Fiskalny:</span>
                        <span>PST12345678</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-green-600">Aktywna</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="bg-stefano-red hover:bg-red-600 mr-4">
                    Edytuj Licencje
                  </Button>
                  <Button variant="outline" className="border-gray-600">
                    Dodaj Nowe Pozwolenie
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-stefano-gold" />
                    Polityka Prywatności RODO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <h4 className="font-medium text-blue-400 mb-2">Cele Przetwarzania Danych</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Realizacja zamówień i rezerwacji</li>
                      <li>• Prowadzenie programu lojalnościowego</li>
                      <li>• Marketing bezpośredni (newsletter)</li>
                      <li>• Obsługa reklamacji i skarg</li>
                      <li>• Wypełnianie obowiązków prawnych</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <h4 className="font-medium text-green-400 mb-2">Podstawy Prawne</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Art. 6 ust. 1 lit. b RODO - wykonanie umowy</li>
                      <li>• Art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes</li>
                      <li>• Art. 6 ust. 1 lit. a RODO - zgoda (marketing)</li>
                      <li>• Art. 6 ust. 1 lit. c RODO - obowiązek prawny (księgowość)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <h4 className="font-medium text-yellow-400 mb-2">Okresy Przechowywania</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Dane klientów: 3 lata od ostatniej transakcji</li>
                      <li>• Faktury: 5 lat (obowiązek podatkowy)</li>
                      <li>• Marketing: do wycofania zgody</li>
                      <li>• Program lojalnościowy: do rezygnacji</li>
                    </ul>
                  </div>

                  <Button className="w-full bg-stefano-red hover:bg-red-600">
                    Edytuj Politykę Prywatności
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-stefano-gold" />
                    Prawa Osób Fizycznych
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-800 rounded text-center">
                      <div className="text-2xl font-bold text-blue-400">12</div>
                      <div className="text-sm text-gray-400">Wnioski o dostęp</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded text-center">
                      <div className="text-2xl font-bold text-green-400">8</div>
                      <div className="text-sm text-gray-400">Wnioski o usunięcie</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded text-center">
                      <div className="text-2xl font-bold text-yellow-400">3</div>
                      <div className="text-sm text-gray-400">Wnioski o sprostowanie</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded text-center">
                      <div className="text-2xl font-bold text-purple-400">5</div>
                      <div className="text-sm text-gray-400">Sprzeciwy marketing</div>
                    </div>
                  </div>

                  <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                    <h4 className="font-medium text-red-400 mb-2">Procedura Obsługi Wniosków</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Termin odpowiedzi: maksymalnie 30 dni</li>
                      <li>• Weryfikacja tożsamości wymagana</li>
                      <li>• Dokumentacja wszystkich działań</li>
                      <li>• Informacja o prawie do skargi do PUODO</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Przeglądaj Wnioski RODO
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Nowy Wniosek RODO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-stefano-gold" />
                  Regulamin i Dokumenty Prawne
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Regulamin Restauracji</h4>
                    <p className="text-sm text-gray-400 mb-3">Zasady korzystania z usług restauracji</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-stefano-red hover:bg-red-600">Edytuj</Button>
                      <Button size="sm" variant="outline" className="border-gray-600">Pobierz</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Regulamin Programu Lojalnościowego</h4>
                    <p className="text-sm text-gray-400 mb-3">Zasady zbierania i wydawania punktów</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-stefano-red hover:bg-red-600">Edytuj</Button>
                      <Button size="sm" variant="outline" className="border-gray-600">Pobierz</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Polityka Prywatności</h4>
                    <p className="text-sm text-gray-400 mb-3">Informacje o przetwarzaniu danych</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-stefano-red hover:bg-red-600">Edytuj</Button>
                      <Button size="sm" variant="outline" className="border-gray-600">Pobierz</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Regulamin Zamówień Online</h4>
                    <p className="text-sm text-gray-400 mb-3">Zasady składania zamówień przez stronę</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-stefano-red hover:bg-red-600">Edytuj</Button>
                      <Button size="sm" variant="outline" className="border-gray-600">Pobierz</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Polityka Cookies</h4>
                    <p className="text-sm text-gray-400 mb-3">Informacje o plikach cookies</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-stefano-red hover:bg-red-600">Edytuj</Button>
                      <Button size="sm" variant="outline" className="border-gray-600">Pobierz</Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Karta Alergii</h4>
                    <p className="text-sm text-gray-400 mb-3">Informacje o alergenach w potrawach</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-stefano-red hover:bg-red-600">Edytuj</Button>
                      <Button size="sm" variant="outline" className="border-gray-600">Pobierz</Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <h4 className="font-medium text-blue-400 mb-2">Wymagane Oznaczenia na Stronie</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <strong>Stopka prawna:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Nazwa firmy i forma prawna</li>
                        <li>• NIP, REGON, KRS</li>
                        <li>• Adres siedziby</li>
                        <li>• Kapitał zakładowy</li>
                        <li>• Sąd rejestrowy</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Informacje RODO:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Administrator danych</li>
                        <li>• Kontakt do spraw RODO</li>
                        <li>• Cele przetwarzania</li>
                        <li>• Prawa osób fizycznych</li>
                        <li>• Okres przechowywania</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-bot" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    AI Marketing Bot - Status AKTYWNY
                  </CardTitle>
                  <CardDescription>Bot działa 24/7 analizując zamówienia i tworząc reklamy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="text-sm text-green-400">Zamówienia dziś</div>
                      <div className="text-2xl font-bold text-green-400">{stats.totalOrders}</div>
                      <div className="text-xs text-green-300">+15% vs wczoraj</div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="text-sm text-blue-400">Posty utworzone</div>
                      <div className="text-2xl font-bold text-blue-400">127</div>
                      <div className="text-xs text-blue-300">Automatycznie</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Ostatnie akcje bota:</h4>
                    <div className="text-xs space-y-1 bg-gray-800 p-3 rounded-lg">
                      <div className="text-green-400">✅ 12:34 - Opublikowano post o pizzy na Instagram</div>
                      <div className="text-green-400">✅ 12:15 - Wygenerowano grafikę promocyjną</div>
                      <div className="text-green-400">✅ 11:45 - Odpowiedziano na komentarz Facebook</div>
                      <div className="text-blue-400">🔄 11:30 - Analizuję trendy konkurencji</div>
                      <div className="text-yellow-400">⏳ 11:00 - Planuję posty na jutro</div>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Więcej statystyk bota
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-purple-400" />
                    AI Analiza Zamówień
                  </CardTitle>
                  <CardDescription>Inteligentna analiza wzorców i automatyczne działania</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Wykryte trendy:</h4>
                    <ul className="text-sm space-y-1">
                      <li>🍕 Pizza Margherita +45% popularności</li>
                      <li>🍗 Kurczak Family King - hit weekendów</li>
                      <li>🕐 Szczyt zamówień: 18:00-20:00</li>
                      <li>📱 80% zamówień online</li>
                    </ul>
                  </div>
                  
                  <div className="bg-stefano-red/10 border border-stefano-red/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Automatyczne akcje:</h4>
                    <ul className="text-sm space-y-1">
                      <li>🎯 Reklamy targetowane na pizze</li>
                      <li>⏰ Posty o 17:30 przed szczytem</li>
                      <li>📸 Zdjęcia bestsellerów codziennie</li>
                      <li>💬 Odpowiedzi na komentarze &lt;5min</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-400" />
                  Ekspansywna Strategia Social Media
                </CardTitle>
                <CardDescription>Aggressive marketing z AI na wszystkich platformach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                    <Facebook className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-semibold">Facebook Domination</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• 8 postów dziennie</li>
                      <li>• Stories co 4h</li>
                      <li>• Live gotowania</li>
                      <li>• Konkursy tygodniowe</li>
                      <li>• Reklamy targetowane</li>
                    </ul>
                  </div>
                  
                  <div className="bg-pink-600/10 border border-pink-600/20 rounded-lg p-4">
                    <Instagram className="w-8 h-8 text-pink-600 mb-2" />
                    <h4 className="font-semibold">Instagram Takeover</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• 12 stories dziennie</li>
                      <li>• Reels z przepisami</li>
                      <li>• IGTV behind scenes</li>
                      <li>• Influencer collab</li>
                      <li>• User generated content</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
                    <Youtube className="w-8 h-8 text-red-600 mb-2" />
                    <h4 className="font-semibold">YouTube Empire</h4>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Vlogi kuchenne</li>
                      <li>• Tutorials gotowania</li>
                      <li>• Customer reviews</li>
                      <li>• Virtual restaurant tour</li>
                      <li>• Chef competitions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 bg-stefano-gold/10 border border-stefano-gold/20 rounded-lg p-4">
                  <h4 className="font-semibold text-stefano-gold mb-3">🚀 EXPLOSIVE GROWTH PLAN</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Tygodniowe cele:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• 1000+ nowych followersów</li>
                        <li>• 50000+ zasięg organiczny</li>
                        <li>• 200+ zamówień z social</li>
                        <li>• 25+ user generated posts</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Miesięczne milestone:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• 10K followers Instagram</li>
                        <li>• 5K likes Facebook</li>
                        <li>• 1K subskrypcji YouTube</li>
                        <li>• Top 3 restauracja w Bełchatowie</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <QualityControl />
          </TabsContent>

          {/* Enterprise module moved to separate folder - /enterprise */}

          <TabsContent value="api-config" className="space-y-6">
            <ApiConfig />
          </TabsContent>

          <TabsContent value="cost-monitoring" className="space-y-6">
            <CostMonitoring />
          </TabsContent>

          <TabsContent value="social-manager" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Utwórz Nowy Post
                  </CardTitle>
                  <CardDescription>DEMO - Stwórz post i opublikuj na wszystkich platformach</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Napisz treść posta... (AI automatycznie doda hashtagi)"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="min-h-[100px] bg-gray-800 border-gray-600"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Wybierz platformy (jedną akcją na wszystkie):</label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPlatforms(['Facebook', 'Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Twitter', 'Pinterest', 'Snapchat', 'WhatsApp Status', 'Telegram', 'Discord', 'Reddit'])}
                          className="text-xs border-stefano-gold text-stefano-gold hover:bg-stefano-gold hover:text-black"
                        >
                          ✅ Wszystkie
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPlatforms([])}
                          className="text-xs border-gray-500"
                        >
                          ❌ Wyczyść
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Facebook', 'Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Twitter',
                        'Pinterest', 'Snapchat', 'WhatsApp Status', 'Telegram', 'Discord', 'Reddit'
                      ].map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={platform}
                            checked={selectedPlatforms.includes(platform)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPlatforms([...selectedPlatforms, platform]);
                              } else {
                                setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
                              }
                            }}
                          />
                          <label htmlFor={platform} className="text-sm">{platform}</label>
                        </div>
                      ))}
                    </div>

                    <div className="bg-stefano-red/10 border border-stefano-red/20 rounded-lg p-3">
                      <h4 className="text-sm font-semibold mb-2">🚀 Szybkie zestawy platform:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPlatforms(['Facebook', 'Instagram', 'WhatsApp Status'])}
                          className="text-xs"
                        >
                          📱 Główne
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPlatforms(['TikTok', 'Instagram', 'YouTube', 'Snapchat'])}
                          className="text-xs"
                        >
                          🎥 Video
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPlatforms(['LinkedIn', 'Facebook', 'Twitter'])}
                          className="text-xs"
                        >
                          💼 Biznes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPlatforms(['Discord', 'Reddit', 'Telegram'])}
                          className="text-xs"
                        >
                          💬 Społeczności
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={createSocialPost}
                      className="flex-1 bg-stefano-red hover:bg-red-600"
                      disabled={!newPost.content || selectedPlatforms.length === 0}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publikuj Teraz
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="border-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Zaplanuj
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                          className="bg-gray-800"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <Button 
                    onClick={scheduleBulkPosts}
                    variant="outline" 
                    className="w-full border-stefano-gold text-stefano-gold hover:bg-stefano-gold hover:text-black"
                  >
                    🚀 Zaplanuj 5 postów na tydzień (BULK)
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Zaplanowane Posty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {socialPosts.map((post) => (
                      <div key={post.id} className="bg-gray-800 p-3 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="bg-gray-700 p-3 rounded-lg border-l-4 border-stefano-gold mb-2">
                              <h4 className="text-xs text-stefano-gold mb-1">📱 PODGLĄD POSTA:</h4>
                              <p className="text-sm text-white">{post.content}</p>
                              {post.imageUrl && (
                                <img 
                                  src={post.imageUrl} 
                                  alt="Post image" 
                                  className="mt-2 w-full max-w-[200px] rounded border border-gray-500"
                                />
                              )}
                            </div>
                            <div className="flex gap-1 mt-2">
                              {post.platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="text-xs border-stefano-gold text-stefano-gold">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              Zaplanowano: {post.scheduledDate ? new Date(post.scheduledDate).toLocaleString('pl-PL') : 'Natychmiast'}
                            </p>
                          </div>
                          <Badge 
                            variant={post.status === 'published' ? 'default' : 'secondary'}
                            className={post.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'}
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {post.status !== 'published' && (
                            <Button 
                              size="sm" 
                              onClick={() => publishToSocialMedia(post)}
                              className="bg-stefano-red hover:bg-red-600"
                            >
                              Publikuj teraz
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setNewPost({
                                content: post.content,
                                imageUrl: post.imageUrl || '',
                                scheduledDate: null
                              });
                              setSelectedPlatforms(post.platforms);
                            }}
                            className="border-gray-500 text-gray-300"
                          >
                            Edytuj
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="graphics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Generator Grafik
                  </CardTitle>
                  <CardDescription>AI tworzy profesjonalne grafiki w stylu Stefano</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Wybierz szablon grafiki" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {graphicTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.preview} {template.name} ({template.dimensions.width}x{template.dimensions.height})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Tekst na grafice..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="bg-gray-800 border-gray-600"
                  />
                  
                  <Button 
                    onClick={() => generateGraphic(selectedTemplate, customText)}
                    className="w-full bg-stefano-red hover:bg-red-600"
                    disabled={!selectedTemplate || !customText}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Generuj Grafikę
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="w-5 h-5" />
                    Podgląd Grafiki
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedGraphic ? (
                    <div className="space-y-4">
                      <img 
                        src={generatedGraphic} 
                        alt="Generated Graphic" 
                        className="w-full rounded-lg border border-gray-600"
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.download = `stefano-graphic-${Date.now()}.png`;
                            link.href = generatedGraphic;
                            link.click();
                          }}
                          className="flex-1 bg-stefano-gold text-black hover:bg-yellow-500"
                        >
                          Pobierz
                        </Button>
                        <Button 
                          onClick={() => setNewPost({...newPost, imageUrl: generatedGraphic})}
                          variant="outline"
                          className="flex-1 border-stefano-red text-stefano-red hover:bg-stefano-red hover:text-white"
                        >
                          Użyj w poście
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                      Wybierz szablon i tekst, aby wygenerować grafikę
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Automatyczne SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Codzienne Zadania</h3>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>✅ Aktualizacja meta tagów</li>
                      <li>✅ Generowanie hashtagów</li>
                      <li>✅ Tworzenie postów social media</li>
                      <li>✅ Monitorowanie pozycji</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Cotygodniowe</h3>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>📊 Raport SEO</li>
                      <li>🔍 Analiza konkurencji</li>
                      <li>📈 Optymalizacja treści</li>
                      <li>🎯 Nowe słowa kluczowe</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-stefano-red/10 border border-stefano-red/20 rounded-lg p-4">
                  <h3 className="font-semibold text-stefano-red mb-2">Rekomendacje na Dziś</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Opublikuj post z hashtagiem #StefanoRestaurant</li>
                    <li>• Dodaj nowe zdjęcie potraw na Instagram</li>
                    <li>• Odpowiedz na recenzje Google</li>
                    <li>• Zaktualizuj godziny otwarcia</li>
                  </ul>
                </div>

                {/* Reset Statistics Section */}
                <Card className="bg-yellow-900/20 border-yellow-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400">
                      <AlertTriangle className="w-5 h-5" />
                      Zerowanie Statystyk
                    </CardTitle>
                    <CardDescription className="text-yellow-300">
                      Opcje zerowania liczników i danych analitycznych
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        onClick={() => resetStats('orders')}
                        variant="outline"
                        className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Zamówienia
                      </Button>
                      
                      <Button
                        onClick={() => resetStats('loyalty')}
                        variant="outline"
                        className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                        size="sm"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Lojalność
                      </Button>
                      
                      <Button
                        onClick={() => resetStats('analytics')}
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                        size="sm"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                      
                      <Button
                        onClick={() => resetStats('all')}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Wszystko
                      </Button>
                    </div>
                    
                    <div className="bg-red-900/30 border border-red-600 rounded-lg p-3">
                      <p className="text-sm text-red-300">
                        ⚠️ <strong>Uwaga:</strong> Zerowanie statystyk jest nieodwracalne. 
                        Dane będą wyzerowane na wszystkich dashboard-ach i raportach.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-stefano-gold">
                  <Users className="w-5 h-5" />
                  Baza Klientów RODO
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Zarządzanie danymi klientów z pełną zgodą RODO
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Wszyscy Klienci</p>
                          <p className="text-2xl font-bold text-blue-400">1,234</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Zgodny z RODO</p>
                          <p className="text-2xl font-bold text-green-400">98%</p>
                        </div>
                        <Shield className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Newsletter</p>
                          <p className="text-2xl font-bold text-purple-400">756</p>
                        </div>
                        <Mail className="w-8 h-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Marketing</p>
                          <p className="text-2xl font-bold text-orange-400">423</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Management Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Dodaj Nowego Klienta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Imię" className="bg-gray-700 border-gray-600" />
                        <Input placeholder="Nazwisko" className="bg-gray-700 border-gray-600" />
                      </div>
                      <Input placeholder="Email" className="bg-gray-700 border-gray-600" />
                      <Input placeholder="Telefon" className="bg-gray-700 border-gray-600" />
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="gdpr" className="rounded" />
                          <label htmlFor="gdpr" className="text-sm text-gray-300">
                            Zgodny z RODO
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="marketing" className="rounded" />
                          <label htmlFor="marketing" className="text-sm text-gray-300">
                            Marketing
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="newsletter" className="rounded" />
                          <label htmlFor="newsletter" className="text-sm text-gray-300">
                            Newsletter
                          </label>
                        </div>
                      </div>
                      <Button className="w-full bg-stefano-red hover:bg-red-600">
                        Dodaj Klienta
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Żądania RODO
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Usunięcie danych</p>
                            <p className="text-xs text-gray-400">jan.kowalski@email.com</p>
                          </div>
                          <Badge className="bg-yellow-600">Oczekujące</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Eksport danych</p>
                            <p className="text-xs text-gray-400">anna.nowak@email.com</p>
                          </div>
                          <Badge className="bg-green-600">Zakończone</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Korekta danych</p>
                            <p className="text-xs text-gray-400">piotr.smith@email.com</p>
                          </div>
                          <Badge className="bg-blue-600">W toku</Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Zobacz Wszystkie Żądania
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer List */}
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Lista Klientów
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left p-3">Imię i Nazwisko</th>
                            <th className="text-left p-3">Email</th>
                            <th className="text-left p-3">Telefon</th>
                            <th className="text-left p-3">RODO</th>
                            <th className="text-left p-3">Marketing</th>
                            <th className="text-left p-3">Newsletter</th>
                            <th className="text-left p-3">Akcje</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-700">
                            <td className="p-3">Jan Kowalski</td>
                            <td className="p-3">jan.kowalski@email.com</td>
                            <td className="p-3">+48 123 456 789</td>
                            <td className="p-3">
                              <Badge className="bg-green-600">Tak</Badge>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-red-600">Nie</Badge>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-green-600">Tak</Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="p-3">Anna Nowak</td>
                            <td className="p-3">anna.nowak@email.com</td>
                            <td className="p-3">+48 987 654 321</td>
                            <td className="p-3">
                              <Badge className="bg-green-600">Tak</Badge>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-green-600">Tak</Badge>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-green-600">Tak</Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-700">
                            <td className="p-3">Piotr Smith</td>
                            <td className="p-3">piotr.smith@email.com</td>
                            <td className="p-3">+48 555 123 987</td>
                            <td className="p-3">
                              <Badge className="bg-green-600">Tak</Badge>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-yellow-600">Częściowo</Badge>
                            </td>
                            <td className="p-3">
                              <Badge className="bg-red-600">Nie</Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* GDPR Compliance Tools */}
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Narzędzia Zgodności RODO
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="h-16 flex-col bg-blue-600 hover:bg-blue-700">
                        <Download className="w-6 h-6 mb-2" />
                        <span className="text-sm">Eksport Wszystkich Danych</span>
                      </Button>
                      <Button className="h-16 flex-col bg-green-600 hover:bg-green-700">
                        <FileCheck className="w-6 h-6 mb-2" />
                        <span className="text-sm">Raport Zgodności</span>
                      </Button>
                      <Button className="h-16 flex-col bg-purple-600 hover:bg-purple-700">
                        <Settings className="w-6 h-6 mb-2" />
                        <span className="text-sm">Konfiguracja RODO</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}