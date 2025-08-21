import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { LogIn, UserPlus, Shield, Crown } from 'lucide-react';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, register, isLoading } = useAuth();
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [joinLoyalty, setJoinLoyalty] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      setLocation('/');
    } catch (error) {
      // Error is handled by auth context
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email: registerEmail,
        password: registerPassword,
        firstName,
        lastName,
        phone,
        joinLoyaltyProgram: joinLoyalty,
      });
      setLocation('/');
    } catch (error) {
      // Error is handled by auth context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gray-800/90 backdrop-blur-sm border-stefano-gold/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-stefano-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Stefano Restaurant & Pub
          </CardTitle>
          <CardDescription className="text-gray-300">
            Zaloguj się lub utwórz konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="login" className="data-[state=active]:bg-stefano-red">
                <LogIn className="mr-2 h-4 w-4" />
                Logowanie
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-stefano-red">
                <UserPlus className="mr-2 h-4 w-4" />
                Rejestracja
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="twoj@email.pl"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white">Hasło</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-stefano-red hover:bg-red-700"
                >
                  {isLoading ? 'Logowanie...' : 'Zaloguj się'}
                </Button>
                <div className="text-center text-sm text-gray-400">
                  <p>Demo: admin@stefano.pl / admin123</p>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">Imię</Label>
                    <Input
                      id="firstName"
                      placeholder="Jan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Nazwisko</Label>
                    <Input
                      id="lastName"
                      placeholder="Kowalski"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-white">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="twoj@email.pl"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Telefon (opcjonalnie)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+48 123 456 789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-white">Hasło</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="loyalty"
                    checked={joinLoyalty}
                    onCheckedChange={(checked) => setJoinLoyalty(checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-stefano-gold"
                  />
                  <Label 
                    htmlFor="loyalty" 
                    className="text-sm text-white cursor-pointer flex items-center"
                  >
                    <Crown className="mr-1 h-4 w-4 text-stefano-gold" />
                    Dołącz do programu lojalnościowego
                  </Label>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-stefano-red hover:bg-red-700"
                >
                  {isLoading ? 'Rejestracja...' : 'Utwórz konto'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-stefano-gold hover:underline">
              ← Powrót do strony głównej
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}