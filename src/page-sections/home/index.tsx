"use client";

import { Skeleton } from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GetCategoryResponse,
  GetProductResponse,
  productApi,
} from "@/lib/apis/product-api";
import { useAuthStore } from "@/store/auth-store";
import requestAPI from "@/utils/request-api";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  Clock,
  Gift,
  Heart,
  Package,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  Users,
  Zap,
  AlertCircle,
  UserPlus,
  RefreshCw,
  Eye,
  Lock,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  // Only fetch products if user is authenticated
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
    enabled: isAuthenticated, // Only run query if user is authenticated
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
    enabled: isAuthenticated, // Only run query if user is authenticated
  });

  const getProductCategoryName = (categoryId: string) => {
    const foundCategory = allProductCategory?.categories.find(
      (item) => item._id === categoryId
    );
    return foundCategory ? foundCategory.name : "N/A";
  };

  const featuredProducts = products?.products?.slice(0, 4) ?? [];

  // Mock product data for unauthenticated users (for display purposes only)
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

  // Loading State Component
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

  // Locked Product Component for unauthenticated users
  const LockedProductCard = ({ product }: { product: any }) => (
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

  // No Products State Component (for authenticated users)
  const NoProductsState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full text-center py-16"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <Package className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        No Products Available
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        We&apos;re currently updating our inventory. Please check back soon for
        exciting new products!
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh Page
      </Button>
    </motion.div>
  );

  // Error State Component
  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full text-center py-16"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-red-600 mb-2">
        Unable to Load Products
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        We&apos;re having trouble loading our products. Please try again in a
        moment.
      </p>
      <Button
        onClick={() => window.location.reload()}
        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </motion.div>
  );

  // Sign Up Prompt Component for unauthenticated users
  const SignUpPrompt = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
        <UserPlus className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Unlock Our Full Catalog
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Sign up now to browse thousands of products, exclusive deals, and
        personalized recommendations!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Create Free Account
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </div>
    </motion.div>
  );

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

  // Featured Products Section Display
  const renderFeaturedProducts = () => {
    if (!isAuthenticated) {
      return <SignUpPrompt />;
    }

    if (isProductdataLoading) {
      return [1, 2, 3, 4].map((i) => (
        <Card
          key={i}
          className="overflow-hidden bg-white dark:bg-gray-700 border-0"
        >
          <Skeleton className="aspect-square" />
          <CardContent className="p-6">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Skeleton key={star} className="w-4 h-4 rounded-full" />
              ))}
              <Skeleton className="w-8 h-4 ml-1" />
            </div>
            <Skeleton className="h-6 mb-2" />
            <Skeleton className="h-4 mb-4" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </CardContent>
        </Card>
      ));
    }

    if (error) {
      return <ErrorState />;
    }

    if (featuredProducts.length === 0) {
      return <NoProductsState />;
    }

    return featuredProducts.map((product) => (
      <Card
        key={product._id}
        className="overflow-hidden hover:shadow-2xl transition-all duration-500 group bg-white dark:bg-gray-700 border-0 hover:-translate-y-2"
      >
        <div className="aspect-square overflow-hidden relative">
          <Image
            src={
              product.mainImage?.url || "/placeholder.svg?height=300&width=300"
            }
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Badge className="bg-red-500 text-white shadow-lg">Hot</Badge>
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-gray-800 shadow-lg">
              {getProductCategoryName(product.category)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              (4.8)
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              20% OFF
            </Badge>
          </div>
          <Link href={`/products/${product._id}`}>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
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
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Get Started Free
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 bg-transparent"
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
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Why Choose ModernShop?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the difference with our premium features and
              exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingBag,
                title: "Premium Quality",
                description:
                  "Carefully curated selection of high-quality products from trusted brands worldwide.",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50 dark:bg-blue-900/20",
              },
              {
                icon: Shield,
                title: "Secure Shopping",
                description:
                  "Your data is protected with industry-standard security measures and encryption.",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50 dark:bg-green-900/20",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description:
                  "Lightning-fast shipping with real-time tracking to get your orders quickly.",
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-50 dark:bg-purple-900/20",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`h-full hover:shadow-2xl transition-all duration-500 border-0 ${feature.bgColor} hover:-translate-y-2 group`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {isAuthenticated
                ? "Featured Products"
                : "Unlock Our Product Catalog"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {isAuthenticated
                ? "Discover our most popular items loved by thousands of customers"
                : "Sign up to access thousands of products with exclusive deals and offers"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {renderFeaturedProducts()}
          </div>

          {/* Only show "View All Products" button when there are products and user is authenticated */}
          {!isProductdataLoading &&
            !error &&
            isAuthenticated &&
            featuredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Link href="/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg font-semibold rounded-2xl bg-transparent border-2 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
                  >
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, number: "10K+", label: "Happy Customers" },
              { icon: Award, number: "500+", label: "Products" },
              { icon: Clock, number: "24/7", label: "Support" },
              { icon: Truck, number: "99%", label: "On-Time Delivery" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4">
                <Zap className="h-8 w-8" />
                <Heart className="h-8 w-8" />
                <Gift className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {isAuthenticated
                ? "Ready to Start Shopping?"
                : "Ready to Join Us?"}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {isAuthenticated
                ? "Explore our full catalog and discover amazing deals every day"
                : "Join thousands of satisfied customers and unlock exclusive access to premium products"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Free Account
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-2xl bg-transparent border-2 transition-all duration-300"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </>
              ) : (
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Browse Products
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
