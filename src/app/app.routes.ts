import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { ProductosComponent } from './components/productos/productos.component';
import { AcerdaDeComponent } from './components/acerda-de/acerda-de.component';
import { LoginComponent } from './components/login/login.component';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: 'acercaDe', component: AcerdaDeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'carrito', component: CarritoComponent },
];
