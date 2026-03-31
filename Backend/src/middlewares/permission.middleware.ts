import { Request, Response, NextFunction } from "express";

export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.permisos) {
      return res.status(403).json({ msg: "Acceso denegado: sin permisos asignados" });
    }

    if (!user.permisos.includes(permission)) {
      return res.status(403).json({ msg: "Acceso denegado: permiso insuficiente" });
    }

    return next();
  };
};
