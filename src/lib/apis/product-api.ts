import { ApiRequestConfig } from "@/utils/request-api";

type Pagination = {
  page?: number;
  limit?: number;
};

type ProductImage = {
  _id: string;
  localPath: string;
  url: string;
};

type Product = {
  __v: number;
  _id: string;
  category: string;
  createdAt: string;
  description: string;
  mainImage: ProductImage;
  name: string;
  owner: string;
  price: number;
  stock: number;
  subImages: ProductImage[];
  updatedAt: string;
};

type Category = {
  __v: number;
  _id: string;
  createdAt: string;
  name: string;
  owner: string;
  updatedAt: string;
};

type GetProductResponse = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number;
  page: number;
  prevPage: number;
  products: Product[];
  serialNumberStartFrom: number;
  totalPages: number;
  totalProducts: number;
};

type GetCategoryResponse = {
  categories: Category[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number;
  page: number;
  prevPage: number;
  serialNumberStartFrom: number;
  totalCategories: number;
  totalPages: number;
};

type AddCategoryPayload = {
  name: string;
};

type ProductApiConfig = {
  getProducts: (params?: Pagination) => ApiRequestConfig<void>;
  getSingleProduct: (productId: string) => ApiRequestConfig<void>;
  getAllCategories: (params?: Pagination) => ApiRequestConfig<void>;
  createProductCategory: (
    data: AddCategoryPayload
  ) => ApiRequestConfig<AddCategoryPayload>;
  addProduct: (data: FormData) => ApiRequestConfig<FormData>;
  deleteProduct: (productId: string) => ApiRequestConfig<void>;
};

export const productApi: ProductApiConfig = {
  getProducts: (params) => {
    return {
      url: "/ecommerce/products",
      method: "get",
      params,
    };
  },
  getSingleProduct: (productId) => {
    return {
      url: `/ecommerce/products/${productId}`,
      method: "get",
    };
  },
  getAllCategories: (params) => {
    return {
      url: "/ecommerce/categories",
      method: "get",
      params,
    };
  },
  createProductCategory: (data) => {
    return {
      url: "/ecommerce/categories",
      method: "post",
      data,
    };
  },
  addProduct: (data) => {
    return {
      url: "/ecommerce/products",
      method: "post",
      data,
    };
  },
  deleteProduct: (productId) => {
    return {
      url: `/ecommerce/products/${productId}`,
      method: "delete",
    };
  },
};

export type {
  GetCategoryResponse,
  GetProductResponse,
  Pagination,
  Product,
  AddCategoryPayload,
};
