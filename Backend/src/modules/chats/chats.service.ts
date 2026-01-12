import * as chatsRepository from "./chats.repository";
import { 
  Conversation, 
  Message, 
  CreateMessageDTO 
} from "../../models/chats.model";

// ============================================
// LÓGICA DE NEGOCIO
// ============================================

/**
 * Obtener o crear conversación por número de teléfono
 * Si no existe una conversación activa, crea una nueva
 */
export const getOrCreateConversation = async (userPhone: string): Promise<Conversation> => {
  // Buscar conversación existente
  let conversation = await chatsRepository.findConversationByPhone(userPhone);

  // Si no existe, crear una nueva
  if (!conversation) {
    console.log(`No existe conversación para ${userPhone}, creando nueva...`);
    const conversationId = await chatsRepository.createConversation({ user_phone: userPhone });
    
    // Recuperar la conversación creada
    conversation = await chatsRepository.findConversationByPhone(userPhone);
    
    if (!conversation) {
      throw new Error('Error al crear conversación');
    }
    
    console.log(`Conversación creada con ID: ${conversationId}`);
  } else {
    console.log(`Conversación existente encontrada con ID: ${conversation.id}`);
  }

  return conversation;
};

/**
 * Guardar mensaje del usuario
 */
export const saveUserMessage = async (
  conversationId: number, 
  message: string
): Promise<number> => {
  console.log(`Guardando mensaje del usuario en conversación ${conversationId}`);
  
  const messageId = await chatsRepository.createMessage({
    conversation_id: conversationId,
    sender: 'user',
    message: message,
    prompt_sent: null
  });

  // Actualizar última actividad de la conversación
  await chatsRepository.updateConversation(conversationId, {
    last_message_at: new Date()
  });

  console.log(`Mensaje del usuario guardado con ID: ${messageId}`);
  return messageId;
};

/**
 * Guardar mensaje del asistente (IA)
 */
export const saveAssistantMessage = async (
  conversationId: number, 
  message: string,
  promptSent: string | null = null
): Promise<number> => {
  console.log(`Guardando respuesta del asistente en conversación ${conversationId}`);
  
  const messageId = await chatsRepository.createMessage({
    conversation_id: conversationId,
    sender: 'assistant',
    message: message,
    prompt_sent: promptSent
  });

  // Actualizar última actividad de la conversación
  await chatsRepository.updateConversation(conversationId, {
    last_message_at: new Date()
  });

  console.log(`Mensaje del asistente guardado con ID: ${messageId}`);
  return messageId;
};

/**
 * Obtener historial de mensajes de una conversación
 */
export const getConversationHistory = async (conversationId: number): Promise<Message[]> => {
  return await chatsRepository.getMessagesByConversation(conversationId);
};

/**
 * Obtener últimos mensajes de una conversación (para contexto)
 */
export const getRecentMessages = async (conversationId: number, limit: number = 10): Promise<Message[]> => {
  return await chatsRepository.getLastMessages(conversationId, limit);
};

/**
 * Procesar mensaje entrante de WhatsApp
 * Esta función orquesta la lógica completa:
 * 1. Obtener o crear conversación
 * 2. Guardar mensaje del usuario
 * 3. Retornar conversación y mensaje guardado
 */
export const processIncomingMessage = async (
  userPhone: string,
  messageText: string
): Promise<{ conversation: Conversation; messageId: number }> => {
  console.log(`Procesando mensaje entrante de ${userPhone}`);
  
  // Obtener o crear conversación
  const conversation = await getOrCreateConversation(userPhone);
  
  // Guardar mensaje del usuario
  const messageId = await saveUserMessage(conversation.id, messageText);
  
  return { conversation, messageId };
};

/**
 * Procesar respuesta del asistente
 * Guarda la respuesta de OpenAI en la conversación
 */
export const processAssistantResponse = async (
  conversationId: number,
  responseText: string,
  promptSent: string | null = null
): Promise<number> => {
  console.log(`Procesando respuesta del asistente para conversación ${conversationId}`);
  
  // Guardar mensaje del asistente
  const messageId = await saveAssistantMessage(conversationId, responseText, promptSent);
  
  return messageId;
};
