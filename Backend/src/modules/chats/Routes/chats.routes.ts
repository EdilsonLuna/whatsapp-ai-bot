import { Router } from "express";
import { 
    getConversationHistory,
    getAllConversations 
} from "../Controller/chats.controller";

const chatsRoutes = Router();

// Endpoint para obtener todas las conversaciones con su último mensaje
chatsRoutes.get('/', getAllConversations);

// Endpoint para obtener historial de conversación
chatsRoutes.get('/:conversationId/history', getConversationHistory);

export default chatsRoutes;
