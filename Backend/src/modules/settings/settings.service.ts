import { SettingsWithAnswerType, UpdateSettingsDTO, BusinessHours, AnswerType } from "../../models/settings.model";
import * as settingsRepository from "./settings.repository";

/**
 * Servicio para obtener la configuración del sistema
 */
export const obtenerConfiguracion = async (): Promise<SettingsWithAnswerType> => {
    try {
        const settings = await settingsRepository.getSettings();
        
        if (!settings) {
            throw new Error('No se encontró configuración en el sistema');
        }
        
        // Parsear business_hours_json si existe
        if (settings.business_hours_json) {
            try {
                const businessHours = JSON.parse(settings.business_hours_json);
                return {
                    ...settings,
                    business_hours_json: JSON.stringify(businessHours)
                };
            } catch (error) {
                console.error('Error al parsear business_hours_json:', error);
            }
        }
        
        return settings;
    } catch (error) {
        console.error('Error en obtenerConfiguracion:', error);
        throw error;
    }
};

/**
 * Servicio para actualizar la configuración del sistema
 */
export const actualizarConfiguracion = async (data: UpdateSettingsDTO): Promise<SettingsWithAnswerType> => {
    try {
        // Validar datos de entrada
        validarDatosActualizacion(data);
        
        // Si se envía answer_type_id, verificar que existe
        if (data.answer_type_id) {
            const answerTypeExists = await settingsRepository.answerTypeExists(data.answer_type_id);
            if (!answerTypeExists) {
                throw new Error('El tipo de respuesta especificado no existe');
            }
        }
        
        // Si se envía business_hours_json, validar que sea JSON válido
        if (data.business_hours_json !== undefined && data.business_hours_json !== null) {
            try {
                const businessHours = JSON.parse(data.business_hours_json);
                validarHorarioNegocio(businessHours);
                // Asegurar que se almacene como string
                data.business_hours_json = JSON.stringify(businessHours);
            } catch (error) {
                throw new Error('El formato de business_hours_json no es válido');
            }
        }
        
        // Obtener configuración actual
        const currentSettings = await settingsRepository.getSettings();
        if (!currentSettings) {
            throw new Error('No se encontró configuración para actualizar');
        }
        
        // Actualizar configuración
        const updated = await settingsRepository.updateSettings(currentSettings.id, data);
        
        if (!updated) {
            throw new Error('No se pudo actualizar la configuración');
        }
        
        // Retornar configuración actualizada
        const updatedSettings = await settingsRepository.getSettings();
        if (!updatedSettings) {
            throw new Error('Error al obtener la configuración actualizada');
        }
        
        return updatedSettings;
    } catch (error) {
        console.error('Error en actualizarConfiguracion:', error);
        throw error;
    }
};

/**
 * Servicio para obtener todos los tipos de respuesta disponibles
 */
export const obtenerTiposRespuesta = async (): Promise<AnswerType[]> => {
    try {
        const answerTypes = await settingsRepository.getAllAnswerTypes();
        return answerTypes;
    } catch (error) {
        console.error('Error en obtenerTiposRespuesta:', error);
        throw new Error('Error al obtener los tipos de respuesta');
    }
};

/**
 * Validar datos de actualización
 */
const validarDatosActualizacion = (data: UpdateSettingsDTO): void => {
    // Validar company_name
    if (data.company_name !== undefined) {
        if (typeof data.company_name !== 'string' || data.company_name.trim().length === 0) {
            throw new Error('El nombre de la empresa no puede estar vacío');
        }
        if (data.company_name.length > 120) {
            throw new Error('El nombre de la empresa no puede exceder 120 caracteres');
        }
    }
    
    // Validar system_prompt
    if (data.system_prompt !== undefined) {
        if (typeof data.system_prompt !== 'string' || data.system_prompt.trim().length === 0) {
            throw new Error('El system prompt no puede estar vacío');
        }
    }
    
    // Validar answer_type_id
    if (data.answer_type_id !== undefined) {
        if (!Number.isInteger(data.answer_type_id) || data.answer_type_id <= 0) {
            throw new Error('El ID del tipo de respuesta debe ser un número entero positivo');
        }
    }
    
    // Validar business_hours_enabled
    if (data.business_hours_enabled !== undefined) {
        if (typeof data.business_hours_enabled !== 'boolean') {
            throw new Error('El campo business_hours_enabled debe ser un booleano');
        }
    }
};

/**
 * Validar estructura de horario de negocio
 */
const validarHorarioNegocio = (businessHours: any): void => {
    if (typeof businessHours !== 'object' || businessHours === null) {
        throw new Error('El horario de negocio debe ser un objeto');
    }
    
    const diasValidos = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    
    for (const dia of Object.keys(businessHours)) {
        if (!diasValidos.includes(dia.toLowerCase())) {
            throw new Error(`Día inválido: ${dia}. Días válidos: ${diasValidos.join(', ')}`);
        }
        
        const horario = businessHours[dia];
        if (typeof horario !== 'object' || horario === null) {
            throw new Error(`El horario para ${dia} debe ser un objeto`);
        }
        
        if (typeof horario.enabled !== 'boolean') {
            throw new Error(`El campo 'enabled' para ${dia} debe ser un booleano`);
        }
        
        if (horario.enabled) {
            if (!horario.open || !formatoHora.test(horario.open)) {
                throw new Error(`Formato de hora de apertura inválido para ${dia}. Formato esperado: HH:MM`);
            }
            if (!horario.close || !formatoHora.test(horario.close)) {
                throw new Error(`Formato de hora de cierre inválido para ${dia}. Formato esperado: HH:MM`);
            }
        }
    }
};
