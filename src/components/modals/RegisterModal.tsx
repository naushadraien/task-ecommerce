import { zodResolver } from "@hookform/resolvers/zod";
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
  onRegister,
  isLoading,
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

  return (
    <Modal
      open={isOpen}
      title="Create Account"
      description="Join ModernShop and start shopping today"
      onOpenChange={onClose}
      isLoading={isLoading}
      showCloseButton={false}
      showConfirmButton={false}
      className="max-h-[90vh] overflow-y-auto scrollbar-hide self-center"
    >
      <Form {...registerForm}>
        <form
          className="space-y-4"
          onSubmit={registerForm.handleSubmit(onRegister)}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
      </Form>
    </Modal>
  );
}
