import { Request, Response } from "express";
import { env } from "../../config/env";
import * as productsService from "./products.service";
import { CreateProductDTO, UpdateProductDTO } from "../../models/products.model";

/**
 * Controlador para crear un nuevo producto
 */
export const crearProducto = async (req: Request, res: Response) => {
    try {
        const productData: CreateProductDTO = req.body;
        
        const result = await productsService.crearNuevoProducto(productData);
        
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('Error en crearProducto:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Error al crear el producto'
        });
    }
};

/**
 * Controlador para consultar todos los productos
 */
export const consultarProductos = async (req: Request, res: Response) => {
    try {
        const products = await productsService.obtenerTodosLosProductos();
        
        return res.status(200).json({
            success: true,
            data: products,
            total: products.length
        });
    } catch (error: any) {
        console.error('Error en consultarProductos:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error al consultar los productos'
        });
    }
};

/**
 * Controlador para consultar un producto por ID
 */
export const consultarProductoPorId = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }
        
        const product = await productsService.obtenerProductoPorId(id);
        
        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error: any) {
        console.error('Error en consultarProductoPorId:', error);
        const statusCode = error.message === 'Producto no encontrado' ? 404 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Error al consultar el producto'
        });
    }
};

/**
 * Controlador para consultar productos por tipo
 */
export const consultarProductosPorTipo = async (req: Request, res: Response) => {
    try {
        const productTypeId = parseInt(req.params.productTypeId as string);
        
        if (isNaN(productTypeId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tipo de producto inválido'
            });
        }
        
        const products = await productsService.obtenerProductosPorTipo(productTypeId);
        
        return res.status(200).json({
            success: true,
            data: products,
            total: products.length
        });
    } catch (error: any) {
        console.error('Error en consultarProductosPorTipo:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Error al consultar los productos por tipo'
        });
    }
};

/**
 * Controlador para actualizar un producto
 */
export const actualizarProducto = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }
        
        const productData: UpdateProductDTO = req.body;
        
        const result = await productsService.actualizarProducto(id, productData);
        
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('Error en actualizarProducto:', error);
        const statusCode = error.message === 'Producto no encontrado' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Error al actualizar el producto'
        });
    }
};

/**
 * Controlador para eliminar un producto
 */
export const eliminarProducto = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }
        
        const result = await productsService.eliminarProducto(id);
        
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('Error en eliminarProducto:', error);
        const statusCode = error.message === 'Producto no encontrado' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Error al eliminar el producto'
        });
    }
};

/**
 * Controlador para consultar tipos de producto
 */
export const consultarTiposDeProducto = async (req: Request, res: Response) => {
    try {
        const productTypes = await productsService.obtenerTiposDeProducto();
        
        return res.status(200).json({
            success: true,
            data: productTypes,
            total: productTypes.length
        });
    } catch (error: any) {
        console.error('Error en consultarTiposDeProducto:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error al consultar los tipos de producto'
        });
    }
};

/**
 * Controlador para actualizar stock de un producto
 */
export const actualizarStock = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const { quantity } = req.body;
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de producto inválido'
            });
        }
        
        if (quantity === undefined || isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad es requerida y debe ser un número'
            });
        }
        
        const result = await productsService.actualizarStockProducto(id, quantity);
        
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('Error en actualizarStock:', error);
        const statusCode = error.message === 'Producto no encontrado' ? 404 : 400;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Error al actualizar el stock'
        });
    }
};
