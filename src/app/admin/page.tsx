import { ProtectedRoute } from "@/components/protected-route";
import AdminPageContent from "@/page-sections/AdminPageContent";

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminPageContent />
    </ProtectedRoute>
  );
}
