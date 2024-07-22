import { Category } from "../../../domain/entities/Category";
import { CategoryRepository } from "../../../domain/repositories/CategoryRepository";
import { db } from "../../database/db";

export class CategoryRepositoryDatabase implements CategoryRepository {
    async getAll(): Promise<Category[]> {
        const categoriesData = await db.query("SELECT * FROM categories;")

        return categoriesData.rows.map(category => new Category(category.id, category.name))

    }
    get(idCategory: number): Promise<Category> {
        throw new Error("Method not implemented.");
    }
    save(category: Category): Promise<number> {
        throw new Error("Method not implemented.");
    }
    update(category: Category): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(idCategory: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}