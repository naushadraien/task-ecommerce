"use client";

import { useAuthStore } from "@/store/auth-store";
import { Home, ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { PageLoader } from "./Loader";
import { Button } from "./ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  fallbackPath = "/",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isChecking) return;

    if (!isAuthenticated) {
      router.replace(`/`);
      return;
    }

    if (adminOnly && user?.role !== "ADMIN") {
      router.replace(fallbackPath);
      return;
    }
  }, [isAuthenticated, user, adminOnly, router, fallbackPath, isChecking]);

  if (isChecking) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <PageLoader />;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-4 text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <ShieldX className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don&apos;t have permission to access this page. Admin privileges
            are required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push(fallbackPath)}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Go to Home</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <span>Go Back</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
