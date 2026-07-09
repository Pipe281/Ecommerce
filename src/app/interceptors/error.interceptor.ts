import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('===== ERROR HTTP =====');
      console.log('URL:', req.url);
      console.log('Status:', error.status);
      console.log('Mensaje:', error.message);
      console.log('Error completo:', error);
      switch (error.status) {
        case 0:
          notification.error('No fue posible conectar con el servidor.');

          break;

        case 403:
          notification.error('No tienes permisos para realizar esta acción.');

          break;

        case 404:
          notification.error('El recurso solicitado no existe.');

          break;

        case 500:
          console.log('Error 500:', error);
          notification.error('Ocurrió un error interno del servidor.');

          break;

        default:
          notification.error('Ha ocurrido un error inesperado.');
      }

      return throwError(() => error);
    }),
  );
};
