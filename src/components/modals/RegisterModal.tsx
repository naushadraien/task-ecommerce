import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Modal from "./Modal";
import { Button } from "../ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: RegisterForm) => Promise<void>;
  isLoading?: boolean;
};

type RegisterForm = z.infer<typeof registerSchema>;

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterModal({
  isOpen,
  onClose,
  onRegister,
  isLoading,
}: Props) {
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <Modal
      open={isOpen}
      title="Create Account"
      description="Join ModernShop and start shopping today"
      onOpenChange={onClose}
      isLoading={isLoading}
      showCloseButton={false}
      showConfirmButton={false}
    >
      <form
        className="space-y-4"
        onSubmit={registerForm.handleSubmit(onRegister)}
      >
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            {...registerForm.register("username")}
            placeholder="Enter your username"
            disabled={isLoading}
          />
          {registerForm.formState.errors.username && (
            <p className="text-sm text-red-600">
              {registerForm.formState.errors.username.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            {...registerForm.register("email")}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {registerForm.formState.errors.email && (
            <p className="text-sm text-red-600">
              {registerForm.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            {...registerForm.register("password")}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {registerForm.formState.errors.password && (
            <p className="text-sm text-red-600">
              {registerForm.formState.errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...registerForm.register("confirmPassword")}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          {registerForm.formState.errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {registerForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <button
              type="button"
              onClick={() => {}}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              disabled={isLoading}
            >
              Login here
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}
