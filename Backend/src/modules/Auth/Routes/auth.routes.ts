import { Router } from "express";
import {
    loginUsuario,
    crearUsuario,
    refreshToken,
    restablecerContrasena
} from "../Controller/auth.controller";

const authRoutes = Router();

// Endpoint para login
authRoutes.post("/login", loginUsuario);

// Endpoint para registro de usuario
authRoutes.post("/crear", crearUsuario);

// Endpoint para refrescar el token de acceso (requiere refresh_token en cookie httpOnly)
authRoutes.post("/refresh", refreshToken);

// Endpoint para restablecimiento de contraseña
authRoutes.post("/restablecer", restablecerContrasena);

export default authRoutes;
