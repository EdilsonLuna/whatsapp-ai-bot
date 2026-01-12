import { Request, Response } from "express";
import { responderAI, createPrompt } from "./openai.service";
import OpenAI from "openai";
import * as productsService from "../products/products.service";


export const enviarMensajeOpenAI = async (req:Request, res:Response) => {
  try {
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
    const userMessage = req.body.message || 'Hola, quisiera información sobre los teléfonos.';
    console.log('Mensaje del usuario:', userMessage);
    console.log('Enviando mensaje a OpenAI...');
    
    const respuesta:OpenAI.Responses.Response = await responderAI(prompt, userMessage);
    
    console.log('Respuesta de OpenAI recibida:');
    console.log('Output text:', respuesta.output_text);
    console.log('----------------------------');

    // 5. Retorno de mensaje unicamente
    return res.status(200).json({
        success: true,
        message: respuesta.output_text
    });
  } catch (error: any) {
    console.error('Error en enviarMensajeOpenAI:', error);
    return res.status(500).json({
        success: false,
        message: error.message || 'Error al procesar el mensaje con OpenAI'
    });
  }
}

