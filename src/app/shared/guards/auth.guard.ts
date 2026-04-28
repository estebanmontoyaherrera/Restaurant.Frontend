import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.userToken;

  if (token) {
    return true;
  }

  router.navigate(['/login'], { replaceUrl: true });
  return false;
};
