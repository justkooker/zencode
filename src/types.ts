export interface Product {
  id: number;
  serialNumber: number;
  isNew: number;
  photo: string;
  title: string;
  type: string;
  userId: number | null;
  status: number;
  specification: string;
  guarantee: {
    start: string;
    end: string;
  };
  price: {
    value: number;
    symbol: string;
    isDefault: number;
  }[];
  order: number;
  date: string;
}
export interface Order {
  id: number;
  title: string;
  date: string;
  description: string;
  products: Product[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}
export interface ProductPrice {
  value: number;
  symbol: string;
  isDefault: number;
}
