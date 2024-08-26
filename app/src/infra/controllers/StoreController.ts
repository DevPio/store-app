import { CategoryService } from "../../services/CategoryService";
import { ProductService } from "../../services/ProductService";
import { Http } from "../http/ExpressAdapter";
import { StorageService } from "../../services/StorageService";
import { FileProductService } from "../../services/FileProductService";


export class StoreController {

    constructor(http: Http, productService: ProductService, categoryService: CategoryService, storageService: StorageService, fileProductService: FileProductService) {
        this.addStoreRender(http, productService, categoryService, storageService, fileProductService)
    }

    addStoreRender(http: Http, productService: ProductService, categoryService: CategoryService, storageService: StorageService, fileProductService: FileProductService) {
        http.route('get', '/', async (params: any, body: any, _: any, query: any, session: any) => {
            const products = await productService.getAllProducts()

            const productWithDefaultImage = await Promise.all(products.map(async product => {
                const files = await fileProductService.getFileByProduct(product.id)

                const downloadFiles = await Promise.all(files.map(async file => {
                    const mimeType = file.path.split('.')[1]
                    const blobFile = await storageService.downloadFile(file.name, `image/${mimeType}`)

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


            return {
                products: productWithDefaultImage

            };
        }, 'home/index')


    }
}