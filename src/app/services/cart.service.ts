import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Cart } from '../interfaces/cart';
import { supabase } from '../supabase/supabase.client';
import type { CartItemRow, CartRow, ProductRow } from '../types/database.helpers';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsCountSubject = new BehaviorSubject<number>(0);

  itemsCount$ = this.itemsCountSubject.asObservable();

  addItem(cartId: number, productId: number, quantity: number = 1): Observable<Cart> {
    return from(this.updateItem(cartId, productId, quantity));
  }

  getCartById(cartId: number): Observable<Cart> {
    return from(this.loadCart(cartId));
  }
  removeItem(cartId: number, productId: number): Observable<Cart> {
    return from(this.removeItemAndLoadCart(cartId, productId));
  }
  decreaseItem(cartId: number, productId: number): Observable<Cart> {
    return from(this.decreaseItemAndLoadCart(cartId, productId));
  }
  setItemsCount(count: number): void {
    this.itemsCountSubject.next(count);
  }

  private async updateItem(cartId: number, productId: number, amount: number): Promise<Cart> {
    const itemResult = await supabase.from('cart_items').select('quantity').eq('cart_id', cartId).eq('product_id', productId).maybeSingle();
    if (itemResult.error) throw itemResult.error;

    const productResult = await supabase.from('products').select('price').eq('id', productId).single();
    if (productResult.error) throw productResult.error;

    const quantity = (itemResult.data?.quantity ?? 0) + amount;
    const result = await supabase.from('cart_items').upsert({
      cart_id: cartId,
      product_id: productId,
      quantity,
      unit_price: productResult.data.price,
    }, { onConflict: 'cart_id,product_id' });
    if (result.error) throw result.error;
    return this.loadCart(cartId);
  }

  private async removeItemAndLoadCart(cartId: number, productId: number): Promise<Cart> {
    const result = await supabase.from('cart_items').delete().eq('cart_id', cartId).eq('product_id', productId);
    if (result.error) throw result.error;
    return this.loadCart(cartId);
  }

  private async decreaseItemAndLoadCart(cartId: number, productId: number): Promise<Cart> {
    const itemResult = await supabase.from('cart_items').select('quantity').eq('cart_id', cartId).eq('product_id', productId).single();
    if (itemResult.error) throw itemResult.error;

    if (itemResult.data.quantity <= 1) {
      return this.removeItemAndLoadCart(cartId, productId);
    }

    const result = await supabase.from('cart_items').update({ quantity: itemResult.data.quantity - 1 }).eq('cart_id', cartId).eq('product_id', productId);
    if (result.error) throw result.error;
    return this.loadCart(cartId);
  }

  private async loadCart(cartId: number): Promise<Cart> {
    const cartResult = await supabase.from('carts').select('*').eq('id', cartId).single();
    if (cartResult.error) throw cartResult.error;

    const itemsResult = await supabase.from('cart_items').select('*').eq('cart_id', cartId);
    if (itemsResult.error) throw itemsResult.error;

    const items = itemsResult.data as CartItemRow[];
    const productIds = items.map((item) => item.product_id);
    const productsResult = productIds.length
      ? await supabase.from('products').select('*').in('id', productIds)
      : { data: [], error: null };
    if (productsResult.error) throw productsResult.error;

    const products = new Map((productsResult.data as ProductRow[]).map((product) => [product.id, product]));
    const cart = cartResult.data as CartRow;
    const cartItems = items.map((item) => {
      const product = products.get(item.product_id);
      return {
        productId: item.product_id,
        title: product?.title ?? 'Producto',
        image: product?.image ?? '',
        unitPrice: item.unit_price,
        quantity: item.quantity,
        subtotal: item.unit_price * item.quantity,
      };
    });

    return {
      id: cart.id,
      status: cart.status as Cart['status'],
      createdAt: cart.created_at,
      updatedAt: cart.updated_at,
      items: cartItems,
      totals: {
        itemsCount: cartItems.reduce((total, item) => total + item.quantity, 0),
        subtotal: cartItems.reduce((total, item) => total + item.subtotal, 0),
      },
    };
  }
}
