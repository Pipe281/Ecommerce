import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-require-login-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './require-login-dialog.component.html',
  styleUrl: './require-login-dialog.component.scss',
})
export class RequireLoginDialogComponent {}
