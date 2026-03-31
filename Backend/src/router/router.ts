import { Router } from "express";
import { 
    metaWebhookValidation, 
    metaWebhookMessage
} from "../modules/meta/Controller/meta.controller";
import authRoutes from "../modules/Auth/Routes/auth.routes";
import chatsRoutes from "../modules/chats/Routes/chats.routes";
import productsRoutes from "../modules/products/Routes/products.routes";
import settingsRoutes from "../modules/settings/Routes/settings.routes";
import usuariosRoutes from "../modules/usuarios/Routes/usuarios.routes";

const router = Router();

// Webhook: verificación GET (ruta fija requerida por servicios externos)
router.get('/webhook', metaWebhookValidation);

// Webhook donde meta envia los mensajes desde whatsapp api (ruta fija requerida por servicios externos)
router.post('/webhook', metaWebhookMessage);

// Rutas por módulo
router.use('/auth', authRoutes);
router.use('/conversations', chatsRoutes);
router.use('/products', productsRoutes);
router.use('/settings', settingsRoutes);
router.use('/users', usuariosRoutes);

export default router;