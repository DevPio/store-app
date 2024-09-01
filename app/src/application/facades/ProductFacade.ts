import { FileProductService } from "../../services/FileProductService";
import { ProductService } from "../../services/ProductService";
import { StorageService } from "../../services/StorageService";


export class ProductFacade {
    constructor(public productService: ProductService, public fileProductService: FileProductService, public storageService: StorageService) {
        this.productService = productService
        this.fileProductService = fileProductService
        this.storageService = storageService
    }


    async productsDetails(userId: number) {
        const products = await this.productService.getProductByUser(userId)

        const productWithDefaultImage = await Promise.all(products.map(async product => {
            const files = await this.fileProductService.getFileByProduct(product.id)

            const downloadFiles = await Promise.all(files.map(async file => {
                const mimeType = file.path.split('.')[1]
                const blobFile = await this.storageService.downloadFile(file.name, `image/${mimeType}`)

                return {
                    id: file.id,
                    name: file.name,
                    url: blobFile
                }
            }))

            return {
                ...product,
                defaultImage: {
                    src: downloadFiles.at(0)?.url,
                    name: downloadFiles.at(0)?.name
                },
                price: Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(product.price / 100)
            }
        }))


        return productWithDefaultImage
    }


    async productsDetailsByProductId(product_id: number) {
        const product = await this.productService.getProduct(product_id)

        const files = await this.fileProductService.getFileByProduct(product.id)

        const downloadFiles = await Promise.all(files.map(async file => {
            const mimeType = file.path.split('.')[1]
            const blobFile = await this.storageService.downloadFile(file.name, `image/${mimeType}`)

            return {
                id: file.id,
                name: file.name,
                url: blobFile
            }
        }))

        return {
            ...product,
            defaultImage: {
                src: downloadFiles.at(0)?.url,
                name: downloadFiles.at(0)?.name
            },
            price: Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(product.price / 100)
        }
    }
}