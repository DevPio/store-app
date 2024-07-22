import { CategoryRepository } from "../domain/repositories/CategoryRepository";
import { CategoryOutput } from "./types";

export class CategoryService {
    categoryRepository: CategoryRepository
    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async getCategories() {
        const categories = await this.categoryRepository.getAll();

        return categories.map(category => {
            const categoryOutput = (<CategoryOutput>{
                id: category.id,
                name: category.name
            })

            return categoryOutput
        })
    }
}