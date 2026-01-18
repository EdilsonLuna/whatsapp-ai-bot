import { Request, Response } from "express";
import { env } from "../../config/env";
import axios from "axios";

export const metaWebhookValidation = (req:Request, res:Response) => {
    console.log('cae en verificacion get');
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
    if (mode === 'subscribe' && token === 'test_prueba') {
        console.log('Webhook verificado');
        return res.status(200).send(challenge); // Muy importante: devuelve el challenge
    } else {
        console.log('webhook no verificado');
        return res.sendStatus(403);
    }
    }
    res.sendStatus(400);
}

export const metaWebhookMessage = async (req: Request, res: Response) => {
  try {
    console.log("entra correctamente a la funcion de recibir mensaje");
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body;

    console.log("Mensaje recibido:", text);

    // RESPUESTA AUTOMÁTICA
    await sendWhatsAppMessage(
      from,
      `Recibí tu mensaje: "${text}"`
    );

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error webhook:", error);
    return res.sendStatus(200);
  }
};

export const sendWhatsAppMessage = async (
  to: string,
  message: string
) => {
  const PHONE_NUMBER_ID = "";
  const TOKEN = "EAAXg8McAkAABQeLbCZAQWQac1kH0THZCtch6fbV5pZCP5FTcceO7dONt5s6Yn76gqKw9qhZAZBPpXDrPwRZB8GjzUL8ZASDugZBTQyCrZB0qfZAx0oGK0VAebAYza5yeJNZAqFzb37tMGwkOAMcb1fl9q22s8i7xXHz1HU748pPZB9FSQP8M2pUs9voNZByYC0CzEqQZDZD";
  
  const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: {
      body: message
    }
  };

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    }
  });
};