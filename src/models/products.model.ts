export interface Products{
    id:number,
    product_type_id:number,
    name:string,
    description:string,
    price:string,
    stock:number,
    is_active:boolean,
    created_at:Date
}

export interface ProductType{
    id:number,
    name:string
}

export interface CreateProductDTO{
    product_type_id:number,
    name:string,
    description?:string,
    price?:string,
    stock?:number
}

export interface UpdateProductDTO{
    product_type_id?:number,
    name?:string,
    description?:string,
    price?:string,
    stock?:number,
    is_active?:boolean
}