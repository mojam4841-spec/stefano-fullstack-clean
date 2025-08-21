import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireLoyalty?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireLoyalty = false 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAdmin, isLoyaltyMember } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in
        setLocation('/login');
      } else if (requireAdmin && !isAdmin) {
        // Not admin
        setLocation('/');
      } else if (requireLoyalty && !isLoyaltyMember) {
        // Not loyalty member
        setLocation('/');
      }
    }
  }, [user, isLoading, isAdmin, isLoyaltyMember, requireAdmin, requireLoyalty, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-stefano-gold mx-auto mb-4" />
          <p className="text-white">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user || (requireAdmin && !isAdmin) || (requireLoyalty && !isLoyaltyMember)) {
    return null;
  }

  return <>{children}</>;
}