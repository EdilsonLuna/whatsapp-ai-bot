import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/Permission/permission.service';

/**
 * Guard que verifica permisos definidos en `data.permission` de la ruta.
 *
 * Uso en rutas:
 *   {
 *     path: 'nuevoEmpeno',
 *     loadComponent: () => import('./...').then(c => c.NuevoEmpeno),
 *     canActivate: [permissionGuard],
 *     data: { permission: 'empenos:crear' }
 *   }
 */
export const permissionGuard: CanActivateFn = (route) => {
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  const requiredPermission = route.data?.['permission'] as string | undefined;

  if (!requiredPermission) {
    return true;
  }

  if (permissionService.has(requiredPermission)) {
    return true;
  }

  return router.createUrlTree(['/dashboard/inicio']);
};
