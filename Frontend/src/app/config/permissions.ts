/**
 * Constantes de permisos del sistema.
 * Deben coincidir con los permisos enviados desde el backend en el JWT.
 */
export const PERMISSIONS = {
  EMPENOS: {
    CREAR: 'READ_EMPENOS',
    CONSULTAR_LISTADO: 'READ_EMPENOS',
    CONSULTAR_DETALLADO: 'READ_EMPENOS',
    REGISTRAR_INTERESES: 'READ_EMPENOS',
    RETIRAR: 'READ_EMPENOS',
  },
  USUARIOS: {
    CONSULTAR: 'READ_EMPENOS',
    CREAR: 'READ_EMPENOS',
  },
  CLIENTES: {
    CONSULTAR: 'READ_EMPENOS',
    CREAR: 'READ_EMPENOS',
  },
  INFORMES: {
    CONSULTAR: 'READ_EMPENOS',
  },
} as const;
