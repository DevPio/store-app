import { Product } from "../domain/entities/Product";
import { ProductRepository } from "../domain/repositories/ProductRepository";
import { ProductInput } from "./types";

export class ProductService {


    productRepository: ProductRepository
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async getProduct(idProduct: number): Promise<Product> {
        return await this.productRepository.get(idProduct);
    }


    async getProductByUser(id: number) {
        return await this.productRepository.getByUser(id)
    }

    async getAllProducts() {
        return await this.productRepository.getAll()
    }

    async deleteProduct(idProduct: number) {
        await this.productRepository.delete(idProduct)
    }

    async saveProject(productData: ProductInput) {

        const productOutPut = await this.productRepository.save(new Product(
            0,
            productData.category_id,
            0,
            productData.name,
            parseInt(productData.price.replace(/\D/g, "")),
            productData.quantity,
            true,
            productData.description
        ))
        const product = new Product(
            productOutPut.id,
            productOutPut.category_id,
            productOutPut.user_id,
            productOutPut.name,
            productOutPut.price,
            productOutPut.quantity,
            !!productOutPut.status,
            productOutPut.description
        );

        product.setCreatedAt(new Date(productOutPut.created_at))
        product.setUpdatedAt(new Date(productOutPut.updated_at))

        return product
    }



    async updateProduct(productData: ProductInput) {

        const getProduct = await this.getProduct(productData.id as number)

        let formatPrice = parseInt(productData.price.replace(/\D/g, ""));

        const updateProduct = new Product(
            productData.id as number,
            productData.category_id,
            0,
            productData.name,
            formatPrice,
            productData.quantity,
            productData.status === '1',
            productData.description
        )

        if (formatPrice !== getProduct.price) {
            updateProduct.setOldPrice(getProduct.price)
        }

        const productOutPut = await this.productRepository.update(updateProduct)
        const product = new Product(
            productOutPut.id,
            productOutPut.categoryId,
            productOutPut.userId,
            productOutPut.name,
            productOutPut.price,
            productOutPut.quantity,
            productOutPut.status,
            productOutPut.description
        );

        product.setCreatedAt(new Date(productOutPut.createdAt))
        product.setUpdatedAt(new Date(productOutPut.updatedAt))

        return product
    }

    async searchProduct(name: string, category_id?: number) {
        return await this.productRepository.search(name, category_id)
    }
}