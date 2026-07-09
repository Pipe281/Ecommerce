import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../shared/login-modal/login-modal.component';
import { RequireLoginDialogComponent } from '../shared/require-login-dialog/require-login-dialog.component';
import { Observable } from 'rxjs';
import { LoginResponse } from '../interfaces/login';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly dialog: MatDialog) {}

  requireLogin(): Observable<LoginResponse | null> {
    return new Observable((observer) => {
      const requireDialog = this.dialog.open(RequireLoginDialogComponent, {
        width: '400px',
      });

      requireDialog.afterClosed().subscribe((result) => {
        if (!result) {
          observer.next(null);
          observer.complete();
          return;
        }
        const loginDialog = this.dialog.open(LoginModalComponent, {
          width: '420px',
        });
        loginDialog.afterClosed().subscribe((user) => {
          observer.next(user);
          observer.complete();
        });
      });
    });
  }
  openLogin(): Observable<LoginResponse | null> {
    return new Observable((observer) => {
      const loginDialog = this.dialog.open(LoginModalComponent, {
        width: '420px',
      });

      loginDialog.afterClosed().subscribe((user) => {
        observer.next(user);
        observer.complete();
      });
    });
  }
}
