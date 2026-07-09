import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../../components/login/login.component';
import { LoginResponse } from '../../interfaces/login';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LoginComponent,
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
  constructor(
    private dialogRef: MatDialogRef<LoginModalComponent>,
    private authService: AuthService,
    private cartService: CartService,
  ) {}

  loginSuccess(response: LoginResponse): void {
    // 🔐 guardar sesión
    if (response.cartId && response.id && response.username && response.email) {
      this.authService.setUser(response);
      this.cartService.getCartById(response.cartId).subscribe({
        next: (cart) => {
          this.cartService.setItemsCount(cart.totals.itemsCount);
          // cerrar modal y devolver usuario
          this.dialogRef.close(response);
        },
      });
    } else {
      console.error('Error: Respuesta de login incompleta', response);
    }
  }
}
