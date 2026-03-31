import { Products, CreateProductDTO, UpdateProductDTO, ProductType } from "../Models/products.model";
import * as productsRepository from "../Repository/products.repository";

/**
 * Servicio para obtener todos los productos
 */
export const obtenerTodosLosProductos = async (): Promise<Products[]> => {
    try {
        const products = await productsRepository.getAllProducts();
        return products;
    } catch (error) {
        console.error('Error en obtenerTodosLosProductos:', error);
        throw new Error('Error al obtener los productos');
    }
};

/**
 * Servicio para obtener un producto por ID
 */
export const obtenerProductoPorId = async (id: number): Promise<Products> => {
    if (!id || id <= 0) {
        throw new Error('ID de producto inválido');
    }

    try {
        const product = await productsRepository.getProductById(id);
        
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        
        return product;
    } catch (error) {
        console.error('Error en obtenerProductoPorId:', error);
        throw error;
    }
};

/**
 * Servicio para obtener productos por tipo
 */
export const obtenerProductosPorTipo = async (productTypeId: number): Promise<Products[]> => {
    if (!productTypeId || productTypeId <= 0) {
        throw new Error('ID de tipo de producto inválido');
    }

    try {
        // Verificar que el tipo de producto existe
        const typeExists = await productsRepository.productTypeExists(productTypeId);
        if (!typeExists) {
            throw new Error('El tipo de producto no existe');
        }

        const products = await productsRepository.getProductsByType(productTypeId);
        return products;
    } catch (error) {
        console.error('Error en obtenerProductosPorTipo:', error);
        throw error;
    }
};

/**
 * Servicio para crear un nuevo producto
 */
export const crearNuevoProducto = async (productData: CreateProductDTO): Promise<{ id: number, message: string }> => {
    // Validaciones de negocio
    if (!productData.name || productData.name.trim().length === 0) {
        throw new Error('El nombre del producto es requerido');
    }

    if (productData.name.length > 150) {
        throw new Error('El nombre del producto no puede exceder 150 caracteres');
    }

    if (!productData.product_type_id || productData.product_type_id <= 0) {
        throw new Error('El tipo de producto es requerido');
    }

    if (productData.price && parseFloat(productData.price) < 0) {
        throw new Error('El precio no puede ser negativo');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
        throw new Error('El stock no puede ser negativo');
    }

    try {
        // Verificar que el tipo de producto existe
        const typeExists = await productsRepository.productTypeExists(productData.product_type_id);
        if (!typeExists) {
            throw new Error('El tipo de producto especificado no existe');
        }

        const productId = await productsRepository.createProduct(productData);
        
        return {
            id: productId,
            message: 'Producto creado exitosamente'
        };
    } catch (error) {
        console.error('Error en crearNuevoProducto:', error);
        throw error;
    }
};

/**
 * Servicio para actualizar un producto
 */
export const actualizarProducto = async (id: number, productData: UpdateProductDTO): Promise<{ message: string }> => {
    if (!id || id <= 0) {
        throw new Error('ID de producto inválido');
    }

    // Validaciones de negocio
    if (productData.name !== undefined && productData.name.trim().length === 0) {
        throw new Error('El nombre del producto no puede estar vacío');
    }

    if (productData.name && productData.name.length > 150) {
        throw new Error('El nombre del producto no puede exceder 150 caracteres');
    }

    if (productData.product_type_id !== undefined && productData.product_type_id <= 0) {
        throw new Error('El tipo de producto es inválido');
    }

    if (productData.price !== undefined && parseFloat(productData.price) < 0) {
        throw new Error('El precio no puede ser negativo');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
        throw new Error('El stock no puede ser negativo');
    }

    try {
        // Verificar que el producto existe
        const productExists = await productsRepository.getProductById(id);
        if (!productExists) {
            throw new Error('Producto no encontrado');
        }

        // Si se actualiza el tipo de producto, verificar que existe
        if (productData.product_type_id !== undefined) {
            const typeExists = await productsRepository.productTypeExists(productData.product_type_id);
            if (!typeExists) {
                throw new Error('El tipo de producto especificado no existe');
            }
        }

        const updated = await productsRepository.updateProduct(id, productData);
        
        if (!updated) {
            throw new Error('No se pudo actualizar el producto');
        }

        return { message: 'Producto actualizado exitosamente' };
    } catch (error) {
        console.error('Error en actualizarProducto:', error);
        throw error;
    }
};

/**
 * Servicio para eliminar un producto (soft delete)
 */
export const eliminarProducto = async (id: number): Promise<{ message: string }> => {
    if (!id || id <= 0) {
        throw new Error('ID de producto inválido');
    }

    try {
        // Verificar que el producto existe
        const productExists = await productsRepository.getProductById(id);
        if (!productExists) {
            throw new Error('Producto no encontrado');
        }

        const deleted = await productsRepository.deleteProduct(id);
        
        if (!deleted) {
            throw new Error('No se pudo eliminar el producto');
        }

        return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
        console.error('Error en eliminarProducto:', error);
        throw error;
    }
};

/**
 * Servicio para obtener todos los tipos de producto
 */
export const obtenerTiposDeProducto = async (): Promise<ProductType[]> => {
    try {
        const productTypes = await productsRepository.getAllProductTypes();
        return productTypes;
    } catch (error) {
        console.error('Error en obtenerTiposDeProducto:', error);
        throw new Error('Error al obtener los tipos de producto');
    }
};

/**
 * Servicio para verificar stock disponible
 */
export const verificarStockDisponible = async (productId: number, quantity: number): Promise<boolean> => {
    if (!productId || productId <= 0) {
        throw new Error('ID de producto inválido');
    }

    if (!quantity || quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
    }

    try {
        const hasStock = await productsRepository.checkStock(productId, quantity);
        return hasStock;
    } catch (error) {
        console.error('Error en verificarStockDisponible:', error);
        throw error;
    }
};

/**
 * Servicio para actualizar stock de un producto
 */
export const actualizarStockProducto = async (productId: number, quantity: number): Promise<{ message: string }> => {
    if (!productId || productId <= 0) {
        throw new Error('ID de producto inválido');
    }

    try {
        // Verificar que el producto existe
        const product = await productsRepository.getProductById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // Validar que el stock resultante no sea negativo
        const newStock = (product.stock ?? 0) + quantity;
        if (newStock < 0) {
            throw new Error('Stock insuficiente para realizar la operación');
        }

        const updated = await productsRepository.updateStock(productId, quantity);
        
        if (!updated) {
            throw new Error('No se pudo actualizar el stock');
        }

        return { message: 'Stock actualizado exitosamente' };
    } catch (error) {
        console.error('Error en actualizarStockProducto:', error);
        throw error;
    }
};
