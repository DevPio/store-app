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
    total_count?:string
    category_name?:string
}

export type FileProductOutPut = {
    id: number;
    name: string;
    path: string;
    product_id: number
}