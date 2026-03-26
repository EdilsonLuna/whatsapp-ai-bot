import { Router } from "express";
import { 
    metaWebhookValidation, 
    metaWebhookMessage
} from './../modules/meta/meta.controller';
import chatsRoutes from "../modules/chats/Routes/chats.routes";
import openaiRoutes from "../modules/openai/Routes/openai.routes";
import productsRoutes from "../modules/products/Routes/products.routes";
import settingsRoutes from "../modules/settings/Routes/settings.routes";
import usuariosRoutes from "../modules/users/Routes/usuarios.routes";

const router = Router();

// Webhook: verificación GET (ruta fija requerida por servicios externos)
router.get('/webhook', metaWebhookValidation);

// Webhook donde meta envia los mensajes desde whatsapp api (ruta fija requerida por servicios externos)
router.post('/webhook', metaWebhookMessage);

// Rutas por módulo
router.use('/conversations', chatsRoutes);
router.use('/openai', openaiRoutes);
router.use('/products', productsRoutes);
router.use('/settings', settingsRoutes);
router.use('/users', usuariosRoutes);

export default router;