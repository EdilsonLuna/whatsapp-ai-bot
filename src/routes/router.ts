import { Router } from "express";
import { 
    metaWebhookValidation, 
    metaWebhookMessage
} from "../controllers/meta.controller";
import { enviarMensajeOpenAI } from "../controllers/openai.controller";

const router = Router();

// Webhook: verificación GET
router.get('/webhook', metaWebhookValidation);

// Webhook donde meta envia los mensajes desde whatsapp api
router.post('/webhook', metaWebhookMessage);

// Endpoint para enviar mensajes manualmente a openAI
router.post('/pruebaOpenAI', enviarMensajeOpenAI);

export default router;