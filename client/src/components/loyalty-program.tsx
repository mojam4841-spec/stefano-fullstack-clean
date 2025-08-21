import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLoyaltyMemberSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Crown, Star, Award, Gift, Trophy, Sparkles, Phone, User, Calendar } from "lucide-react";

interface LoyaltyMember {
  id: number;
  phone: string;
  name: string;
  email?: string;
  totalPoints: number;
  lifetimePoints: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  joinDate: string;
  lastVisit: string;
  totalOrders: number;
  totalSpent: number;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  value: number;
  minTier: string;
  isActive: boolean;
}

interface PointsTransaction {
  id: number;
  type: string;
  points: number;
  description: string;
  createdAt: string;
}

const tierColors = {
  bronze: "bg-amber-100 text-amber-800 border-amber-200",
  silver: "bg-gray-100 text-gray-800 border-gray-200", 
  gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
  platinum: "bg-purple-100 text-purple-800 border-purple-200"
};

const tierIcons = {
  bronze: Award,
  silver: Star,
  gold: Crown,
  platinum: Trophy
};

const tierRequirements = {
  bronze: 0,
  silver: 500,
  gold: 2000,
  platinum: 5000
};

export default function LoyaltyProgram() {
  const [currentMember, setCurrentMember] = useState<LoyaltyMember | null>(null);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const joinForm = useForm({
    resolver: zodResolver(insertLoyaltyMemberSchema),
    defaultValues: {
      phone: "",
      name: "",
      email: ""
    }
  });

  // Join loyalty program mutation
  const joinMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/loyalty/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Witamy w programie lojalnościowym!",
        description: `Otrzymałeś 100 punktów powitalnych!`
      });
      setCurrentMember(data.member);
      setShowJoinDialog(false);
      joinForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Błąd rejestracji",
        description: error.message || "Wystąpił błąd podczas rejestracji",
        variant: "destructive"
      });
    }
  });

  // Search member by phone
  const searchMember = async () => {
    if (!phoneSearch.trim()) return;
    
    try {
      const response = await fetch(`/api/loyalty/member/${phoneSearch}`);
      if (response.ok) {
        const member = await response.json();
        setCurrentMember(member);
        toast({
          title: "Członek znaleziony!",
          description: `Witaj ponownie, ${member.name}!`
        });
      } else {
        toast({
          title: "Nie znaleziono członka",
          description: "Numer telefonu nie jest zarejestrowany w programie",
          variant: "destructive"
        });
        setCurrentMember(null);
      }
    } catch (error) {
      toast({
        title: "Błąd wyszukiwania",
        description: "Wystąpił błąd podczas wyszukiwania",
        variant: "destructive"
      });
    }
  };

  // Get active rewards
  const { data: rewards = [] } = useQuery<Reward[]>({
    queryKey: ["/api/rewards/active"],
    enabled: !!currentMember
  });

  // Get points transactions
  const { data: transactions = [] } = useQuery<PointsTransaction[]>({
    queryKey: ["/api/loyalty/points", currentMember?.id],
    enabled: !!currentMember
  });

  // Redeem reward mutation
  const redeemMutation = useMutation({
    mutationFn: async (rewardId: number) => {
      const response = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: currentMember?.id,
          rewardId,
          phone: currentMember?.phone
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Redemption failed");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Nagroda odebrana!",
        description: `Kod: ${data.code}. Ważny przez 30 dni.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty/member"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty/points"] });
    },
    onError: (error: any) => {
      toast({
        title: "Błąd odbioru nagrody",
        description: error.message || "Wystąpił błąd podczas odbioru nagrody",
        variant: "destructive"
      });
    }
  });

  const getTierIcon = (tier: string) => {
    const Icon = tierIcons[tier as keyof typeof tierIcons] || Award;
    return <Icon className="w-4 h-4" />;
  };

  const getNextTierProgress = (member: LoyaltyMember) => {
    const tiers = Object.keys(tierRequirements);
    const currentTierIndex = tiers.indexOf(member.tier);
    if (currentTierIndex === tiers.length - 1) return null;
    
    const nextTier = tiers[currentTierIndex + 1];
    const nextTierRequirement = tierRequirements[nextTier as keyof typeof tierRequirements];
    const progress = (member.lifetimePoints / nextTierRequirement) * 100;
    
    return {
      nextTier,
      progress: Math.min(progress, 100),
      needed: Math.max(0, nextTierRequirement - member.lifetimePoints)
    };
  };

  if (!currentMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600 p-3 rounded-full">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Program Lojalnościowy Stefano
            </h1>
            <p className="text-gray-600">
              Zdobywaj punkty za każde zamówienie i wymieniaj je na nagrody!
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Sprawdź swoje punkty
              </CardTitle>
              <CardDescription>
                Wpisz numer telefonu, aby sprawdzić stan punktów
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Numer telefonu"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchMember()}
                />
                <Button onClick={searchMember}>
                  Sprawdź
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Nie masz konta?
              </CardTitle>
              <CardDescription>
                Dołącz do programu lojalnościowego i otrzymaj 100 punktów powitalnych!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Gift className="w-4 h-4 mr-2" />
                    Dołącz teraz (+100 punktów)
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dołącz do programu lojalnościowego</DialogTitle>
                    <DialogDescription>
                      Wypełnij formularz, aby rozpocząć zbieranie punktów
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...joinForm}>
                    <form onSubmit={joinForm.handleSubmit((data) => joinMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={joinForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Imię i nazwisko</FormLabel>
                            <FormControl>
                              <Input placeholder="Jan Kowalski" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={joinForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numer telefonu</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={joinForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (opcjonalnie)</FormLabel>
                            <FormControl>
                              <Input placeholder="jan@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={joinMutation.isPending}>
                        {joinMutation.isPending ? "Rejestracja..." : "Dołącz do programu"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Jak to działa?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-red-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <p className="text-sm text-gray-600">Zamawiaj jedzenie</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-red-600 font-bold">2</span>
                </div>
                <p className="text-sm text-gray-600">Zdobywaj punkty</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <p className="text-sm text-gray-600">Wymieniaj na nagrody</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nextTier = getNextTierProgress(currentMember);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => setCurrentMember(null)}
            className="mb-4"
          >
            ← Powrót
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Witaj, {currentMember.name}!
          </h1>
          <p className="text-gray-600">
            Twój profil w programie lojalnościowym Stefano
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Twoje punkty</span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {currentMember.totalPoints}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Punkty do wykorzystania
              </p>
              <div className="text-sm text-gray-500">
                Łącznie zdobyte: {currentMember.lifetimePoints} punktów
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Twój poziom</span>
                {getTierIcon(currentMember.tier)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`mb-4 ${tierColors[currentMember.tier]}`}>
                {currentMember.tier.toUpperCase()}
              </Badge>
              {nextTier && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Do poziomu {nextTier.nextTier}</span>
                    <span>{nextTier.needed} punktów</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${nextTier.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rewards">Nagrody</TabsTrigger>
            <TabsTrigger value="history">Historia</TabsTrigger>
            <TabsTrigger value="stats">Statystyki</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => {
                const canRedeem = currentMember.totalPoints >= reward.pointsCost;
                const tierOk = tierRequirements[currentMember.tier] >= tierRequirements[reward.minTier as keyof typeof tierRequirements];
                
                return (
                  <Card key={reward.id} className={`${canRedeem && tierOk ? '' : 'opacity-50'}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-red-600">
                          {reward.pointsCost} pkt
                        </span>
                        <Badge variant="outline">
                          {reward.minTier} +
                        </Badge>
                      </div>
                      <Button 
                        className="w-full"
                        disabled={!canRedeem || !tierOk || redeemMutation.isPending}
                        onClick={() => redeemMutation.mutate(reward.id)}
                      >
                        {!tierOk ? `Wymagany ${reward.minTier}` : 
                         !canRedeem ? 'Za mało punktów' : 
                         redeemMutation.isPending ? 'Odbieram...' : 'Odbierz nagrodę'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historia punktów</CardTitle>
                <CardDescription>
                  Wszystkie twoje transakcje punktowe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('pl-PL')}
                        </p>
                      </div>
                      <div className={`font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Członkostwo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    Dołączyłeś: {new Date(currentMember.joinDate).toLocaleDateString('pl-PL')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Ostatnia wizyta: {new Date(currentMember.lastVisit).toLocaleDateString('pl-PL')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Zamówienia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600 mb-2">
                    {currentMember.totalOrders}
                  </p>
                  <p className="text-sm text-gray-600">
                    Wydane łącznie: {(currentMember.totalSpent / 100).toFixed(2)} zł
                  </p>
                </CardContent>
              </Card>
            </div>


          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}