"use client";

import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import { Skeleton } from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GetCategoryResponse,
  GetProductResponse,
  productApi,
} from "@/lib/apis/product-api";
import { useAuthStore } from "@/store/auth-store";
import requestAPI from "@/utils/request-api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  Lock,
  Package,
  Sparkles,
  Star,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CTASection from "./CTASection";
import FeaturedProducts from "./FeaturedProducts";
import FeaturesSection from "./FeaturesSection";
import StatsSection from "./StatsSection";

const mockProducts = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 299.99,
    image: "/placeholder.svg?height=120&width=120",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "/placeholder.svg?height=120&width=120",
    category: "Wearables",
  },
  {
    id: 3,
    name: "Wireless Speaker",
    price: 149.99,
    image: "/placeholder.svg?height=120&width=120",
    category: "Audio",
  },
  {
    id: 4,
    name: "Gaming Mouse",
    price: 79.99,
    image: "/placeholder.svg?height=120&width=120",
    category: "Gaming",
  },
];

export default function HomePage() {
  const [authMode, setAuthMode] = useState<"login" | "register">();

  const { isAuthenticated } = useAuthStore();

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
  };

  const handleAuthModalClose = () => setAuthMode(undefined);

  const {
    data: products,
    isLoading: isProductdataLoading,
    error,
  } = useQuery<GetProductResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      return await requestAPI(
        productApi.getProducts({
          page: 1,
          limit: 10,
        })
      );
    },
    enabled: isAuthenticated,
  });

  const { data: allProductCategory } = useQuery<GetCategoryResponse>({
    queryKey: ["product-category"],
    queryFn: async () => {
      return await requestAPI(
        productApi.getAllCategories({
          limit: 10,
          page: 1,
        })
      );
    },
    enabled: isAuthenticated,
  });

  const featuredProducts = products?.products?.slice(0, 4) ?? [];

  // Hero Section Product Display
  const renderHeroProducts = () => {
    if (!isAuthenticated) {
      return mockProducts.map((product) => (
        <LockedProductCard key={product.id} product={product} />
      ));
    }

    if (isProductdataLoading) {
      return [1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />);
    }

    if (error) {
      return (
        <div className="col-span-2 text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">
            Failed to load products
          </p>
        </div>
      );
    }

    if (featuredProducts.length === 0) {
      return (
        <div className="col-span-2 text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No products available
          </p>
        </div>
      );
    }

    return featuredProducts.map((product) => (
      <motion.div
        key={product._id}
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
      >
        <div className="aspect-square mb-3 rounded-xl overflow-hidden">
          <Image
            src={
              product.mainImage?.url || "/placeholder.svg?height=120&width=120"
            }
            alt={product.name}
            width={120}
            height={120}
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="font-semibold text-sm line-clamp-1 mb-1">
          {product.name}
        </h4>
        <p className="text-blue-600 font-bold text-lg">${product.price}</p>
        <div className="flex items-center mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-3 h-3 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-sm font-medium rounded-full shadow-lg">
                    <Sparkles className="h-4 w-4 mr-1" />
                    {isAuthenticated
                      ? "Welcome Back!"
                      : "New Collection Available"}
                  </Badge>
                </div>
                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Shop the
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Future
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                  {isAuthenticated
                    ? "Discover amazing products at unbeatable prices. Experience the next generation of online shopping with lightning-fast delivery and premium quality."
                    : "Join thousands of satisfied customers and unlock access to exclusive products, deals, and personalized recommendations."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Link href="/products">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 bg-transparent"
                    >
                      Explore Categories
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => openAuthModal("register")}
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Get Started Free
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 bg-transparent"
                      onClick={() => openAuthModal("login")}
                    >
                      <Eye className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white shadow-lg"
                      ></div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      10k+ Happy Customers
                    </p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                        4.9/5 Rating
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {isAuthenticated
                        ? "Featured Products"
                        : "Sample Products"}
                    </h3>
                    {!isAuthenticated && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Sign in to unlock
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {renderHeroProducts()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Products Section */}
      <FeaturedProducts
        isAuthenticated={isAuthenticated}
        allProductCategory={allProductCategory}
        error={error}
        featuredProducts={featuredProducts}
        isLoading={isProductdataLoading}
        onClickRegister={() => openAuthModal("register")}
        onClickSignIn={() => openAuthModal("login")}
      />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection
        isAuthenticated={isAuthenticated}
        onClickRegister={() => openAuthModal("register")}
        onClickSignIn={() => openAuthModal("login")}
      />
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
    </div>
  );
}

const ProductSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4">
    <Skeleton className="aspect-square mb-3 rounded-xl" />
    <Skeleton className="h-4 mb-2" />
    <Skeleton className="h-6 w-1/2 mb-1" />
    <div className="flex items-center mt-1 gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Skeleton key={star} className="w-3 h-3 rounded-full" />
      ))}
    </div>
  </div>
);

const LockedProductCard = ({
  product,
}: {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  };
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 relative overflow-hidden group"
  >
    <div className="aspect-square mb-3 rounded-xl overflow-hidden relative">
      <Image
        src={product.image}
        alt={product.name}
        width={120}
        height={120}
        className="w-full h-full object-cover filter blur-sm"
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-6 h-6 text-white mx-auto mb-1" />
          <p className="text-white text-xs font-medium">Sign in to view</p>
        </div>
      </div>
    </div>
    <h4 className="font-semibold text-sm line-clamp-1 mb-1 text-gray-500">
      {product.name}
    </h4>
    <p className="text-gray-400 font-bold text-lg">$***.**</p>
    <div className="flex items-center mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className="w-3 h-3 fill-gray-300 text-gray-300" />
      ))}
    </div>
  </motion.div>
);
