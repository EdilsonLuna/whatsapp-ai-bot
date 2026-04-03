/** Representa un ítem de navegación del menú lateral. */
export interface NavItem {
  /** Nombre visible del módulo en el menú. */
  module_name: string;

  /** Nombre del ícono de Material Icons. */
  icon: string;

  /**
   * Ruta relativa de navegación (ej. '/inicio').
   * Solo aplica cuando el ítem NO tiene hijos.
   */
  route?: string;

  /**
   * Permiso requerido para ver este ítem (ej. 'empenos:crear').
   * Si no se define, el ítem es visible para todos los usuarios autenticados.
   */
  permission?: string;

  /**
   * Lista de sub-módulos hijos.
   * Si está presente, el ítem actúa como grupo expandible
   * y la propiedad `route` es ignorada.
   */
  children?: NavItem[];
}
