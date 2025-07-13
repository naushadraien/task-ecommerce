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
  onLogin: (data: LoginForm) => Promise<void>;
  isLoading?: boolean;
};

type LoginForm = z.infer<typeof loginSchema>;

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  isLoading,
}: Props) {
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <Modal
      open={isOpen}
      title="Welcome Back"
      description="Enter your credentials to access your account"
      onOpenChange={onClose}
      isLoading={isLoading}
      showCloseButton={false}
      showConfirmButton={false}
    >
      <form className="space-y-4" onSubmit={loginForm.handleSubmit(onLogin)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...loginForm.register("email")}
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {loginForm.formState.errors.email && (
            <p className="text-sm text-red-600">
              {loginForm.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...loginForm.register("password")}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {loginForm.formState.errors.password && (
            <p className="text-sm text-red-600">
              {loginForm.formState.errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </Button>
        <div className="mt-4 p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <h4 className="font-semibold mb-2 text-center text-sm">
            Demo Credentials:
          </h4>
          <div className="text-xs space-y-1">
            <p className="flex justify-between">
              <strong>Admin:</strong>
              <span className="text-blue-600">admin@demo.com / admin123</span>
            </p>
            <p className="flex justify-between">
              <strong>User:</strong>
              <span className="text-purple-600">user@demo.com / user123</span>
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?
            <button
              type="button"
              onClick={() => {}}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              disabled={isLoading}
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
}
