import { Router } from "express";
import { 
    crearUsuario, 
    consultarUsuario, 
    loginUsuario 
} from "../Controller/usuarios.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const usuariosRoutes = Router();

// Endpoint para login
usuariosRoutes.post('/login', loginUsuario);

// Endpoint para crear usuario
usuariosRoutes.post('/crear', crearUsuario);

// Endpoint para consultar usuario
usuariosRoutes.get('/consultar', authMiddleware, consultarUsuario);

export default usuariosRoutes;
