export interface iCrearUsuario {
    usuario_crea_fk:number,
    usuario_modifica_fk:number,
    usuario:string,
    primer_nombre:string,
    segundo_nombre:string | null,
    primer_apellido:string, 
    segundo_apellido:string | null,
    numero_identificacion:string, 
    email:string,
    contrasena:string,
}

export interface iLogin{
    usuario:string,
    contrasena:string
}

export interface iUsuario {
    usuario:string;
    fecha_crea: Date;
    fecha_modifica: Date;
    primer_nombre: string;
    segundo_nombre: string | null;
    primer_apellido: string;
    segundo_apellido: string | null;
    numero_identificacion: string;
    email: string | null;
    contrasena: string;
    activo: boolean;
    id: number;
    usuario_crea_fk: number;
    usuario_modifica_fk: number;
}