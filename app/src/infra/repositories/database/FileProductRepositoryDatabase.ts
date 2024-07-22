import { FileProduct } from "../../../domain/entities/File";
import { FileProductRepository } from "../../../domain/repositories/FileProductRepository";
import { FileProductOutPut } from "../../../services/types";
import { db } from "../../database/db";


export class FileProductRepositoryDatabase implements FileProductRepository {

    async getByIdProductId(idProduct: number): Promise<FileProduct[]> {
        const getFiles = await db.query<FileProductOutPut>(`
                SELECT * FROM files WHERE product_id = $1
            `,
            [idProduct])

        return getFiles.rows.map(file => {
            const fileProduct = new FileProduct(file.name, file.path, file.product_id)

            fileProduct.setId(file.id)

            return fileProduct
        })
    }
    async save(file: FileProduct): Promise<number> {
        const fileOutPut = await db.query(`
            INSERT INTO files
            (
                name,
                path,
                product_id
            
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            RETURNING *
            `,
            [
                file.name,
                file.path,
                file.productId
            ]
        )

        return fileOutPut.rows[0].id
    }
    async delete(idFile: number): Promise<void> {
        await db.query(`DELETE FROM files WHERE id = $1`, [idFile])
    }

    async deleteByProductId(idProduct: number): Promise<void> {
        await db.query(`DELETE FROM files WHERE product_id = $1`, [idProduct])
    }

}