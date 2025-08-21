import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Crown, Star, Award, Gift, Trophy, Sparkles, User } from "lucide-react";
import { z } from "zod";

// Simplified schemas without avatar field
const simpleLoyaltyMemberSchema = z.object({
  phone: z.string().min(9, "Numer telefonu musi mieć co najmniej 9 cyfr"),
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  email: z.string().email("Nieprawidłowy format email").optional().or(z.literal(""))
});

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

  const joinForm = useForm({
    resolver: zodResolver(simpleLoyaltyMemberSchema),
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
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Search member by phone
  const searchMember = async (phone: string) => {
    if (!phone || phone.length < 9) return;
    try {
      const response = await fetch(`/api/loyalty/member/${phone}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentMember(data.member);
        toast({
          title: "Klient znaleziony!",
          description: `Witaj ponownie, ${data.member.name}!`
        });
      } else {
        setCurrentMember(null);
        toast({
          title: "Klient nie znaleziony",
          description: "Zarejestruj się w programie lojalnościowym!"
        });
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Get tier info
  const getTierInfo = (member: LoyaltyMember) => {
    const currentTier = member.tier;
    const currentPoints = member.lifetimePoints;
    const TierIcon = tierIcons[currentTier];
    
    const nextTier = currentTier === 'bronze' ? 'silver' : 
                    currentTier === 'silver' ? 'gold' : 
                    currentTier === 'gold' ? 'platinum' : null;
    
    const nextTierPoints = nextTier ? tierRequirements[nextTier] : null;
    const pointsToNext = nextTierPoints ? nextTierPoints - currentPoints : 0;

    return {
      currentTier,
      currentPoints,
      TierIcon,
      nextTier,
      pointsToNext: Math.max(0, pointsToNext)
    };
  };

  // Mock rewards data
  const mockRewards: Reward[] = [
    { id: 1, name: "Darmowa kawa", description: "Kawa na wynos", pointsCost: 50, category: "Napoje", value: 8, minTier: "bronze", isActive: true },
    { id: 2, name: "10% zniżka", description: "Na całe zamówienie", pointsCost: 100, category: "Zniżki", value: 0, minTier: "bronze", isActive: true },
    { id: 3, name: "Darmowy deser", description: "Dowolny deser z menu", pointsCost: 150, category: "Desery", value: 15, minTier: "silver", isActive: true },
    { id: 4, name: "20% zniżka VIP", description: "Dla członków Gold", pointsCost: 250, category: "Zniżki", value: 0, minTier: "gold", isActive: true },
    { id: 5, name: "Darmowa pizza", description: "Pizza średnia do wyboru", pointsCost: 500, category: "Główne dania", value: 45, minTier: "gold", isActive: true }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-stefano-red to-stefano-gold bg-clip-text text-transparent">
            Program Lojalnościowy STEFANO
          </h1>
          <p className="text-lg text-gray-300">
            Zbieraj punkty za każde zamówienie i wymieniaj je na nagrody!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Login/Search Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-stefano-gold flex items-center gap-2">
                <User className="w-5 h-5" />
                Sprawdź swoje punkty
              </CardTitle>
              <CardDescription>Wpisz numer telefonu aby sprawdzić status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Numer telefonu (np. 123456789)"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
                <Button 
                  onClick={() => searchMember(phoneSearch)}
                  className="bg-stefano-red hover:bg-red-600"
                >
                  Sprawdź
                </Button>
              </div>
              
              {!currentMember && (
                <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-stefano-gold text-black hover:bg-yellow-500">
                      <Crown className="w-4 h-4 mr-2" />
                      Dołącz do programu lojalnościowego
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Rejestracja w programie lojalnościowym</DialogTitle>
                      <DialogDescription>
                        Wypełnij formularz i otrzymaj 100 punktów powitalnych!
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...joinForm}>
                      <form onSubmit={joinForm.handleSubmit((data) => joinMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={joinForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Imię i nazwisko</FormLabel>
                              <FormControl>
                                <Input placeholder="Jan Kowalski" {...field} className="bg-gray-700 border-gray-600" />
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
                              <FormLabel className="text-white">Numer telefonu</FormLabel>
                              <FormControl>
                                <Input placeholder="123456789" {...field} className="bg-gray-700 border-gray-600" />
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
                              <FormLabel className="text-white">Email (opcjonalnie)</FormLabel>
                              <FormControl>
                                <Input placeholder="jan@example.com" {...field} className="bg-gray-700 border-gray-600" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full bg-stefano-red hover:bg-red-600" disabled={joinMutation.isPending}>
                          {joinMutation.isPending ? "Rejestracja..." : "Dołącz do programu"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {/* Member Status */}
          {currentMember && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-stefano-gold flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Status członkostwa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{currentMember.name}</h3>
                      <p className="text-gray-400">{currentMember.phone}</p>
                    </div>
                    <Badge className={tierColors[currentMember.tier]}>
                      {currentMember.tier.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-stefano-gold">{currentMember.totalPoints}</div>
                      <div className="text-sm text-gray-400">Aktualne punkty</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-stefano-gold">{currentMember.lifetimePoints}</div>
                      <div className="text-sm text-gray-400">Łącznie punktów</div>
                    </div>
                  </div>

                  {(() => {
                    const tierInfo = getTierInfo(currentMember);
                    return tierInfo.nextTier && (
                      <div className="pt-4 border-t border-gray-600">
                        <div className="text-sm text-gray-400 mb-2">
                          Do poziomu {tierInfo.nextTier.toUpperCase()}: {tierInfo.pointsToNext} punktów
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-stefano-gold h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, ((tierInfo.currentPoints - tierRequirements[currentMember.tier]) / (tierRequirements[tierInfo.nextTier as keyof typeof tierRequirements] - tierRequirements[currentMember.tier])) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Rewards Section */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-stefano-gold flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Dostępne nagrody
            </CardTitle>
            <CardDescription>Wymień punkty na fantastyczne nagrody!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockRewards.map((reward) => (
                <Card key={reward.id} className="bg-gray-900 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{reward.name}</h4>
                      <Badge variant="outline" className="text-stefano-gold border-stefano-gold">
                        {reward.pointsCost} pkt
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{reward.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Min. {reward.minTier}</span>
                      <Button 
                        size="sm" 
                        className="bg-stefano-red hover:bg-red-600"
                        disabled={!currentMember || currentMember.totalPoints < reward.pointsCost}
                      >
                        Wymień
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-stefano-gold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Jak to działa?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-stefano-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2 text-white">Zamawiaj</h3>
                <p className="text-sm text-gray-400">Za każde 1 zł wydane otrzymujesz 1 punkt</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stefano-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2 text-white">Zbieraj</h3>
                <p className="text-sm text-gray-400">Punkty się kumulują i awansujesz w statusie</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stefano-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2 text-white">Wymieniaj</h3>
                <p className="text-sm text-gray-400">Odbierz nagrody i ciesz się korzyściami</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}