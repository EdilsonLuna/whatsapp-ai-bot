import { Request, Response } from "express";
import OpenAI from "openai";
import { env } from "../config/env";

const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
});


export const enviarMensajeOpenAI = async (req:Request, res:Response) => {
    const respuesta = await responderAI();
    return res.status(200).json({"message": respuesta});
}


async function responderAI() {
  const completion = await client.responses.create({
    model: "gpt-4o-mini",
    // reasoning: {effort: 'low'},
    input: [
      { role: "developer", content: "Eres un asistente de ventas de celulares. Debes tener un tono amable, calido, que haga sentir en confianza al comprador. A su vez, debes usar palabras que enganchen y emocionen a la persona a comprar los productos. El stock de la tienda es iphone 14 pro de 128 gb color negro. Con valor de 2'500'000 COP. Acercandose antes del 12/01/2025 puede tener 20% de descuento." },
      { role: "user", content: "Hola. Quisiera informacion sobre los telefonos" }
    ]
  });
  console.log('respuesta de openai');
  console.log(JSON.stringify(completion));
  return completion.output_text;
}