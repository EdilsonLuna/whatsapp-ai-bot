import { Router } from "express";
import { 
    metaWebhookValidation, 
    metaWebhookMessage
} from './../modules/meta/meta.controller';
import { enviarMensajeOpenAI } from "../modules/openai/openai.controller";
import { getConversationHistory } from "../modules/chats/chats.controller";

const router = Router();

// Webhook: verificación GET
router.get('/webhook', metaWebhookValidation);

// Webhook donde meta envia los mensajes desde whatsapp api
router.post('/webhook', metaWebhookMessage);

// Endpoint para enviar mensajes manualmente a openAI
router.post('/pruebaOpenAI', enviarMensajeOpenAI);

// Endpoint para obtener historial de conversación
router.get('/conversations/:conversationId/history', getConversationHistory);

export default router;