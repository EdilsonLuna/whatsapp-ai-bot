import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../services/Auth/auth';
import { AppInitializerService } from '../core/services/app-initializer.service';

/**
 * Función ejecutada por provideAppInitializer al arrancar la app.
 * Si hay token válido, ejecuta la inicialización completa.
 * Angular espera a que la Promise se resuelva antes de renderizar.
 */
export function initializeApp(): Promise<void> | void {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) return;

  const auth = inject(Auth);
  const appInitializer = inject(AppInitializerService);

  const token = auth.getToken();
  if (token && !auth.isTokenExpired()) {
    return appInitializer.init(token).catch(() => {
      // Error ya manejado en AppInitializerService (state.setError).
      // El catch evita que el bootstrap falle; la app arranca mostrando login.
    });
  }
}
