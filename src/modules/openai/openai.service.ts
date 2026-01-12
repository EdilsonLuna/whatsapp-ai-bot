import OpenAI from "openai";
import { env } from "../../config/env";
import { Products } from "../../models/products.model";

const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
});

export async function responderAI(prompt:string, userMessage:string = 'Hola, quisiera informacion sobre los telefonos.'):Promise<OpenAI.Responses.Response> {
  const completion = await client.responses.create({
    model: "gpt-4o-mini",
    // reasoning: {effort: 'low'},
    input: [
      { role: "developer", content: prompt },
      { role: "user", content: userMessage }
    ]
  });
  console.log('respuesta de openai');
  console.log(JSON.stringify(completion));
  return completion;
}


export function createPrompt(productsList:Products[]):string{
    // Crear el prompt base para el asistente de ventas
    let prompt = `Eres un asistente virtual experto en ventas para una tienda de teléfonos móviles y accesorios. Tu objetivo es ayudar a los clientes a encontrar el producto perfecto según sus necesidades.

INSTRUCCIONES:
- Sé amable, profesional y servicial en todo momento
- Responde de manera concisa y clara
- Recomienda productos basándote en las necesidades del cliente
- Si un producto no está disponible (stock: 0), menciona que está agotado
- Puedes sugerir alternativas similares cuando sea apropiado
- Proporciona información detallada sobre precios, características y disponibilidad
- Si el cliente pregunta por algo que no está en el catálogo, explica que no lo tienes disponible actualmente

CATÁLOGO DE PRODUCTOS DISPONIBLES:

`;

    // Agrupar productos por tipo para mejor organización
    const productsByType = new Map<number, Products[]>();
    
    productsList.forEach(product => {
        if (product.is_active) {
            if (!productsByType.has(product.product_type_id)) {
                productsByType.set(product.product_type_id, []);
            }
            productsByType.get(product.product_type_id)?.push(product);
        }
    });

    // Agregar productos al prompt
    productsByType.forEach((products, typeId) => {
        products.forEach(product => {
            const stockStatus = product.stock > 0 ? `En stock: ${product.stock} unidades` : 'AGOTADO';
            prompt += `
📱 ${product.name}`;
            prompt += `\n   - Precio: $${product.price}`;
            prompt += `\n   - ${stockStatus}`;
            if (product.description) {
                prompt += `\n   - Descripción: ${product.description}`;
            }
            prompt += `\n`;
        });
    });

    prompt += `\n\nRECUERDA: Basa tus respuestas únicamente en los productos listados arriba. Sé honesto si algo no está disponible y ofrece alternativas cuando sea posible.`;
    
    return prompt;
}