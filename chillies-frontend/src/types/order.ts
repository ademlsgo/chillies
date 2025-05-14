export type OrderStatus = 'pending' | 'preparing' | 'served' | 'cancelled';

export interface OrderItem {
  cocktailId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
} 