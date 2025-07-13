import { useAuthStore } from "@/store/auth-store";
import { showToast } from "@/utils/show-toast";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();

  const { logOut, user } = useAuthStore();

  const handleLogout = () => {
    logOut();
    showToast(
      "SUCCESS",
      {
        description: "Logged out successfully",
      },
      "success"
    );
    router.replace("/");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title="Confirm Logout"
      description={`Are you sure you want to logout, ${
        user?.username || "user"
      }?`}
      showCloseButton={true}
      showConfirmButton={true}
      closeButtonText="Cancel"
      confirmBtnText="Logout"
      confirmBtnVariant="destructive"
      onConfirm={handleLogout}
      className="max-w-md"
    >
      <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
        <div>
          <p className="text-sm text-red-800 dark:text-red-200">
            You will be signed out of your account and redirected to the login
            page.
          </p>
        </div>
      </div>
    </Modal>
  );
}
