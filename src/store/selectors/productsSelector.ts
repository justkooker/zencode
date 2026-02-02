import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Product } from "../../types";

export const selectFilteredProducts = createSelector(
  (state: RootState) => state.products.items,
  (_: RootState, orderId: number | null) => orderId,
  (_: RootState, __: number | null, typeFilter: string) => typeFilter,
  (products, orderId, typeFilter) => {
    return products.filter((product: Product) => {
      if (orderId !== null && orderId !== product.order) return false;
      if (typeFilter === "all") return true;
      return product.type === typeFilter;
    });
  }
);
export const selectProducts = createSelector(
  (state: RootState) => state.products.items,
  (_: RootState, typeFilter: string) => typeFilter,
  (products, typeFilter) => {
    return products.filter((product: Product) => {
      if (typeFilter === "all") return true;
      return product.type === typeFilter;
    });
  }
);
