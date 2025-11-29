import { api } from "./api";
import type { Product, ProductStatus } from "../features/productsSlice";

interface CreateProductRequest {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status?: ProductStatus;
}

interface UpdateProductRequest {
  id: string;
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  category?: string;
  status?: ProductStatus;
}

interface UpdateStatusRequest {
  id: string;
  status: ProductStatus;
}

export const productApi = api.injectEndpoints({
  endpoints: (build) => ({
    createProduct: build.mutation<{ product: Product }, CreateProductRequest>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: build.mutation<{ product: Product }, UpdateProductRequest>({
      query: ({ id, ...body }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProductStatus: build.mutation<{ product: Product }, UpdateStatusRequest>(
      {
        query: ({ id, status }) => ({
          url: `/products/${id}/status`,
          method: "PATCH",
          body: { status },
        }),
        invalidatesTags: ["Product"],
      }
    ),

    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
} = productApi;
