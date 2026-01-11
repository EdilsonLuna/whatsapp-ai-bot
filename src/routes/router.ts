import { Request, Response, Router } from "express";
import OpenAI from "openai";
import { env } from "../config/env";


const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
});
const router = Router();

// Webhook: verificación GET
router.get('/webhook', (req:Request, res:Response) => {
    console.log('cae en verificacion get');
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
    if (mode === 'subscribe' && token === env.VERIFY_TOKEN) {
        console.log('Webhook verificado');
        return res.status(200).send(challenge); // Muy importante: devuelve el challenge
    } else {
        console.log('webhook no verificado');
        return res.sendStatus(403);
    }
    }
    res.sendStatus(400);
});

router.post('/webhook', (req:Request, res:Response) => {
    console.log('peticion agregada correctamente!!!');
    console.log("cuerpo de peticion");
    console.log(req.body);
    console.log(JSON.stringify(req.body.entry[0].changes,null,2));

    return res.status(200).json({"message": "hello world"});
});

router.post('/pruebaOpenAI', async (req:Request, res:Response) => {
    const respuesta = await responderAI();
    return res.status(200).json({"message": respuesta});
});


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

export default router;