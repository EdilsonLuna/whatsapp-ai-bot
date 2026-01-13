import { Router } from "express";
import { 
    metaWebhookValidation, 
    metaWebhookMessage
} from './../modules/meta/meta.controller';
import { enviarMensajeOpenAI } from "../modules/openai/openai.controller";
import { 
    getConversationHistory,
    getAllConversations 
} from "../modules/chats/chats.controller";
import { consultarProductos } from "../modules/products/products.controller";

const router = Router();

// Webhook: verificación GET
router.get('/webhook', metaWebhookValidation);

// Webhook donde meta envia los mensajes desde whatsapp api
router.post('/webhook', metaWebhookMessage);

// Endpoint para enviar mensajes manualmente a openAI
router.post('/pruebaOpenAI', enviarMensajeOpenAI);

// Endpoint para obtener todas las conversaciones con su último mensaje
router.get('/conversations', getAllConversations);

// Endpoint para obtener historial de conversación
router.get('/conversations/:conversationId/history', getConversationHistory);

// Endpoint para obtener todos los productos en base de datos
router.get('/products', consultarProductos);

export default router;