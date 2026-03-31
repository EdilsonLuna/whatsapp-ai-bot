export interface iTokensAcceso{
    accessToken:string,
    refreshToken:string
}

export type iRolesPermisos = string[];

export interface iPermisosMap {
    [permisoCodigo: string]: { rol: number }[];
}

export interface payloadTokenUser {
    nombre_usuario:string,
    identificacion:string,
    permisos:iRolesPermisos | null
}