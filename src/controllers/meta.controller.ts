import { Request, Response } from "express";
import { env } from "../config/env";

export const metaWebhookValidation = (req:Request, res:Response) => {
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
}

export const metaWebhookMessage = (req:Request, res:Response) => {
    console.log('peticion agregada correctamente!!!');
    console.log("cuerpo de peticion");
    console.log(req.body);
    console.log(JSON.stringify(req.body.entry[0].changes,null,2));

    return res.status(200).json({"message": "hello world"});
}