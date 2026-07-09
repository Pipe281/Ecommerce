import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '../../services/dialog.service';
import { AuthService } from '../../services/auth.service';
import { LoginResponse } from '../../interfaces/login';
import {
  ROUTE_CARRITO,
  ROUTE_LOGIN,
  ROUTE_PRODUCTOS,
  ROUTE_ACERCADE,
} from '../../constants/routes.constant';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  usuario: LoginResponse | null = null;
  itemsCount: number = 0;
  protected readonly ROUTE_PRODUCTOS = ROUTE_PRODUCTOS;
  protected readonly ROUTE_ACERCADE = ROUTE_ACERCADE;
  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly dialogService: DialogService,
  ) {}
  ngOnInit(): void {
    this.authService.user$.subscribe((usuario) => {
      this.usuario = usuario;

      if (!usuario) {
        return;
      }

      this.cartService.getCartById(usuario.cartId).subscribe({
        next: (carrito) => {
          this.cartService.setItemsCount(carrito.totals.itemsCount);
        },
      });
    });

    this.cartService.itemsCount$.subscribe((count) => {
      this.itemsCount = count;
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate([ROUTE_LOGIN]);
  }

  abrirLogin(): void {
    this.dialogService.openLogin().subscribe((usuario) => {
      if (!usuario) {
        return;
      }
      this.usuario = usuario;
    });
  }
  abrirCarrito(): void {
    if (this.usuario) {
      this.router.navigate([ROUTE_CARRITO]);
      return;
    }
    this.dialogService.requireLogin().subscribe((usuario) => {
      if (!usuario) {
        return;
      }
      this.usuario = usuario;
      this.router.navigate([ROUTE_CARRITO]);
    });
  }
}
