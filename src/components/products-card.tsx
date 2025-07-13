"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GetCategoryResponse } from "@/lib/apis/product-api";
// import type { Product } from "@/lib/types";
// import { useCartStore } from "@/store/cart-store";
// import { useToast } from "@/components/toast-provider";

interface ProductCardProps {
  product: any;
  viewMode?: "grid" | "list";
  productCategories?: GetCategoryResponse["categories"];
}

export function ProductCard({
  product,
  viewMode = "grid",
  productCategories,
}: ProductCardProps) {
  // const { addItem } = useCartStore();
  // const { showToast } = useToast();

  const handleAddToCart = () => {
    // addItem(product);
    // showToast(`🛒 ${product.name} added to cart!`, "success");
  };

  const getProductCategoryName = (categoryId: string) => {
    const foundCategory = productCategories?.find(
      (item) => item._id === categoryId
    );
    return foundCategory ? foundCategory.name : "N/A";
  };

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-48 h-48 relative overflow-hidden">
              <Image
                src={product.mainImage?.url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-linear-to-r from-blue-500 to-purple-500 text-white border-0">
                  {getProductCategoryName(product.category)}
                </Badge>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        (4.8)
                      </span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full hover:bg-red-50 hover:text-red-500"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${(product.price * 1.2).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">
                    {product.stock > 10
                      ? "In Stock"
                      : `Only ${product.stock} left`}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href={`/products/${product._id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-2 hover:border-blue-500 bg-transparent"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden h-full hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 border-0 shadow-lg hover:-translate-y-2">
      <div className="aspect-square overflow-hidden relative">
        <Image
          src={product.mainImage?.url || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full shadow-lg backdrop-blur-xs bg-white/90 dark:bg-gray-800/90 border dark:border-gray-700"
          >
            <Heart className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </Button>
          <Link href={`/products/${product._id}`}>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg backdrop-blur-xs bg-white/90 dark:bg-gray-800/90 border dark:border-gray-700"
            >
              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </Button>
          </Link>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-linear-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
            {getProductCategoryName(product.category)}
          </Badge>
        </div>

        {/* Stock Badge */}
        {product.stock <= 5 && (
          <div className="absolute bottom-4 left-4">
            <Badge variant="destructive" className="shadow-lg">
              Only {product.stock} left!
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              (4.8)
            </span>
          </div>

          {/* Product Info */}
          <div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">
                ${product.price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              20% OFF
            </Badge>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
