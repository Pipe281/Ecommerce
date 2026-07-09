export interface CartItem {
  productId: number;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartTotals {
  itemsCount: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  status: 'OPEN' | 'CHECKED_OUT';
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  totals: CartTotals;
}
