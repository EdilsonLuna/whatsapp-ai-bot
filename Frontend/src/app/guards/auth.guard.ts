import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../services/Auth/auth';
import { AppInitializerService } from '../core/services/app-initializer.service';
import { catchError, switchMap, map, of, from } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const appInitializer = inject(AppInitializerService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = auth.getToken();
  const esRutaPublica = state.url === '/' || state.url === '/login';

  // No existe token
  if (!token) {
    return esRutaPublica ? true : router.createUrlTree(['/login']);
  }

  // Token vigente
  if (!auth.isTokenExpired()) {
    return esRutaPublica ? router.createUrlTree(['/dashboard']) : true;
  }

  // Token expirado → intentar refresh → reinicializar app
  return auth.refreshToken().pipe(
    switchMap((data) => from(appInitializer.init(data.access_token))),
    map(() => esRutaPublica ? router.createUrlTree(['/dashboard']) : true),
    catchError(() => {
      appInitializer.reset();
      return of(esRutaPublica ? true : router.createUrlTree(['/login']));
    })
  );
};
