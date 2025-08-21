import LoyaltyProgram from "@/components/loyalty-program";
import { ProtectedRoute } from "@/components/protected-route";

export default function LoyaltyPage() {
  return (
    <ProtectedRoute requireLoyalty>
      <LoyaltyProgram />
    </ProtectedRoute>
  );
}