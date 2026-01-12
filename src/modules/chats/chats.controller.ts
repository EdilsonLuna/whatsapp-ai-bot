import { Request, Response } from "express";
import * as chatsService from "./chats.service";
import { WhatsAppWebhookMessage } from "../../models/chats.model";

// ============================================
// CONTROLADORES
// ============================================

/**
 * Procesar mensaje entrante del webhook
 * Extrae información del mensaje y lo guarda en la base de datos
 */
export const processWebhookMessage = async (webhookData: WhatsAppWebhookMessage) => {
  try {
    // Validar que sea un mensaje de texto
    if (!webhookData.value.messages || webhookData.value.messages.length === 0) {
      console.log('No hay mensajes en el webhook');
      return null;
    }

    const message = webhookData.value.messages[0];
    
    // Validar que sea mensaje de texto
    if (message.type !== 'text' || !message.text) {
      console.log('Mensaje no es de tipo texto');
      return null;
    }

    const userPhone = message.from;
    const messageText = message.text.body;

    console.log(`Procesando mensaje de ${userPhone}: ${messageText}`);

    // Procesar mensaje (crear/obtener conversación y guardar mensaje)
    const result = await chatsService.processIncomingMessage(userPhone, messageText);

    console.log(`Mensaje procesado exitosamente. Conversación ID: ${result.conversation.id}, Mensaje ID: ${result.messageId}`);

    return {
      conversationId: result.conversation.id,
      messageId: result.messageId,
      userPhone: userPhone,
      messageText: messageText
    };

  } catch (error: any) {
    console.error('Error al procesar mensaje del webhook:', error);
    throw error;
  }
};

/**
 * Guardar respuesta del asistente
 * Se llama después de que OpenAI genera una respuesta
 */
export const saveAIResponse = async (
  conversationId: number,
  responseText: string,
  promptSent: string | null = null
) => {
  try {
    console.log(`Guardando respuesta de IA para conversación ${conversationId}`);
    
    const messageId = await chatsService.processAssistantResponse(
      conversationId, 
      responseText, 
      promptSent
    );

    console.log(`Respuesta de IA guardada con ID: ${messageId}`);

    return messageId;

  } catch (error: any) {
    console.error('Error al guardar respuesta de IA:', error);
    throw error;
  }
};

/**
 * Obtener historial de conversación
 * Endpoint para consultar mensajes de una conversación
 */
export const getConversationHistory = async (req: Request, res: Response) => {
  try {
    const conversationId = parseInt(req.params.conversationId as string);

    if (isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de conversación inválido'
      });
    }

    const messages = await chatsService.getConversationHistory(conversationId);

    return res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error: any) {
    console.error('Error al obtener historial:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener historial de conversación'
    });
  }
};
