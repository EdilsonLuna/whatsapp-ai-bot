import { Directive, inject, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { PermissionService } from '../services/Permission/permission.service';

/**
 * Directiva estructural que muestra u oculta elementos del DOM
 * según el permiso del usuario.
 *
 * Uso:
 *   <button *checkPermission="'empenos:crear'">Crear Empeño</button>
 *   <button *checkPermission="PERMISSIONS.EMPENOS.CREAR">Crear Empeño</button>
 */
@Directive({
  selector: '[checkPermission]',
  standalone: true,
})
export class CheckPermissionDirective implements OnInit {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);

  @Input('checkPermission') permission!: string;

  private hasView = false;

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const hasPermission = this.permissionService.has(this.permission);

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
