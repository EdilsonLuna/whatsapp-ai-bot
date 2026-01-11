import { Request, Response, Router } from "express";
// Token que vas a usar para la verificación
const VERIFY_TOKEN = 'prymusoft_test_token';

const router = Router();

// Webhook: verificación GET
router.get('/webhook', (req:Request, res:Response) => {
    console.log('cae en verificacion get');
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
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
    return res.status(200).json({"message": "hello world"});
});


export default router;