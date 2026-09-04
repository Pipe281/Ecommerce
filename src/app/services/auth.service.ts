import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/login';
import { supabase } from '../supabase/supabase.client';
import type { ProfileRow } from '../types/database.helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userSubject = new BehaviorSubject<LoginResponse | null>(this.getUser());
  readonly user$ = this.userSubject.asObservable();

  login(email: string, password: string): Observable<LoginResponse> {
    return from(supabase.auth.signInWithPassword({ email, password })).pipe(
      switchMap(({ data, error }) => {
        if (error || !data.user) return throwError(() => error ?? new Error('No se pudo iniciar sesión'));
        return from(supabase.from('profiles').select('*').eq('id', data.user.id).single()).pipe(
          switchMap(({ data: profile, error: profileError }) => {
            if (profileError || !profile) return throwError(() => profileError ?? new Error('Perfil no encontrado'));
            return from(
              supabase
                .from('carts')
                .select('id')
                .eq('user_id', profile.id)
                .eq('status', 'OPEN')
                .maybeSingle(),
            ).pipe(
              switchMap(({ data: existingCart, error: cartError }) => {
                if (cartError) return throwError(() => cartError);

                if (existingCart) {
                  const user = profile as ProfileRow;
                  return from([{
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    cartId: existingCart.id,
                  }]);
                }

                return from(
                  supabase
                    .from('carts')
                    .insert({
                      user_id: profile.id,
                      status: 'OPEN',
                      legacy_user_id: null,
                    })
                    .select('id')
                    .single(),
                ).pipe(
                  switchMap(({ data: newCart, error: createCartError }) => {
                    if (createCartError || !newCart) {
                      return throwError(() => createCartError ?? new Error('No se pudo crear el carrito'));
                    }

                    const user = profile as ProfileRow;
                    return from([{
                      id: user.id,
                      username: user.username,
                      email: user.email,
                      cartId: newCart.id,
                    }]);
                  }),
                );
              }),
            );
          }),
        );
      }),
      tap((user) => this.setUser(user)),
    );
  }

  setUser(user: LoginResponse): void {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('usuario', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): LoginResponse | null {
    if (typeof sessionStorage === 'undefined') return null;
    const user = sessionStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout(): void {
    void supabase.auth.signOut();
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('usuario');
    this.userSubject.next(null);
  }
}
