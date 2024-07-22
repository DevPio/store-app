import { ProductOutPut } from "../../services/types";
import { Product } from "../entities/Product";


export interface ProductRepository {
    getAll(): Promise<Product[]>;
    get(idProduct: number): Promise<Product>;
    save(product: Product): Promise<ProductOutPut>;
    update(product: Product): Promise<Product>;
    delete(idProduct: number): Promise<void>;
    search(name:string, category_id?: number): Promise<{
        products: Product[],
        total_count:number
    }>;
}