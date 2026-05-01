import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../pages/auth/services/auth.service';
import { errorMessages } from '../utils/global-constants.util';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const errorConfig = errorMessages[err.status];


      if (errorConfig?.logout) {
        return from(
          Swal.fire({
            title: errorConfig.title,
            text: errorConfig.message,
            icon: 'warning',
            confirmButtonText: 'Ir al login',
            allowOutsideClick: false,
          })
        ).pipe(
          switchMap(() => {
            authService.logout();
            router.navigate(['/login'], { replaceUrl: true });
            return throwError(() => err);
          })
        );
      }


      if (err.status === 400 && err.error?.errors?.length) {
        const validationMessages = err.error.errors
          .map((e: any) => `• ${e.propertyName}: ${e.errorMessage}`)
          .join('\n');

        return from(
          Swal.fire('Errores de Validación', validationMessages, 'error')
        ).pipe(switchMap(() => throwError(() => err)));
      }


      return from(
        Swal.fire({
          title: 'Error Desconocido',
          text: 'Ha ocurrido un error inesperado.',
          icon: 'error',
          target: document.querySelector('.cdk-overlay-container') as HTMLElement
        })
      ).pipe(switchMap(() => throwError(() => err)));
    })
  );
};
