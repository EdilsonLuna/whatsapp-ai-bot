import pool from "../../config/db";
import { 
  Conversation, 
  Message, 
  CreateConversationDTO, 
  CreateMessageDTO,
  UpdateConversationDTO
} from "../../models/chats.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// ============================================
// CONVERSACIONES
// ============================================

/**
 * Buscar conversación activa por número de teléfono
 */
export const findConversationByPhone = async (userPhone: string): Promise<Conversation | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, user_phone, started_at, last_message_at, is_active 
     FROM conversations 
     WHERE user_phone = ? AND is_active = 1
     LIMIT 1`,
    [userPhone]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as Conversation;
};

/**
 * Crear nueva conversación
 */
export const createConversation = async (data: CreateConversationDTO): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO conversations (user_phone, started_at, last_message_at, is_active) 
     VALUES (?, NOW(), NOW(), 1)`,
    [data.user_phone]
  );

  return result.insertId;
};

/**
 * Actualizar última actividad de conversación
 */
export const updateConversation = async (
  conversationId: number, 
  data: UpdateConversationDTO
): Promise<void> => {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.last_message_at) {
    updates.push('last_message_at = ?');
    values.push(data.last_message_at);
  }

  if (data.is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(data.is_active);
  }

  if (updates.length === 0) {
    return;
  }

  values.push(conversationId);

  await pool.query(
    `UPDATE conversations SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
};

// ============================================
// MENSAJES
// ============================================

/**
 * Crear nuevo mensaje
 */
export const createMessage = async (data: CreateMessageDTO): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO messages (conversation_id, sender, message, prompt_sent, created_at) 
     VALUES (?, ?, ?, ?, NOW())`,
    [data.conversation_id, data.sender, data.message, data.prompt_sent || null]
  );

  return result.insertId;
};

/**
 * Obtener mensajes de una conversación
 */
export const getMessagesByConversation = async (conversationId: number): Promise<Message[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, conversation_id, sender, message, prompt_sent, created_at 
     FROM messages 
     WHERE conversation_id = ? 
     ORDER BY created_at ASC`,
    [conversationId]
  );

  return rows as Message[];
};

/**
 * Obtener últimos N mensajes de una conversación
 */
export const getLastMessages = async (conversationId: number, limit: number = 10): Promise<Message[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, conversation_id, sender, message, prompt_sent, created_at 
     FROM messages 
     WHERE conversation_id = ? 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [conversationId, limit]
  );

  // Invertir orden para tener mensajes cronológicamente
  return (rows as Message[]).reverse();
};
