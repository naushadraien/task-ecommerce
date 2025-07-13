"use client";

import LoginModal from "@/components/modals/LoginModal";
import LogoutModal from "@/components/modals/LogoutModal";
import RegisterModal from "@/components/modals/RegisterModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { LogOut, Moon, Package, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const [authMode, setAuthMode] = useState<"login" | "register" | "logout">();

  const openAuthModal = (mode: "login" | "register" | "logout") => {
    setAuthMode(mode);
  };

  const handleAuthModalClose = () => setAuthMode(undefined);

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold">
                ModernShop
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/products"
                  className="text-sm font-medium hover:text-primary"
                >
                  Products
                </Link>
                {isAuthenticated && user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link> */}

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      {user?.username}
                    </DropdownMenuItem>
                    {user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Package className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openAuthModal("logout")}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal("login")}
                  >
                    Login
                  </Button>
                  <Button onClick={() => openAuthModal("register")}>
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={authMode === "login"}
        onClose={handleAuthModalClose}
        onRegisterClick={() => openAuthModal("register")}
      />
      <RegisterModal
        isOpen={authMode === "register"}
        onClose={handleAuthModalClose}
        onLoginClick={() => openAuthModal("login")}
      />
      <LogoutModal
        isOpen={authMode === "logout"}
        onClose={handleAuthModalClose}
      />
    </>
  );
}
