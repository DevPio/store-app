import { Product } from "../../../domain/entities/Product";
import { ProductRepository } from "../../../domain/repositories/ProductRepository";
import { ProductOutPut } from "../../../services/types";
import { db } from "../../database/db";

export class ProductRepositoryDatabase implements ProductRepository {
    async getAll(): Promise<Product[]> {
        const products = await db.query<ProductOutPut>("SELECT * FROM products")

        return products.rows.map(product => {
            return new Product(
                product.id,
                product.category_id,
                product.user_id,
                product.name,
                product.price,
                product.quantity,
                product.status,
                product.description
            )
        })
    }
    async get(idProduct: number): Promise<Product> {
        const productData = await db.query<ProductOutPut>("SELECT * FROM products WHERE id = $1", [idProduct])
        const productOutPut = productData.rows[0]
        const product = new Product(
            productOutPut.id,
            productOutPut.category_id,
            productOutPut.user_id,
            productOutPut.name,
            productOutPut.price,
            productOutPut.quantity,
            productOutPut.status,
            productOutPut.description
        );

        product.setCreatedAt(new Date(productOutPut.created_at))
        product.setUpdatedAt(new Date(productOutPut.updated_at))
        product.setOldPrice(productOutPut.old_price)
        return product
    }


    async getByUser(id: number): Promise<Product[]> {
        const productData = await db.query<ProductOutPut>("SELECT * FROM products WHERE user_id = $1", [id])

        const productOutPut = productData.rows.map(productOut => {
            const product = new Product(
                productOut.id,
                productOut.category_id,
                productOut.user_id,
                productOut.name,
                productOut.price,
                productOut.quantity,
                productOut.status,
                productOut.description
            );

            product.setCreatedAt(new Date(productOut.created_at))
            product.setUpdatedAt(new Date(productOut.updated_at))
            product.setOldPrice(productOut.old_price)

            return product
        })

        return productOutPut
    }
    async save(product: Product): Promise<ProductOutPut> {
        const { rows } = await db.query(`
            INSERT INTO products 
            (
                category_id,
                user_id,
                name,
                description,
                price,
                quantity,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            )
            RETURNING *
        `,
            [
                product.categoryId,
                product.userId,
                product.name,
                product.description,
                product.price,
                product.quantity,
                +product.status
            ]
        )

        return rows[0]
    }
    async update(product: Product): Promise<Product> {
        const { rows } = await db.query<ProductOutPut>(`
            UPDATE products 
            
            SET category_id = $1, user_id = $2, name = $3, description = $4, price = $5, quantity = $6, status = $7, old_price = $8
            
            WHERE id = $9

            RETURNING *
        `,
            [
                product.categoryId,
                product.userId,
                product.name,
                product.description,
                product.price,
                product.quantity,
                +product.status,
                product.oldPrice,
                product.id
            ]

        )
        const productOutPut = rows[0]
        return new Product(
            productOutPut.id,
            productOutPut.category_id,
            productOutPut.user_id,
            productOutPut.name,
            productOutPut.price,
            productOutPut.quantity,
            productOutPut.status,
            productOutPut.description,
            productOutPut.old_price
        )
    }
    async delete(idProduct: number): Promise<void> {
        await db.query(`
            DELETE FROM products
            WHERE id = $1
            `, [
            idProduct
        ])
    }


    async search(name: string, category_id?: number) {
        let queryBuilder = `
           WITH product_data AS (
            SELECT * FROM products 
            WHERE (name ILIKE '%${name}%' OR description ILIKE '%${name}%') 
        `;

        if (category_id) {
            queryBuilder = `
                ${queryBuilder}
                AND category_id = ${category_id})
            `
        }
        if (!category_id) {
            queryBuilder = `
                ${queryBuilder})
                
            `
        }
        queryBuilder =
            `
        ${queryBuilder}
        SELECT 
            product_data.id,
            product_data.name,
            product_data.category_id,
            product_data.user_id,
            product_data.description,
            product_data.old_price,
            product_data.price,
            product_data.quantity,
            product_data.status,
            product_data.created_at,
            product_data.updated_at,
        (
            SELECT COUNT(*) FROM 
            product_data
        ) AS total_count,
          categories.name AS category_name 
        FROM product_data
        LEFT JOIN categories ON (categories.id = product_data.category_id)
        `
        const producstsOutPut = await db.query<ProductOutPut>(queryBuilder)
        const products = producstsOutPut.rows.map(productOut => {
            const product = new Product(
                productOut.id,
                productOut.category_id,
                productOut.user_id,
                productOut.name,
                productOut.price,
                productOut.quantity,
                productOut.status,
                productOut.description,
                productOut.old_price
            )

            product.setCreatedAt(new Date(productOut.created_at))
            product.setUpdatedAt(new Date(productOut.updated_at))
            product.setCategoryName(productOut.category_name as string)

            return product
        })

        if (products.length > 0) {
            return {
                products,
                total_count: parseInt(producstsOutPut.rows[0]['total_count'] as string)
            }
        }
        return {
            products: [],
            total_count: 0
        }
    }

}