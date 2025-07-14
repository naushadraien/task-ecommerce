import { Skeleton } from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GetCategoryResponse, Product } from "@/lib/apis/product-api";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  Package,
  RefreshCw,
  Star,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  featuredProducts: Product[];
  allProductCategory?: GetCategoryResponse;
  onClickRegister?: VoidFunction;
  onClickSignIn?: VoidFunction;
};

export default function FeaturedProducts({
  isAuthenticated,
  isLoading,
  error,
  featuredProducts,
  allProductCategory,
  onClickRegister,
  onClickSignIn,
}: Props) {
  const getProductCategoryName = (categoryId: string) => {
    const foundCategory = allProductCategory?.categories.find(
      (item) => item._id === categoryId
    );
    return foundCategory ? foundCategory.name : "N/A";
  };

  const renderFeaturedProducts = () => {
    if (!isAuthenticated) {
      return (
        <SignUpPrompt
          onClickRegister={onClickRegister}
          onClickSignIn={onClickSignIn}
        />
      );
    }

    if (isLoading) {
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
        {!isLoading &&
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
  );
}

const SignUpPrompt = ({
  onClickRegister,
  onClickSignIn,
}: {
  onClickRegister?: VoidFunction;
  onClickSignIn?: VoidFunction;
}) => (
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
      <Button
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        onClick={onClickRegister}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Create Free Account
      </Button>
      <Button variant="outline" onClick={onClickSignIn}>
        <Eye className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    </div>
  </motion.div>
);

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
