import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";
import router from './routes/router';

//Declaracion del servidor
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                 // Límite de requests por ventana
  message: { error: "Demasiadas peticiones, inténtalo más tarde" },
  standardHeaders: true,    // Devuelve información en headers RateLimit-*
  legacyHeaders: false,     // Desactiva X-RateLimit-* obsoletos
});

//Configuracion
app.set("trust proxy", 1);
//Uso de middlewares
//Middleware de seguridad
app.use(cors());
//Middleware para uso de json
app.use(express.json());
//Middleware para mapear las cookies que vienen en los headers de las peticiones
app.use(cookieParser());
//Middleware para limitar la cantidad de peticiones por ip
app.use(limiter);
//Middleware de manejo global de errores
app.use((req:Request, res:Response, next:NextFunction) => 
{ 
  if(( req.method == "POST" && req.body == undefined) || (req.method == "GET" && req.headers == undefined))
  {
    console.log('error en uno de los parametros');
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    return res.status(500).json({status: 'error', msg:'Peticion erronea'}); 
  } else{
    next();
  }
});
//Enrutador
app.use('/api', router);
//Redirigir las rutas no mapeadas
app.use((req:Request, res:Response) => {
    res.status(404).json({status: 'error', msg: 'Ruta no encontrada'});
});


export default app;