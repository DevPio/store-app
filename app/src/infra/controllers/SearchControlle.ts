import { CategoryService } from "../../services/CategoryService";
import { FileProductService } from "../../services/FileProductService";
import { ProductService } from "../../services/ProductService";
import { StorageService } from "../../services/StorageService";
import { ProductInput } from "../../services/types";
import { Http } from "../http/ExpressAdapter";

export class SearchController {
    constructor(http: Http, productService: ProductService, categoryService: CategoryService, storageService: StorageService, fileProductService: FileProductService) {
        this.addStoreRender(http, productService, categoryService, storageService, fileProductService)
    }

    addStoreRender(http: Http, productService: ProductService, categoryService: CategoryService, storageService: StorageService, fileProductService: FileProductService) {
        http.route('get', '/search', async (params: any, body: ProductInput, files: any, query: any) => {
            const categories = await categoryService.getCategories()
            const categoryId = categories.find(category => category.name === query.category_id)
            const { products, total_count } = await productService.searchProduct(query.search, categoryId ? categoryId.id : undefined)
            const categoriesSet = new Set()

            const productWithDefaultImage = await Promise.all(products.map(async product => {
                categoriesSet.add(product.categoryName)
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
                products: productWithDefaultImage,
                total_count,
                search: query.search,
                categories: [...categoriesSet.values()]
            };

        }, 'search/index')
    }
}