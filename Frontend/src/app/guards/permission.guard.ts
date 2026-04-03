import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/Permission/permission.service';
import { AlertaService } from '../services/Alerta/alerta';

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
  const alertaService = inject(AlertaService);

  const requiredPermission = route.data?.['permission'] as string | undefined;

  if (!requiredPermission) {
    return true;
  }

  if (permissionService.has(requiredPermission)) {
    return true;
  }

  alertaService.mostrar('No tienes permisos para acceder a este módulo.', 'warning');
  return router.createUrlTree(['/dashboard/inicio']);
};
