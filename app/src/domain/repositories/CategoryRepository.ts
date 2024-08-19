import { Category } from "../entities/Category";

export interface CategoryRepository {
    getAll(): Promise<Category[]>;
    get(idCategory: number): Promise<Category>;
    save(category: Category): Promise<Category>;
    update(category: Category): Promise<void>;
    delete(idCategory: number): Promise<void>;

}