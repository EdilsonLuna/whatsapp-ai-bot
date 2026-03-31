import { 
  Conversation, 
  Message, 
  CreateConversationDTO, 
  CreateMessageDTO,
  UpdateConversationDTO
} from "../../../models/chats.model";
import { prismaClient } from "../../../prisma/prisma.client";
import { tipo_remitente } from "../../../generated/prisma";

const senderToPrisma: Record<string, tipo_remitente> = {
  user: "usuario",
  assistant: "asistente",
};

const senderFromPrisma: Record<tipo_remitente, "user" | "assistant"> = {
  usuario: "user",
  asistente: "assistant",
};

// ============================================
// CONVERSACIONES
// ============================================

/**
 * Buscar conversación activa por número de teléfono
 */
export const findConversationByPhone = async (userPhone: string): Promise<Conversation | null> => {
  const row = await prismaClient.conversaciones.findFirst({
    where: {
      telefono_usuario: userPhone,
      esta_activa: true,
    },
  });

  if (!row) return null;

  return {
    id: Number(row.id),
    user_phone: row.telefono_usuario,
    started_at: row.iniciado_en,
    last_message_at: row.ultimo_mensaje_en,
    is_active: row.esta_activa ?? true,
  };
};

/**
 * Crear nueva conversación
 */
export const createConversation = async (data: CreateConversationDTO): Promise<number> => {
  const row = await prismaClient.conversaciones.create({
    data: {
      telefono_usuario: data.user_phone,
    },
  });

  return Number(row.id);
};

/**
 * Actualizar última actividad de conversación
 */
export const updateConversation = async (
  conversationId: number, 
  data: UpdateConversationDTO
): Promise<void> => {
  const updateData: Record<string, any> = {};

  if (data.last_message_at) {
    updateData.ultimo_mensaje_en = data.last_message_at;
  }

  if (data.is_active !== undefined) {
    updateData.esta_activa = data.is_active;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  await prismaClient.conversaciones.update({
    where: { id: conversationId },
    data: updateData,
  });
};

// ============================================
// MENSAJES
// ============================================

/**
 * Crear nuevo mensaje
 */
export const createMessage = async (data: CreateMessageDTO): Promise<number> => {
  const row = await prismaClient.mensajes.create({
    data: {
      id_conversacion: data.conversation_id,
      remitente: senderToPrisma[data.sender],
      mensaje: data.message,
      prompt_enviado: data.prompt_sent ?? null,
    },
  });

  return Number(row.id);
};

/**
 * Obtener mensajes de una conversación
 */
export const getMessagesByConversation = async (conversationId: number): Promise<Message[]> => {
  const rows = await prismaClient.mensajes.findMany({
    where: { id_conversacion: conversationId },
    orderBy: { creado_en: "asc" },
  });

  return rows.map((r) => ({
    id: Number(r.id),
    conversation_id: Number(r.id_conversacion),
    sender: senderFromPrisma[r.remitente],
    message: r.mensaje,
    prompt_sent: r.prompt_enviado,
    created_at: r.creado_en,
  }));
};

/**
 * Obtener últimos N mensajes de una conversación
 */
export const getLastMessages = async (conversationId: number, limit: number = 10): Promise<Message[]> => {
  const rows = await prismaClient.mensajes.findMany({
    where: { id_conversacion: conversationId },
    orderBy: { creado_en: "desc" },
    take: limit,
  });

  // Invertir orden para tener mensajes cronológicamente
  return rows.reverse().map((r) => ({
    id: Number(r.id),
    conversation_id: Number(r.id_conversacion),
    sender: senderFromPrisma[r.remitente],
    message: r.mensaje,
    prompt_sent: r.prompt_enviado,
    created_at: r.creado_en,
  }));
};

/**
 * Obtener todas las conversaciones con su último mensaje
 */
export const getAllConversationsWithLastMessage = async (): Promise<any[]> => {
  const conversations = await prismaClient.conversaciones.findMany({
    orderBy: { ultimo_mensaje_en: "desc" },
    include: {
      mensajes: {
        orderBy: { creado_en: "desc" },
        take: 1,
      },
    },
  });

  return conversations.map((c) => {
    const lastMsg = c.mensajes[0] ?? null;
    return {
      id: Number(c.id),
      user_phone: c.telefono_usuario,
      started_at: c.iniciado_en,
      last_message_at: c.ultimo_mensaje_en,
      is_active: c.esta_activa,
      last_message_id: lastMsg ? Number(lastMsg.id) : null,
      last_message_sender: lastMsg ? senderFromPrisma[lastMsg.remitente] : null,
      last_message_text: lastMsg?.mensaje ?? null,
      last_message_created_at: lastMsg?.creado_en ?? null,
    };
  });
};
