import { Injectable } from '@angular/core';
import { NavItem } from '../../models/nav-item.model';

@Injectable({ providedIn: 'root' })
export class NavService {

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
        { module_name: 'Nuevo Empeño',       icon: 'add',            route: '/nuevoEmpeno'    },
        { module_name: 'Consultar Empeños',  icon: 'description',    route: '/consultaEmpeno' },
        { module_name: 'Retiros',            icon: 'delete_forever', route: '/buscarRetiro'   },
      ],
    },
    {
      module_name: 'Clientes',
      icon: 'person',
      route: '/clientes',
    },
    {
      module_name: 'Informes',
      icon: 'list_alt',
      route: '/informes',
    },
  ];

  /** Devuelve el árbol completo de módulos de navegación. */
  getMenuItems(): NavItem[] {
    return this.menuItems;
  }
}
