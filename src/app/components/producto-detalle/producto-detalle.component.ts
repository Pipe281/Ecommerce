import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/producto';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { DialogService } from '../../services/dialog.service';
import { ROUTE_PRODUCTOS } from '../../constants/routes.constant';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.scss',
})
export class ProductoDetalleComponent implements OnInit {
  producto?: Producto;
  cantidad: number = 1;
  mostrarAlerta: boolean = false;
  mensajeAlerta: string = '';
  tipoAlerta: string = 'success';
  protected readonly ROUTE_PRODUCTOS = ROUTE_PRODUCTOS;

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private cartService: CartService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productosService.obtenerProducto(id).subscribe((data) => {
      this.producto = data;
    });
  }

  agregarAlCarrito(): void {
    const usuario = JSON.parse(sessionStorage.getItem('usuario') ?? '{}');

    if (!usuario.cartId || !this.producto) {
      this.dialogService.requireLogin().subscribe((usuarioLogueado) => {
        if (!usuarioLogueado) {
          return;
        }

        this.agregarAlCarrito();
      });
      return;
    }

    this.cartService.addItem(usuario.cartId, this.producto.id, this.cantidad).subscribe({
      next: (response) => {
        this.mensajeAlerta = 'Producto agregado al carrito';
        this.tipoAlerta = 'success';
        this.mostrarAlerta = true;

        this.cartService.setItemsCount(response.totals.itemsCount);
        this.cantidad = 1;

        // ocultar automáticamente después de 3 segundos
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000);
      },
      error: (error) => {
        this.mensajeAlerta = 'Error al agregar producto';
        this.tipoAlerta = 'danger';
        this.mostrarAlerta = true;

        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000);
      },
    });
  }

  aumentarCantidad(): void {
    this.cantidad++;
  }

  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
}
