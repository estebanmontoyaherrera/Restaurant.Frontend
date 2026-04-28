import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../pages/auth/services/auth.service';

export const AuthInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.userToken}`,
    },
  });

  return next(authReq);
};
