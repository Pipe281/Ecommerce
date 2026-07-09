import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../interfaces/login';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  mensaje = '';
  hidePassword = true;
  form!: FormGroup;
  loading = false;

  @Output() loginSuccess = new EventEmitter<LoginResponse>();
  @Input() esModal = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required],
    });
  }
  get emailControl() {
    return this.form.controls['email'];
  }

  get passwordControl() {
    return this.form.controls['password'];
  }
  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.mensaje = '';

    const { email, password } = this.form.getRawValue();

    this.loading = true;

    this.authService
      .login(email, password)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (response) => {
          this.authService.setUser(response);

          this.loginSuccess.emit(response);

          if (!this.esModal) {
            this.router.navigate(['/']);
          }
        },

        error: () => {
          this.mensaje = 'Usuario o contraseña incorrectos';
        },
      });
  }
}
