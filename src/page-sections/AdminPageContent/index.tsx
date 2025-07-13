"use client";
import { ButtonLoader, ProductLoader } from "@/components/Loader";
import Modal from "@/components/modals/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UploadImage from "@/components/UplaodImage";
import {
  AddCategoryPayload,
  GetCategoryResponse,
  GetProductResponse,
  productApi,
} from "@/lib/apis/product-api";
import requestAPI from "@/utils/request-api";
import { showToast } from "@/utils/show-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FolderPlus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().min(0, "Stock must be positive"),
  category: z.string().min(1, "Category is required"),
  productImage: z.any().optional(),
});

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type ProductForm = z.infer<typeof productSchema>;
type CategoryForm = z.infer<typeof categorySchema>;

export default function AdminPageContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const addProductForm = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      productImage: undefined,
      stock: 0,
    },
  });

  const addCategoryForm = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const openCategoryDialog = () => {
    setIsCategoryDialogOpen(true);
  };

  const { mutate: addCategory, isPending: isCategoryAdding } = useMutation({
    mutationFn: async (data: AddCategoryPayload) => {
      return await requestAPI(productApi.createProductCategory(data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-category"] });
      showToast("Category created successfully!", undefined, "success");
      setIsCategoryDialogOpen(false);
      addCategoryForm.reset();
    },
  });

  const { mutate: addProduct, isPending: isAddingProduct } = useMutation({
    mutationFn: async (data: FormData) => {
      return await requestAPI(productApi.addProduct(data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Product added successfully!", undefined, "success");
      setIsDialogOpen(false);
      addProductForm.reset();
    },
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (productId: string) => {
      return await requestAPI(productApi.deleteProduct(productId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast("Product Deleted successfully!", undefined, "success");
      setIsDialogOpen(false);
      addProductForm.reset();
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

  const { data: allProducts, isLoading: isProductDataLoading } =
    useQuery<GetProductResponse>({
      queryKey: ["products"],
      queryFn: async () => {
        return await requestAPI(productApi.getProducts());
      },
    });

  const onCategorySubmit = (data: CategoryForm) => {
    addCategory(data);
  };

  const onSubmit = (data: ProductForm) => {
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("mainImage", data.productImage);
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    addProduct(formData);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  const getProductCategoryName = (categoryId: string) => {
    const foundCategory = allProductCategory?.categories.find(
      (item) => item._id === categoryId
    );
    return foundCategory ? foundCategory.name : "N/A";
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your products ({allProducts?.totalProducts} total)
          </p>
        </div>
        <div className="flex gap-3">
          {/* Add Category Modal */}
          <Modal
            trigger={
              <Button
                onClick={openCategoryDialog}
                variant="outline"
                className="border-green-200 hover:bg-green-50 hover:border-green-300"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            }
            open={isCategoryDialogOpen}
            title="Add New Category"
            onOpenChange={setIsCategoryDialogOpen}
            className="max-w-md"
            showCloseButton={false}
            showConfirmButton={false}
          >
            <Form {...addCategoryForm}>
              <form
                onSubmit={addCategoryForm.handleSubmit(onCategorySubmit)}
                className="space-y-4"
              >
                <FormField
                  control={addCategoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Electronics, Clothing, Books"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCategoryDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCategoryAdding}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isCategoryAdding ? (
                      <ButtonLoader text="Creating..." />
                    ) : (
                      "Create Category"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Modal>

          {/* Add Product Modal */}
          <Modal
            trigger={
              <Button
                onClick={openDialog}
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            }
            open={isDialogOpen}
            title="Add New Product"
            onOpenChange={setIsDialogOpen}
            className="max-h-[90vh] overflow-y-auto scrollbar-hidden"
            showCloseButton={false}
            showConfirmButton={false}
          >
            <Form {...addProductForm}>
              <form
                onSubmit={addProductForm.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={addProductForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          id="product-name"
                          {...field}
                          placeholder="Enter Product Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProductForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="product-description"
                          {...field}
                          placeholder="Enter Product description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="product-price"
                      type="number"
                      {...addProductForm.register("price", {
                        valueAsNumber: true,
                      })}
                    />
                    {addProductForm.formState.errors.price && (
                      <p className="text-sm text-destructive">
                        {addProductForm.formState.errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      {...addProductForm.register("stock", {
                        valueAsNumber: true,
                      })}
                    />
                    {addProductForm.formState.errors.stock && (
                      <p className="text-sm text-destructive">
                        {addProductForm.formState.errors.stock.message}
                      </p>
                    )}
                  </div>
                </div>

                <FormField
                  control={addProductForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allProductCategory?.categories?.map((item) => (
                            <SelectItem value={item._id} key={item._id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addProductForm.control}
                  name="productImage"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <UploadImage
                          onUpload={(files) => {
                            if (files && files.length > 0) {
                              field.onChange(files[0]);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          maxFiles={1}
                          accept={["image/jpeg", "image/png"]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAddingProduct}
                >
                  {isAddingProduct ? (
                    <ButtonLoader text={"Adding Product..."} />
                  ) : (
                    <span>Create Product</span>
                  )}
                </Button>
              </form>
            </Form>
          </Modal>
        </div>
      </div>

      {isProductDataLoading ? (
        <ProductLoader />
      ) : allProducts?.totalProducts === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Custom Empty Box Illustration */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl transform rotate-12"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
                <div className="text-4xl">📦</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your product catalog is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                Add products to start selling. You can manage inventory, set
                prices, and organize everything from this dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={openDialog}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Your First Product
              </Button>

              <Button
                onClick={openCategoryDialog}
                variant="outline"
                size="lg"
                className="border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FolderPlus className="mr-2 h-5 w-5" />
                Create Categories
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-sm">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Add products with images, pricing, and descriptions
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <FolderPlus className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Organize products into categories
                </p>
              </div>
            </div>
          </motion.div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allProducts?.products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 relative overflow-hidden rounded-lg">
                      <Image
                        src={
                          product.mainImage?.url ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={isDeleting}
                              onClick={() => handleDelete(product._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold text-lg text-blue-600">
                          ${product.price}
                        </span>
                        <Badge variant="secondary">
                          {getProductCategoryName(product.category)}
                        </Badge>
                        <span className="text-muted-foreground">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
