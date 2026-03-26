import { Router } from "express";
import { enviarMensajeOpenAI } from "../openai.controller";

const openaiRoutes = Router();

// Endpoint para enviar mensajes manualmente a openAI
openaiRoutes.post('/pruebaOpenAI', enviarMensajeOpenAI);

export default openaiRoutes;
