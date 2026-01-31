import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Product } from "../../types";

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  filterType: string;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  filterType: "all",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (product) => product.id !== action.payload,
      );
    },
    setFilterType: (state, action: PayloadAction<string>) => {
      state.filterType = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setFilterType,
  deleteProduct,
  setLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
