import pool from "../../config/db";
import { env } from "../../config/env";
import { Products, ProductType, CreateProductDTO, UpdateProductDTO } from "../../models/products.model";
import { RowDataPacket, ResultSetHeader } from "mysql2";

/**
 * Obtener todos los productos activos con información del tipo de producto
 */
export const getAllProducts = async (): Promise<Products[]> => {
    const [rows] = await pool.query<(Products & RowDataPacket)[]>(
        `SELECT 
            p.id,
            p.product_type_id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.is_active,
            p.created_at
        FROM products p
        WHERE p.is_active = 1
        ORDER BY p.created_at DESC`
    );
    return rows;
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id: number): Promise<Products | null> => {
    const [rows] = await pool.query<(Products & RowDataPacket)[]>(
        `SELECT 
            p.id,
            p.product_type_id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.is_active,
            p.created_at
        FROM products p
        WHERE p.id = ?`,
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
};

/**
 * Obtener productos por tipo
 */
export const getProductsByType = async (productTypeId: number): Promise<Products[]> => {
    const [rows] = await pool.query<(Products & RowDataPacket)[]>(
        `SELECT 
            p.id,
            p.product_type_id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.is_active,
            p.created_at
        FROM products p
        WHERE p.product_type_id = ? AND p.is_active = 1
        ORDER BY p.created_at DESC`,
        [productTypeId]
    );
    return rows;
};

/**
 * Crear un nuevo producto
 */
export const createProduct = async (productData: CreateProductDTO): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO products (product_type_id, name, description, price, stock)
        VALUES (?, ?, ?, ?, ?)`,
        [
            productData.product_type_id,
            productData.name,
            productData.description || null,
            productData.price || null,
            productData.stock || 0
        ]
    );
    return result.insertId;
};

/**
 * Actualizar un producto existente
 */
export const updateProduct = async (id: number, productData: UpdateProductDTO): Promise<boolean> => {
    const fields: string[] = [];
    const values: any[] = [];

    if (productData.product_type_id !== undefined) {
        fields.push('product_type_id = ?');
        values.push(productData.product_type_id);
    }
    if (productData.name !== undefined) {
        fields.push('name = ?');
        values.push(productData.name);
    }
    if (productData.description !== undefined) {
        fields.push('description = ?');
        values.push(productData.description);
    }
    if (productData.price !== undefined) {
        fields.push('price = ?');
        values.push(productData.price);
    }
    if (productData.stock !== undefined) {
        fields.push('stock = ?');
        values.push(productData.stock);
    }
    if (productData.is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(productData.is_active);
    }

    if (fields.length === 0) {
        return false;
    }

    values.push(id);
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
        values
    );

    return result.affectedRows > 0;
};

/**
 * Eliminar un producto (soft delete)
 */
export const deleteProduct = async (id: number): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE products SET is_active = 0 WHERE id = ?`,
        [id]
    );
    return result.affectedRows > 0;
};

/**
 * Verificar si existe un tipo de producto
 */
export const productTypeExists = async (productTypeId: number): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT id FROM product_types WHERE id = ?`,
        [productTypeId]
    );
    return rows.length > 0;
};

/**
 * Obtener todos los tipos de producto
 */
export const getAllProductTypes = async (): Promise<ProductType[]> => {
    const [rows] = await pool.query<(ProductType & RowDataPacket)[]>(
        `SELECT id, name FROM product_types ORDER BY name`
    );
    return rows;
};

/**
 * Verificar disponibilidad de stock
 */
export const checkStock = async (productId: number, quantity: number): Promise<boolean> => {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT stock FROM products WHERE id = ? AND is_active = 1`,
        [productId]
    );
    
    if (rows.length === 0) {
        return false;
    }
    
    return rows[0].stock >= quantity;
};

/**
 * Actualizar stock de un producto
 */
export const updateStock = async (productId: number, quantity: number): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE products SET stock = stock + ? WHERE id = ?`,
        [quantity, productId]
    );
    return result.affectedRows > 0;
};
