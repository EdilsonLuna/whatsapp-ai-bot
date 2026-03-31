/**
 * Constantes de permisos del sistema.
 * Deben coincidir con los permisos enviados desde el backend en el JWT.
 */
export const PERMISSIONS = {
  EMPENOS: {
    CREAR: 'empenos:crear',
    CONSULTAR_LISTADO: 'empenos:consultar_listado',
    CONSULTAR_DETALLADO: 'empenos:consultar_detallado',
    REGISTRAR_INTERESES: 'empenos:registrar_intereses',
    RETIRAR: 'empenos:retirar',
  },
  USUARIOS: {
    CONSULTAR: 'usuarios:consultar',
    CREAR: 'usuarios:crear',
  },
  CLIENTES: {
    CONSULTAR: 'clientes:consultar',
    CREAR: 'clientes:crear',
  },
  INFORMES: {
    CONSULTAR: 'informes:consultar',
  },
} as const;
