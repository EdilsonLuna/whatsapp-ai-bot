import { Router } from "express";
import { 
    obtenerConfiguracion,
    actualizarConfiguracion,
    obtenerTiposRespuesta 
} from "../Controller/settings.controller";

const settingsRoutes = Router();

// Endpoint para obtener la configuración del sistema
settingsRoutes.get('/', obtenerConfiguracion);

// Endpoint para actualizar la configuración del sistema
settingsRoutes.put('/', actualizarConfiguracion);

// Endpoint para obtener todos los tipos de respuesta disponibles
settingsRoutes.get('/answer-types', obtenerTiposRespuesta);

export default settingsRoutes;
