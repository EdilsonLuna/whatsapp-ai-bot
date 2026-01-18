import pool from "../../config/db";
import { Settings, SettingsWithAnswerType, UpdateSettingsDTO, AnswerType } from "../../models/settings.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";

/**
 * Obtener la configuración actual del sistema con información del tipo de respuesta
 */
export const getSettings = async (): Promise<SettingsWithAnswerType | null> => {
    const [rows] = await pool.query<(SettingsWithAnswerType & RowDataPacket)[]>(
        `SELECT 
            s.id,
            s.company_name,
            s.system_prompt,
            s.answer_type_id,
            s.welcome_message,
            s.fallback_message,
            s.business_hours_enabled,
            s.business_hours_json,
            s.created_at,
            s.updated_at,
            at.type_name as answer_type_name,
            at.description as answer_type_description
        FROM settings s
        LEFT JOIN answer_type at ON s.answer_type_id = at.id
        LIMIT 1`
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Actualizar la configuración del sistema
 */
export const updateSettings = async (id: number, data: UpdateSettingsDTO): Promise<boolean> => {
    const fields: string[] = [];
    const values: any[] = [];

    // Construir dinámicamente los campos a actualizar
    if (data.company_name !== undefined) {
        fields.push('company_name = ?');
        values.push(data.company_name);
    }
    if (data.system_prompt !== undefined) {
        fields.push('system_prompt = ?');
        values.push(data.system_prompt);
    }
    if (data.answer_type_id !== undefined) {
        fields.push('answer_type_id = ?');
        values.push(data.answer_type_id);
    }
    if (data.welcome_message !== undefined) {
        fields.push('welcome_message = ?');
        values.push(data.welcome_message);
    }
    if (data.fallback_message !== undefined) {
        fields.push('fallback_message = ?');
        values.push(data.fallback_message);
    }
    if (data.business_hours_enabled !== undefined) {
        fields.push('business_hours_enabled = ?');
        values.push(data.business_hours_enabled);
    }
    if (data.business_hours_json !== undefined) {
        fields.push('business_hours_json = ?');
        values.push(data.business_hours_json);
    }

    // Si no hay campos para actualizar, retornar false
    if (fields.length === 0) {
        return false;
    }

    // Agregar el ID al final de los valores
    values.push(id);

    const query = `UPDATE settings SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await pool.query<ResultSetHeader>(query, values);
    
    return result.affectedRows > 0;
};

/**
 * Verificar si existe un tipo de respuesta
 */
export const answerTypeExists = async (answerTypeId: number): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM answer_type WHERE id = ?',
        [answerTypeId]
    );
    return rows.length > 0;
};

/**
 * Obtener todos los tipos de respuesta disponibles
 */
export const getAllAnswerTypes = async (): Promise<AnswerType[]> => {
    const [rows] = await pool.query<(AnswerType & RowDataPacket)[]>(
        `SELECT 
            id,
            type_name,
            description,
            created_at,
            updated_at
        FROM answer_type
        ORDER BY id ASC`
    );
    return rows;
};

/**
 * Crear configuración inicial (si no existe)
 */
export const createInitialSettings = async (data: {
    company_name: string;
    system_prompt: string;
    answer_type_id: number;
}): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO settings (company_name, system_prompt, answer_type_id)
         VALUES (?, ?, ?)`,
        [data.company_name, data.system_prompt, data.answer_type_id]
    );
    return result.insertId;
};
