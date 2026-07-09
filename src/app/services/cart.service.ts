import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Cart } from '../interfaces/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly API_URL = environment.API_URL + '/carts';
  private itemsCountSubject = new BehaviorSubject<number>(0);

  itemsCount$ = this.itemsCountSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  addItem(cartId: number, productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.API_URL}/${cartId}/items`, {
      productId,
      quantity,
    });
  }

  getCartById(cartId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.API_URL}/${cartId}`);
  }
  removeItem(cartId: number, productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.API_URL}/${cartId}/items/${productId}`);
  }
  decreaseItem(cartId: number, productId: number): Observable<Cart> {
    return this.http.patch<Cart>(`${this.API_URL}/${cartId}/items/${productId}/decrease`, {});
  }
  setItemsCount(count: number): void {
    this.itemsCountSubject.next(count);
  }
}
