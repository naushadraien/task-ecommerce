"use client";

import LoginModal from "@/components/modals/LoginModal";
import LogoutModal from "@/components/modals/LogoutModal";
import RegisterModal from "@/components/modals/RegisterModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogOut,
  Menu,
  Moon,
  Package,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [authMode, setAuthMode] = useState<"login" | "register" | "logout">();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const openAuthModal = (mode: "login" | "register" | "logout") => {
    setAuthMode(mode);
  };

  const handleAuthModalClose = () => setAuthMode(undefined);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-lg border-b"
            : "bg-background/95 backdrop-blur-sm border-b"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ModernShop
                </span>
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {isAuthenticated && user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium hover:text-primary transition-colors relative group"
                >
                  Admin
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 border-0">
                          {getTotalItems()}
                        </Badge>
                      </motion.div>
                    )}
                  </Button>
                </Link>
              </motion.div>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs">
                            {user?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-xl border-0 shadow-xl bg-white dark:bg-gray-800"
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-medium text-sm">{user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg m-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "ADMIN" && (
                      <DropdownMenuItem
                        asChild
                        className="rounded-lg m-1 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Link href="/admin">
                          <Package className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="mx-2" />
                    <DropdownMenuItem
                      onClick={() => openAuthModal("logout")}
                      className="rounded-lg m-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal("login")}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => openAuthModal("register")}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    Register
                  </Button>
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-background/95 backdrop-blur-sm"
            >
              <div className="px-4 py-6 space-y-4">
                <Link
                  href="/products"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                {isAuthenticated && user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                {!isAuthenticated && (
                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        openAuthModal("login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 rounded-full"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        openAuthModal("register");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-16"></div>

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
