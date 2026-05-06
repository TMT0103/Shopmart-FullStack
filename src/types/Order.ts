export interface Order {
  id: number;
  orderDate: string;
  total: number;
  status: string;
  totalItems: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  items: {
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
      imageUrl: string;
    };
  }[];
}