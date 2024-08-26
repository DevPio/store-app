import { FileArray, UploadedFile } from "express-fileupload";
import { CategoryService } from "../../services/CategoryService";
import { FileProductService } from "../../services/FileProductService";
import { ProductService } from "../../services/ProductService";
import { StorageService } from "../../services/StorageService";
import { ProductInput, UserInput } from "../../services/types";
import { UserService } from "../../services/UserService";
import { Http } from "../http/ExpressAdapter";
import { FileProduct } from "../../domain/entities/File";
import { redirectLogin } from "../middlewares/redirectLogin";



export class ProductController {

    constructor(
        http: Http,
        productService: ProductService,
        categoryService: CategoryService,
        storageService: StorageService,
        fileProductService: FileProductService,
        userService: UserService
    ) {
        this.addStoreRender(http, productService, categoryService, storageService, fileProductService, userService)
    }

    addStoreRender(http: Http, productService: ProductService, categoryService: CategoryService, storageService: StorageService, fileProductService: FileProductService, userService: UserService) {
        http.route('post', '/products', async (params: any, body: ProductInput, files: FileArray) => {

            const product = await productService.saveProject(body)
            const allFiles = files.images as Array<UploadedFile>
            const filesName = await Promise.all(allFiles.map(async file => await storageService.uploadFile(`${Date.now()}-${file.name}`, file.data)))
            await Promise.all(filesName.map(fileName => new FileProduct(fileName, fileName, product.id)).map(async file => {
                await fileProductService.saveFile(file)
            }))

            return { url_redirect: `/products/show/${product.id}` };
        }, 'products/create', true)

        http.route('get', '/ads/create', async (params: any, body: any) => {
            const categories = await categoryService.getCategories()
            return { categories };
        }, 'products/create', false, redirectLogin)

        http.route('get', '/ads', async (params: any, body: UserInput, files: any, query: any, session: any) => {

            if (session.error) {
                const currentError = session.error
                delete session.error
                return { error: currentError };
            }

            if (session.success) {
                const success = session.success

                delete session.success

                return { success };
            }

            const products = await productService.getProductByUser(session.user.id)

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
                products: productWithDefaultImage,

            };

        }, 'user/ads.njk')

        http.route('get', '/products/:productId', async (params: any, body: ProductInput) => {
            const product = await productService.getProduct(params.productId)

            const categories = await categoryService.getCategories()

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



            return { product, categories, update: true, files: downloadFiles, rows: product.description?.split('\n').length }
        }, 'products/create')

        http.route('get', '/products/show/:productId', async (params: any, body: ProductInput, _: any, query: any, session: any) => {
            const product = await productService.getProduct(params.productId)

            // const categories = await categoryService.getCategories()

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
                user: session.user,
                product: {
                    ...product,
                    description: product.description?.split('\n\r'),
                    createdAt: Intl.DateTimeFormat("pt-BR", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "America/Sao_Paulo"
                    }).format(product.createdAt),
                    updatedAt: Intl.DateTimeFormat("pt-BR", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "America/Sao_Paulo"
                    }).format(product.updatedAt),
                    oldPrice: Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format((product.oldPrice as number) / 100),
                    price: Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format((product.price as number) / 100)
                },
                defaultImage: downloadFiles.at(0),
                images: downloadFiles


            }
        }, 'products/show')

        http.route('delete', '/products', async (params: any, body: ProductInput) => {

            await productService.deleteProduct(body.id as number);

            return { url_redirect: 'products/create' };
        }, 'products/create', true)
        http.route('put', '/products', async (params: any, { category_id, description, name, price, quantity, status, id, filesDelete }: ProductInput, files: FileArray) => {

            const categories = await categoryService.getCategories()
            const productInput: ProductInput = {
                id: id,
                category_id,
                description,
                name,
                price,
                quantity,
                status
            }

            const idDeleteFile = filesDelete?.split(',').filter(Boolean)

            if (idDeleteFile && idDeleteFile.length > 0) {
                await Promise.all(idDeleteFile.map(idFile => fileProductService.deleFile(parseInt(idFile))))
            }
            if (files && files.images) {
                let allFiles = files.images as Array<UploadedFile>

                if (!Array.isArray(files.images)) {
                    allFiles = [files.images]
                }
                const filesName = await Promise.all(allFiles.map(async file => await storageService.uploadFile(`${Date.now()}-${file.name}`, file.data)))
                await Promise.all(filesName.map(fileName => new FileProduct(fileName, fileName, id as number)).map(async file => {
                    await fileProductService.saveFile(file)
                }))
            }

            const updateProduct = await productService.updateProduct(productInput)

            const returnObj = { product: updateProduct, categories, url_redirect: `/products/show/${id}` };

            return returnObj
        }, '', true)
    }
}