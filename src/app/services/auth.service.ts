import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginResponse } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL: string = environment.API_URL + '/auth';
  private userSubject = new BehaviorSubject<LoginResponse | null>(this.getUser());

  readonly user$ = this.userSubject.asObservable();
  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      email,
      password,
    });
  }

  setUser(user: LoginResponse): void {
    sessionStorage.setItem('usuario', JSON.stringify(user));

    this.userSubject.next(user);
  }

  getUser(): LoginResponse | null {
    const user = sessionStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout(): void {
    sessionStorage.removeItem('usuario');
    this.userSubject.next(null);
  }
}
