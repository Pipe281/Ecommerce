import type { Database } from './database.types';

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type CartRow = Database['public']['Tables']['carts']['Row'];
export type CartItemRow = Database['public']['Tables']['cart_items']['Row'];
