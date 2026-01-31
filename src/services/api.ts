const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

// Products API
export const productsApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return response.json();
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error("Failed to fetch order");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete order");
    return response.json();
  },
};
