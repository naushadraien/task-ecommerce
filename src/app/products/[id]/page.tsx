"use client";

import { Skeleton } from "@/components/Skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GetCategoryResponse,
  Product,
  productApi,
} from "@/lib/apis/product-api";
import { useCartStore } from "@/store/cart-store";
import requestAPI from "@/utils/request-api";
import { showToast } from "@/utils/show-toast";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Share2, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="mb-6">
      <Skeleton className="h-10 w-40" />
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-24 mb-4" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 mb-4" />
        </div>

        <Card className="border-0 bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-24 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const { id } = use(params);

  const {
    data: singleProduct,
    isLoading: isProductLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["single-product", id],
    queryFn: async () => {
      return await requestAPI(productApi.getSingleProduct(id));
    },
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
  });

  const handleAddToCart = () => {
    if (!singleProduct) return;

    addItem(singleProduct, quantity);
    showToast(
      `🛒 ${quantity} x ${singleProduct.name} added to cart!`,
      undefined,
      "success"
    );
  };

  const getProductCategoryName = () => {
    const foundCategory = allProductCategory?.categories.find(
      (item) => item._id === singleProduct?.category
    );
    return foundCategory ? foundCategory.name : "N/A";
  };

  // Show loading skeleton while data is being fetched
  if (isProductLoading) {
    return <ProductDetailSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <div className="text-red-500 text-4xl">❌</div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Error Loading Product
          </h2>
          <p className="text-muted-foreground mb-6">
            Something went wrong while loading the product details.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Loader2 className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/products">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show not found state
  if (!singleProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <div className="text-gray-400 text-4xl">📦</div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/products">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/products">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square overflow-hidden rounded-2xl shadow-lg bg-gray-100 dark:bg-gray-800">
              <Image
                src={
                  singleProduct.mainImage?.url ||
                  "/placeholder.svg?height=600&width=600"
                }
                alt={singleProduct.name}
                width={600}
                height={600}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            {singleProduct.subImages && singleProduct.subImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {singleProduct.subImages.map((image, index) => (
                  <motion.div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:shadow-md transition-shadow bg-gray-100 dark:bg-gray-800"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={image.url || "/placeholder.svg?height=150&width=150"}
                      alt={`${singleProduct.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    {singleProduct.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {getProductCategoryName()}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${
                        singleProduct.stock > 0
                          ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200"
                          : "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200"
                      }`}
                    >
                      {singleProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full bg-transparent hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full bg-transparent hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <p className="text-3xl font-bold text-blue-600">
                  ${singleProduct.price.toFixed(2)}
                </p>
                {singleProduct.stock > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {singleProduct.stock} units available
                  </p>
                )}
              </div>
            </div>

            <Card className="border-0 bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-lg">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {singleProduct.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Category
                    </h4>
                    <p className="text-muted-foreground">
                      {getProductCategoryName()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Stock
                    </h4>
                    <p className="text-muted-foreground">
                      {singleProduct.stock} available
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Added
                    </h4>
                    <p className="text-muted-foreground">
                      {new Date(singleProduct.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      SKU
                    </h4>
                    <p className="text-muted-foreground">
                      {singleProduct._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setQuantity(Math.min(singleProduct.stock, quantity + 1))
                    }
                    disabled={quantity >= singleProduct.stock}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    +
                  </Button>
                </div>
              </div>
              <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  disabled={singleProduct.stock === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {singleProduct.stock === 0
                    ? "Out of Stock"
                    : `Add ${quantity} to Cart - $${(
                        singleProduct.price * quantity
                      ).toFixed(2)}`}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
