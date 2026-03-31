import { prismaClient } from "../../../prisma/prisma.client";
import { Products, ProductType, CreateProductDTO, UpdateProductDTO } from "../Models/products.model";
import { Decimal } from "../../../generated/prisma/runtime/client";

const mapProducto = (p: any): Products => ({
    id: p.id,
    product_type_id: p.id_tipo_producto,
    name: p.nombre,
    description: p.descripcion,
    price: p.precio ? p.precio.toString() : null,
    stock: p.stock,
    is_active: p.esta_activo,
    created_at: p.creado_en,
});

const mapProductType = (t: any): ProductType => ({
    id: t.id,
    name: t.nombre,
});

/**
 * Obtener todos los productos activos
 */
export const getAllProducts = async (): Promise<Products[]> => {
    const rows = await prismaClient.productos.findMany({
        where: { esta_activo: true },
        orderBy: { creado_en: 'desc' },
    });
    return rows.map(mapProducto);
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id: number): Promise<Products | null> => {
    const row = await prismaClient.productos.findUnique({ where: { id } });
    return row ? mapProducto(row) : null;
};

/**
 * Obtener productos por tipo
 */
export const getProductsByType = async (productTypeId: number): Promise<Products[]> => {
    const rows = await prismaClient.productos.findMany({
        where: { id_tipo_producto: productTypeId, esta_activo: true },
        orderBy: { creado_en: 'desc' },
    });
    return rows.map(mapProducto);
};

/**
 * Crear un nuevo producto
 */
export const createProduct = async (productData: CreateProductDTO): Promise<number> => {
    const result = await prismaClient.productos.create({
        data: {
            id_tipo_producto: productData.product_type_id,
            nombre: productData.name,
            descripcion: productData.description || null,
            precio: productData.price ? new Decimal(productData.price) : null,
            stock: productData.stock ?? 0,
        },
    });
    return result.id;
};

/**
 * Actualizar un producto existente
 */
export const updateProduct = async (id: number, productData: UpdateProductDTO): Promise<boolean> => {
    const data: any = {};

    if (productData.product_type_id !== undefined) data.id_tipo_producto = productData.product_type_id;
    if (productData.name !== undefined) data.nombre = productData.name;
    if (productData.description !== undefined) data.descripcion = productData.description;
    if (productData.price !== undefined) data.precio = new Decimal(productData.price);
    if (productData.stock !== undefined) data.stock = productData.stock;
    if (productData.is_active !== undefined) data.esta_activo = productData.is_active;

    if (Object.keys(data).length === 0) {
        return false;
    }

    const result = await prismaClient.productos.update({
        where: { id },
        data,
    });
    return !!result;
};

/**
 * Eliminar un producto (soft delete)
 */
export const deleteProduct = async (id: number): Promise<boolean> => {
    const result = await prismaClient.productos.update({
        where: { id },
        data: { esta_activo: false },
    });
    return !!result;
};

/**
 * Verificar si existe un tipo de producto
 */
export const productTypeExists = async (productTypeId: number): Promise<boolean> => {
    const row = await prismaClient.tipos_producto.findUnique({
        where: { id: productTypeId },
    });
    return !!row;
};

/**
 * Obtener todos los tipos de producto
 */
export const getAllProductTypes = async (): Promise<ProductType[]> => {
    const rows = await prismaClient.tipos_producto.findMany({
        orderBy: { nombre: 'asc' },
    });
    return rows.map(mapProductType);
};

/**
 * Verificar disponibilidad de stock
 */
export const checkStock = async (productId: number, quantity: number): Promise<boolean> => {
    const row = await prismaClient.productos.findFirst({
        where: { id: productId, esta_activo: true },
        select: { stock: true },
    });

    if (!row || row.stock === null) {
        return false;
    }

    return row.stock >= quantity;
};

/**
 * Actualizar stock de un producto
 */
export const updateStock = async (productId: number, quantity: number): Promise<boolean> => {
    const result = await prismaClient.productos.update({
        where: { id: productId },
        data: { stock: { increment: quantity } },
    });
    return !!result;
};
