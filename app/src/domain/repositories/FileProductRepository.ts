import { FileProduct } from "../entities/File";

export interface FileProductRepository {
    getByIdProductId(idProduct: number): Promise<FileProduct[]>;
    save(file: FileProduct): Promise<number>;
    delete(idFile: number): Promise<void>;
    deleteByProductId(idProduct: number): Promise<void>;

}