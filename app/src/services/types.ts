export type CategoryOutput = {
    id: number;
    name: string;
}


export type ProductInput = {
    id?: number;
    name: string;
    description: string;
    category_id: number;
    price: string;
    quantity: number;
    status: string
    filesDelete?: string
}


export type ProductOutPut = {
    id: number;
    category_id: number;
    user_id: number;
    name: string;
    description: string;
    old_price: number;
    price: number;
    quantity: number;
    status: boolean;
    created_at: Date;
    updated_at: Date
    total_count?: string
    category_name?: string
}

export type FileProductOutPut = {
    id: number;
    name: string;
    path: string;
    product_id: number
}

export type UserOutPut = {
    id: number;
    name: string;
    email: string;
    password: string;
    cpf_cnpj: number;
    cep: string;
    address: string;
    created_at: string;
    updated_at: string;
}


export type UserInput = {
    id?: string;
    name: string;
    email: string;
    password: string;
    passwordRepeat: string;
    cpf_cnpj: string;
    cep: string;
    fullAddress: string;
}


export interface OrderOutPut {
    id: number;
    sellerId: number;
    buyerId: number;
    productId: number;
    price: number;
    quantity: number;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}