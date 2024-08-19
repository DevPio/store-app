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
    async save(category: Category): Promise<Category> {
        const categoryInput = await db.query(`
            INSERT INTO categories
            (
                name
            )
            VALUES
            (
                $1
            )
            RETURNING *
            `,
            [
                category.name
            ]
        )
        const categoryOut = categoryInput.rows[0]
        return new Category(categoryOut.id, categoryOut.name)
    }
    update(category: Category): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(idCategory: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}