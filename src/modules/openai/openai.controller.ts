import { Request, Response } from "express";
import { responderAI, createPrompt } from "./openai.service";
import OpenAI from "openai";
import * as productsService from "../products/products.service";
import * as chatsController from "../chats/chats.controller";
import { WhatsAppWebhookMessage } from "../../models/chats.model";


export const enviarMensajeOpenAI = async (req:Request, res:Response) => {
  try {
    // 0. Procesar mensaje del webhook y guardar en BD
    let conversationId: number | null = null;
    let userMessage = req.body.message || 'Hola, quisiera información sobre los teléfonos.';

    // Si viene data del webhook, procesarla
    if (req.body.field && req.body.value) {
      console.log('Procesando mensaje desde webhook...');
      const webhookData: WhatsAppWebhookMessage = req.body as WhatsAppWebhookMessage;
      const chatResult = await chatsController.processWebhookMessage(webhookData);
      
      if (chatResult) {
        conversationId = chatResult.conversationId;
        userMessage = chatResult.messageText;
        console.log(`Mensaje del usuario guardado. Conversación ID: ${conversationId}`);
      }
    }

    // 1. Consulta de productos disponibles
    console.log('Consultando productos disponibles...');
    const productsList = await productsService.obtenerTodosLosProductos();
    console.log(`Productos encontrados: ${productsList.length}`);

    // 2. Armado de prompt para ia
    console.log('Armando prompt para OpenAI...');
    const prompt = createPrompt(productsList);
    console.log('Prompt creado:');
    console.log(prompt);
    console.log('----------------------------');

    // 3. Envio de prompt completo a openai
    console.log('Mensaje del usuario:', userMessage);
    console.log('Enviando mensaje a OpenAI...');
    
    const respuesta:OpenAI.Responses.Response = await responderAI(prompt, userMessage);
    
    console.log('Respuesta de OpenAI recibida:');
    console.log('Output text:', respuesta.output_text);
    console.log('----------------------------');

    // 4. Guardar respuesta del asistente en BD
    if (conversationId) {
      console.log('Guardando respuesta del asistente en BD...');
      await chatsController.saveAIResponse(conversationId, respuesta.output_text, prompt);
      console.log('Respuesta del asistente guardada exitosamente');
    }

    // 5. Retorno de mensaje unicamente
    return res.status(200).json({
        success: true,
        message: respuesta.output_text,
        conversationId: conversationId
    });
  } catch (error: any) {
    console.error('Error en enviarMensajeOpenAI:', error);
    return res.status(500).json({
        success: false,
        message: error.message || 'Error al procesar el mensaje con OpenAI'
    });
  }
}

