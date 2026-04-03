import { Injectable } from '@angular/core';
import { NavItem } from '../../models/nav-item.model';
import { PermissionService } from '../Permission/permission.service';
import { PERMISSIONS } from '../../config/permissions';

@Injectable({ providedIn: 'root' })
export class NavService {

  constructor(private permissionService: PermissionService) {}

  /**
   * Definición estática del árbol de módulos del sistema.
   * Para agregar o quitar entradas del menú, modifica este arreglo.
   * Los ítems con `children` se renderizan como grupos expandibles;
   * los ítems sin `children` navegan directamente a su `route`.
   */
  private readonly menuItems: NavItem[] = [
    {
      module_name: 'Inicio',
      icon: 'home',
      route: '/inicio',
    },
    {
      module_name: 'Empeños',
      icon: 'diamond',
      children: [
        { module_name: 'Nuevo Empeño',       icon: 'add',            route: '/nuevoEmpeno',    permission: PERMISSIONS.EMPENOS.CREAR },
        { module_name: 'Consultar Empeños',  icon: 'description',    route: '/consultaEmpeno', permission: PERMISSIONS.EMPENOS.CONSULTAR_LISTADO },
        { module_name: 'Retiros',            icon: 'delete_forever', route: '/buscarRetiro',   permission: PERMISSIONS.EMPENOS.RETIRAR },
      ],
    },
    {
      module_name: 'Clientes',
      icon: 'person',
      route: '/clientes',
      permission: PERMISSIONS.CLIENTES.CONSULTAR,
    },
    {
      module_name: 'Informes',
      icon: 'list_alt',
      route: '/informes',
      permission: PERMISSIONS.INFORMES.CONSULTAR,
    },
    {
      module_name: 'Ventas',
      icon: 'point_of_sale', // ícono representativo para ventas
      route: '/ventas',
      permission: PERMISSIONS.INFORMES.CONSULTAR,
    },
    {
      module_name: 'Usuarios',
      icon: 'group', // ícono representativo para usuarios
      route: '/usuarios',
      permission: PERMISSIONS.INFORMES.CONSULTAR,
    },
    {
      module_name: 'Configuración',
      icon: 'settings', // ícono representativo para configuración
      route: '/configuracion',
      permission: PERMISSIONS.INFORMES.CONSULTAR,
    },
  ];

  /**
   * Devuelve el árbol de módulos filtrado según los permisos del usuario.
   * - Ítems sin `permission` son visibles siempre.
   * - Ítems hoja con `permission` se muestran solo si el usuario lo tiene.
   * - Ítems padre con `children` se muestran solo si al menos un hijo es visible;
   *   los hijos sin permiso se ocultan.
   */
  getMenuItems(): NavItem[] {
    return this.filterByPermissions(this.menuItems);
  }

  private filterByPermissions(items: NavItem[]): NavItem[] {
    return items.reduce<NavItem[]>((acc, item) => {
      if (item.children) {
        const visibleChildren = this.filterByPermissions(item.children);
        if (visibleChildren.length > 0) {
          acc.push({ ...item, children: visibleChildren });
        }
      } else {
        if (!item.permission || this.permissionService.has(item.permission)) {
          acc.push(item);
        }
      }
      return acc;
    }, []);
  }
}
