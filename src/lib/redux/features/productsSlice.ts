import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProductStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    upsertProduct(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx === -1) {
        state.items.unshift(action.payload);
      } else {
        state.items[idx] = action.payload;
      }
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    clearProducts(state) {
      state.items = [];
    },
  },
});

export const {
  setProducts,
  upsertProduct,
  removeProduct,
  clearProducts,
} = productsSlice.actions;

export const productsReducer = productsSlice.reducer;
