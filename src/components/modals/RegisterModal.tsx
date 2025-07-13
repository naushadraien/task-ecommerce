import { authApi, RegisterRequestPayload } from "@/lib/apis/auth-api";
import requestAPI from "@/utils/request-api";
import { showToast } from "@/utils/show-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Modal from "./Modal";

export type RegisterForm = z.infer<typeof registerSchema>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: VoidFunction;
};

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    role: z.enum(["USER", "ADMIN"]),
    email: z.email("Invalid email address"),
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
  onLoginClick,
}: Props) {
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "USER",
      username: "",
      confirmPassword: "",
      email: "",
      password: "",
    },
  });

  const { mutate: registerUser, isPending: isRegisteringUser } = useMutation({
    mutationFn: async (data: RegisterRequestPayload) => {
      return await requestAPI(authApi.registerUser(data));
    },
    onSuccess() {
      showToast(
        "Registered successfully.",
        {
          description: "Now you can login.",
        },
        "success"
      );
      registerForm.reset();
      onClose();
    },
  });

  const handleRegisterUser = async (data: {
    username: string;
    role: "USER" | "ADMIN";
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    delete data.confirmPassword;
    registerUser(data);
  };

  return (
    <Modal
      open={isOpen}
      title="Create Account"
      description="Join ModernShop and start shopping today"
      onOpenChange={onClose}
      isLoading={isRegisteringUser}
      showCloseButton={false}
      showConfirmButton={false}
      className="max-h-[90vh] overflow-y-auto scrollbar-hidden"
    >
      <Form {...registerForm}>
        <form
          className="space-y-4"
          onSubmit={registerForm.handleSubmit(handleRegisterUser)}
        >
          <FormField
            control={registerForm.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    id="register-username"
                    {...field}
                    placeholder="Enter your username"
                    disabled={isRegisteringUser}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={registerForm.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={registerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="register-email"
                    type="email"
                    {...field}
                    placeholder="Enter your email"
                    disabled={isRegisteringUser}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="register-password"
                    type="password"
                    {...field}
                    placeholder="Enter your password"
                    disabled={isRegisteringUser}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...field}
                    placeholder="Confirm your password"
                    disabled={isRegisteringUser}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            disabled={isRegisteringUser}
          >
            {isRegisteringUser ? (
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
                onClick={onLoginClick}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                disabled={isRegisteringUser}
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
