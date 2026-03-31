import { Request, Response } from "express";
import * as settingsService from "../Services/settings.service";
import { UpdateSettingsDTO } from "../Models/settings.model";

/**
 * Controlador para obtener la configuración del sistema
 * GET /settings
 */
export const obtenerConfiguracion = async (req: Request, res: Response) => {
    try {
        const settings = await settingsService.obtenerConfiguracion();
        
        return res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error: any) {
        console.error('Error en obtenerConfiguracion:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener la configuración'
        });
    }
};

/**
 * Controlador para actualizar la configuración del sistema
 * PUT /settings
 */
export const actualizarConfiguracion = async (req: Request, res: Response) => {
    try {
        const updateData: UpdateSettingsDTO = req.body;
        
        // Validar que se envíe al menos un campo
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar al menos un campo para actualizar'
            });
        }
        
        const updatedSettings = await settingsService.actualizarConfiguracion(updateData);
        
        return res.status(200).json({
            success: true,
            message: 'Configuración actualizada correctamente',
            data: updatedSettings
        });
    } catch (error: any) {
        console.error('Error en actualizarConfiguracion:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Error al actualizar la configuración'
        });
    }
};

/**
 * Controlador para obtener todos los tipos de respuesta disponibles
 * GET /settings/answer-types
 */
export const obtenerTiposRespuesta = async (req: Request, res: Response) => {
    try {
        const answerTypes = await settingsService.obtenerTiposRespuesta();
        
        return res.status(200).json({
            success: true,
            data: answerTypes,
            total: answerTypes.length
        });
    } catch (error: any) {
        console.error('Error en obtenerTiposRespuesta:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener los tipos de respuesta'
        });
    }
};
