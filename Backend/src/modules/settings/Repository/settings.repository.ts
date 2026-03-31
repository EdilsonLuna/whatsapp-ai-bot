import { prismaClient } from "../../../prisma/prisma.client";
import { Settings, SettingsWithAnswerType, UpdateSettingsDTO, AnswerType } from "../Models/settings.model";

/**
 * Obtener la configuración actual del sistema con información del tipo de respuesta
 */
export const getSettings = async (): Promise<SettingsWithAnswerType | null> => {
    const row = await prismaClient.configuraciones.findFirst({
        include: { tipo_respuesta: true },
    });

    if (!row) return null;

    return {
        id: Number(row.id),
        company_name: row.nombre_empresa,
        system_prompt: row.prompt_sistema,
        answer_type_id: Number(row.id_tipo_respuesta),
        welcome_message: row.mensaje_bienvenida,
        fallback_message: row.mensaje_fallback,
        business_hours_enabled: row.horario_habilitado,
        business_hours_json: row.horario_json ? JSON.stringify(row.horario_json) : null,
        created_at: row.creado_en,
        updated_at: row.actualizado_en,
        answer_type_name: row.tipo_respuesta.nombre_tipo,
        answer_type_description: row.tipo_respuesta.descripcion,
    };
};

/**
 * Actualizar la configuración del sistema
 */
export const updateSettings = async (id: number, data: UpdateSettingsDTO): Promise<boolean> => {
    const updateData: any = {};

    if (data.company_name !== undefined) updateData.nombre_empresa = data.company_name;
    if (data.system_prompt !== undefined) updateData.prompt_sistema = data.system_prompt;
    if (data.answer_type_id !== undefined) updateData.id_tipo_respuesta = data.answer_type_id;
    if (data.welcome_message !== undefined) updateData.mensaje_bienvenida = data.welcome_message;
    if (data.fallback_message !== undefined) updateData.mensaje_fallback = data.fallback_message;
    if (data.business_hours_enabled !== undefined) updateData.horario_habilitado = data.business_hours_enabled;
    if (data.business_hours_json !== undefined) updateData.horario_json = data.business_hours_json ? JSON.parse(data.business_hours_json) : null;

    if (Object.keys(updateData).length === 0) {
        return false;
    }

    updateData.actualizado_en = new Date();

    const result = await prismaClient.configuraciones.update({
        where: { id: BigInt(id) },
        data: updateData,
    });

    return !!result;
};

/**
 * Verificar si existe un tipo de respuesta
 */
export const answerTypeExists = async (answerTypeId: number): Promise<boolean> => {
    const row = await prismaClient.tipo_respuesta.findUnique({
        where: { id: BigInt(answerTypeId) },
    });
    return !!row;
};

/**
 * Obtener todos los tipos de respuesta disponibles
 */
export const getAllAnswerTypes = async (): Promise<AnswerType[]> => {
    const rows = await prismaClient.tipo_respuesta.findMany({
        orderBy: { id: 'asc' },
    });

    return rows.map((r) => ({
        id: Number(r.id),
        type_name: r.nombre_tipo,
        description: r.descripcion,
        created_at: r.creado_en,
        updated_at: r.actualizado_en,
    }));
};

/**
 * Crear configuración inicial (si no existe)
 */
export const createInitialSettings = async (data: {
    company_name: string;
    system_prompt: string;
    answer_type_id: number;
}): Promise<number> => {
    const result = await prismaClient.configuraciones.create({
        data: {
            nombre_empresa: data.company_name,
            prompt_sistema: data.system_prompt,
            id_tipo_respuesta: BigInt(data.answer_type_id),
        },
    });
    return Number(result.id);
};
