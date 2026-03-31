import { Request, Response } from "express";
import { sign, verify, SignOptions } from "jsonwebtoken";
import { UsuariosService } from "../../usuarios/Services/usuarios.service";
import { iTokensAcceso, payloadTokenUser } from "../Models/auth.model";
import { env } from "../../../config/env";

const usuariosService = new UsuariosService();

// Función para registrar un nuevo usuario
export const crearUsuario = async (request: Request, response: Response) => {
    try {
        const resultado = await usuariosService.crearUsuario(request.body);
        response.status(201).json(resultado);
    } catch (error: any) {
        response.status(500).json({
            error: "Error al crear usuario",
            mensaje: error.message || "Error interno del servidor"
        });
    }
};

// Función para login de usuario
export const loginUsuario = async (request: Request, response: Response) => {
    try {
        const ip =
            request.headers["x-forwarded-for"]?.toString().split(",")[0] ||
            request.socket.remoteAddress ||
            "unknown";

        const user_agent: string = request.headers["user-agent"]?.toString() || "unknown";

        const usuario: string | null = request.body.usuario;
        const contrasena: string | null = request.body.contrasena;

        if (usuario == null || contrasena == null) {
            response.status(400).json({ message: "Datos de inicio de sesión incorrectos."});
        } else {
            const resultado: iTokensAcceso = await usuariosService.loginUsuario(request.body, ip, user_agent);
            response
                .status(200)
                .cookie("refresh_token", resultado.refreshToken, {
                    httpOnly: true,
                    secure: env.ENVIRONMENT === "production",
                    sameSite: "strict"
                })
                .json({ access_token: resultado.accessToken });
        }
    } catch (error: any) {
        response.status(401).json({
            error: "Error al autenticar usuario",
            mensaje: error.message || "Credenciales inválidas"
        });
    }
};

// Función para refrescar el token de acceso usando el refresh token de la cookie
export const refreshToken = (request: Request, response: Response) => {
    const token: string | undefined = request.cookies?.refresh_token;

    if (!token) {
        return response.status(401).json({ message: "Refresh token no proporcionado." });
    }

    try {
        const payload = verify(token, env.FIRMA_REFRESH_TOKEN as string) as payloadTokenUser;

        const nuevoAccessToken = sign(
            {
                nombre_usuario: payload.nombre_usuario,
                identificacion: payload.identificacion,
                permisos: payload.permisos
            },
            env.FIRMA_ACCESS_TOKEN as string,
            { expiresIn: env.ACCESS_TOKEN_DURATION as SignOptions["expiresIn"] }
        );

        return response.status(200).json({ access_token: nuevoAccessToken });
    } catch (error: any) {
        return response.status(401).json({ message: "Refresh token inválido o expirado." });
    }
};

// Función para restablecer contraseña
export const restablecerContrasena = async (request: Request, response: Response) => {
    // TODO: implementar lógica de restablecimiento de contraseña
    response.status(501).json({ message: "Funcionalidad no implementada aún." });
};
