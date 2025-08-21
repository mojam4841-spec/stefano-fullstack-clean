import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'customer' | 'loyalty_member';
  loyaltyNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isLoyaltyMember: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  joinLoyaltyProgram?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );

  // Fetch current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await apiRequest('POST', '/api/auth/login', { email, password });
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Zalogowano pomyślnie",
        description: `Witaj ${data.user.firstName || data.user.email}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Błąd logowania",
        description: error.message || "Nieprawidłowy email lub hasło",
        variant: "destructive",
      });
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      return await apiRequest('POST', '/api/auth/register', data);
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Konto utworzone",
        description: data.user.loyaltyNumber 
          ? `Witaj w programie lojalnościowym! Twój numer: ${data.user.loyaltyNumber}`
          : "Konto zostało pomyślnie utworzone!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Błąd rejestracji",
        description: error.message || "Nie udało się utworzyć konta",
        variant: "destructive",
      });
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('authToken');
      setToken(null);
      queryClient.clear();
      toast({
        title: "Wylogowano",
        description: "Zostałeś pomyślnie wylogowany",
      });
    }
  });

  // Set auth header for all requests
  useEffect(() => {
    if (token) {
      window.localStorage.setItem('authToken', token);
    }
  }, [token]);

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    login: async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
    },
    register: async (data: RegisterData) => {
      await registerMutation.mutateAsync(data);
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    isAdmin: user?.role === 'admin',
    isLoyaltyMember: user?.role === 'loyalty_member' || user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}