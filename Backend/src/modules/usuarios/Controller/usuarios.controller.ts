import { Request, Response } from "express";
import { UsuariosService } from "../Services/usuarios.service";

const usuariosService = new UsuariosService();

// Función para consultar usuario
export const consultarUsuario = async (request: Request, response: Response) => {
    try {
        let usuarioConsulta:string = String(request.query.usuario);
        const resultado = await usuariosService.consultarUsuario(usuarioConsulta);
        response.status(200).json({usuario: resultado});
    } catch (error: any) {
        response.status(500).json({ 
            error: "Error al consultar usuario", 
            mensaje: error.message || "Error interno del servidor" 
        });
    }
};
