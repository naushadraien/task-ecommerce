import { ProtectedRoute } from "@/components/protected-route";
import { ProfilePageContent } from "@/page-sections/ProfilePageContent";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
