import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
  router.navigate(['/dashboard']);
  return false;
};
