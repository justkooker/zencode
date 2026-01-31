import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Order } from "../../types";

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
  activeOrderId: number | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
  activeOrderId: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.items.push(action.payload);
    },
    deleteOrder: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((order) => order.id !== action.payload);
    },
    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.items.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setActiveOrder: (state, action: PayloadAction<number | null>) => {
      state.activeOrderId = action.payload;
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
  setOrders,
  addOrder,
  deleteOrder,
  updateOrder,
  setLoading,
  setError,
  setActiveOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
