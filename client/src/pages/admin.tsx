import AdminPanel from "@/components/admin-panel";
import { ProtectedRoute } from "@/components/protected-route";

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPanel />
    </ProtectedRoute>
  );
}