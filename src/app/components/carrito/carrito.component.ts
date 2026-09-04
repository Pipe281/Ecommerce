import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../interfaces/cart';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss',
})
export class CarritoComponent implements OnInit {
  carrito?: Cart;
  mostrarToast: boolean = false;
  mensajeToast: string = '';

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }

    const usuario = JSON.parse(sessionStorage.getItem('usuario') ?? '{}');

    if (!usuario.cartId) {
      return;
    }

    this.cartService.getCartById(usuario.cartId).subscribe({
      next: (data) => {
        this.carrito = data;
      },
    });
  }
  eliminarProducto(productId: number): void {
    if (!this.carrito) {
      return;
    }

    this.cartService.removeItem(this.carrito.id, productId).subscribe({
      next: (data) => {
        this.carrito = data;
        this.cartService.setItemsCount(data.totals.itemsCount);
        this.showToast('Producto eliminado 🗑');
      },
    });
  }

  aumentarCantidad(productId: number): void {
    if (!this.carrito) {
      return;
    }

    this.cartService.addItem(this.carrito.id, productId, 1).subscribe({
      next: (data) => {
        this.carrito = data;
        this.cartService.setItemsCount(data.totals.itemsCount);
        this.showToast('Producto actualizado');
      },
    });
  }
  disminuirCantidad(productId: number): void {
    if (!this.carrito) {
      return;
    }

    this.cartService.decreaseItem(this.carrito.id, productId).subscribe({
      next: (data) => {
        this.carrito = data;
        this.cartService.setItemsCount(data.totals.itemsCount);
        this.showToast('Cantidad actualizada');
      },
    });
  }
  private showToast(message: string): void {
    this.mensajeToast = message;
    this.mostrarToast = true;

    setTimeout(() => {
      this.mostrarToast = false;
    }, 2000);
  }
}
