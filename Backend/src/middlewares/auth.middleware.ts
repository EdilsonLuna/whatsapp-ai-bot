import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { payloadTokenUser } from "../modules/Auth/Models/auth.model";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.FIRMA_ACCESS_TOKEN as string) as payloadTokenUser;
    if(!payload){
        return res.status(401).json({ msg: "Token inválido" });
    }else{
        req.user = payload;
        return next();
    }
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};