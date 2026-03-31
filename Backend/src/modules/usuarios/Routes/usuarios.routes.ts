import { Router } from "express";
import { consultarUsuario } from "../Controller/usuarios.controller";
import { checkPermission } from "../../../middlewares/permission.middleware";
import { PERMISSIONS } from "../../../config/permissions";

const usuariosRoutes = Router();

// Endpoint para consultar usuario
usuariosRoutes.get('/consultar', checkPermission(PERMISSIONS.USUARIOS.CONSULTAR), consultarUsuario);

export default usuariosRoutes;
