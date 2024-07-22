import { FileProduct } from "../domain/entities/File";
import { FileProductRepositoryDatabase } from "../infra/repositories/database/FileProductRepositoryDatabase";



export class FileProductService {
    fileProductRepositoryDatabase: FileProductRepositoryDatabase;
    constructor(fileProductRepositoryDatabase: FileProductRepositoryDatabase) {
        this.fileProductRepositoryDatabase = fileProductRepositoryDatabase
    }

    async saveFile(fileProduct: FileProduct) {
        return await this.fileProductRepositoryDatabase.save(fileProduct)
    }


    async getFileByProduct(idProduct: number) {
        return await this.fileProductRepositoryDatabase.getByIdProductId(idProduct)
    }


    async deleFile(id: number) {
        await this.fileProductRepositoryDatabase.delete(id)
    }
}