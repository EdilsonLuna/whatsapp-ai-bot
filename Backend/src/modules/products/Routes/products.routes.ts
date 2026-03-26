import { Router } from "express";
import { consultarProductos } from "../products.controller";

const productsRoutes = Router();

// Endpoint para obtener todos los productos en base de datos
productsRoutes.get('/', consultarProductos);

export default productsRoutes;
