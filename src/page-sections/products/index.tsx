"use client";

import { ProductLoader } from "@/components/Loader";
import { ProductCard } from "@/components/products-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  GetCategoryResponse,
  GetProductResponse,
  productApi,
} from "@/lib/apis/product-api";
import requestAPI from "@/utils/request-api";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid, List, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading: isProductDataLoading } =
    useQuery<GetProductResponse>({
      queryKey: ["products", page],
      queryFn: async () => {
        return await requestAPI(
          productApi.getProducts({
            page,
            limit: 10,
          })
        );
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

  const filteredProducts =
    products?.products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          !selectedCategory || product.category === selectedCategory;
        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      }) ?? [];

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 1000]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getProductCategoryName = (categoryId: string) => {
    const foundCategory = allProductCategory?.categories.find(
      (item) => item._id === categoryId
    );
    return foundCategory ? foundCategory.name : "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our curated collection of {filteredProducts.length} amazing
            products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search products, brands, categories..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-12 h-12 text-lg border-0 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium min-w-[160px]"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-lg"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-lg"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden rounded-xl"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:block ${
              showFilters ? "block" : "hidden"
            } w-full lg:w-80`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-600"
                >
                  Clear All
                </Button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Categories
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      !selectedCategory
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-2 border-blue-200 dark:border-blue-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">All Categories</span>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 dark:bg-gray-700"
                      >
                        {allProductCategory?.totalCategories ?? 0}
                      </Badge>
                    </div>
                  </button>
                  {allProductCategory?.categories.map((category) => {
                    const count = products?.products.filter(
                      (p) => p.category === category._id
                    ).length;
                    return (
                      <button
                        key={category._id}
                        onClick={() => {
                          setSelectedCategory(category._id);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                          selectedCategory === category._id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-2 border-blue-200 dark:border-blue-800"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.name}</span>
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 dark:bg-gray-700"
                          >
                            {count}
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Price Range
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      [0, 50],
                      [50, 100],
                      [100, 200],
                      [200, 500],
                    ].map(([min, max]) => (
                      <Button
                        key={`${min}-${max}`}
                        variant="outline"
                        size="sm"
                        onClick={() => setPriceRange([min, max])}
                        className="rounded-xl text-xs bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                      >
                        ${min}-${max}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory || searchTerm) && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    Active Filters
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-pointer"
                        onClick={() => setSelectedCategory(null)}
                      >
                        {getProductCategoryName(selectedCategory)} ×
                      </Badge>
                    )}
                    {searchTerm && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-pointer"
                        onClick={() => setSearchTerm("")}
                      >
                        &quot;{searchTerm}&quot; ×
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isProductDataLoading ? (
              <ProductLoader />
            ) : filteredProducts.length === 0 ? (
              <Card className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} className="rounded-xl">
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
                      : "space-y-4 mb-8"
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                      productCategories={allProductCategory?.categories ?? []}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {(products?.totalPages ?? 0) > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-xl"
                    >
                      Previous
                    </Button>
                    <div className="flex gap-2">
                      {Array.from(
                        { length: Math.min(5, products?.totalPages ?? 0) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              onClick={() => setCurrentPage(page)}
                              className="rounded-xl w-12 h-12"
                            >
                              {page}
                            </Button>
                          );
                        }
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPage(Math.min(products?.totalPages ?? 0, page + 1))
                      }
                      disabled={page === products?.totalPages}
                      className="rounded-xl"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
