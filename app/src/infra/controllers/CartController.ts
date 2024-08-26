import { Cart, getFormatItems } from "../../domain/entities/Cart";
import { CategoryService } from "../../services/CategoryService";
import { FileProductService } from "../../services/FileProductService";
import { ProductService } from "../../services/ProductService";
import { StorageService } from "../../services/StorageService";
import { UserInput } from "../../services/types";
import { UserService } from "../../services/UserService";
import { Http } from "../http/ExpressAdapter";


export class CartController {
    constructor(
        http: Http,
        productService: ProductService,
        storageService: StorageService,
        fileProductService: FileProductService,
    ) {
        this.addStoreRender(http, productService, storageService, fileProductService)
    }

    addStoreRender(http: Http, productService: ProductService, storageService: StorageService, fileProductService: FileProductService) {
        http.route('get', '/cart', async (params: any, body: UserInput, files: any, query: any, session: any) => {

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

            const cart = session.cart as Cart


            const products = await Promise.all(
                getFormatItems(cart).map(async ({ product, quantity }) => {


                    const productFiles = await fileProductService.getFileByProduct(product.id)

                    const downloadFiles = await Promise.all(productFiles.map(async file => {
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
                        quantity
                    }


                })
            )



            return { items: products };
        }, 'cart/index.njk')


        http.route('post', '/cart', async (params: any, body: any, _: any, query: any, session: any) => {


            const id = body.id

            const product = await productService.getProduct(id)

            const productFiles = await fileProductService.getFileByProduct(id)

            const downloadFiles = await Promise.all(productFiles.map(async file => {
                const mimeType = file.path.split('.')[1]
                const blobFile = await storageService.downloadFile(file.name, `image/${mimeType}`)

                return {
                    id: file.id,
                    name: file.name,
                    url: blobFile
                }
            }))


            const cart = new Cart()

            cart.items = session.cart.items

            cart.total = session.cart.total


            cart.add(id, product)
            session.cart = cart

            return {
                url_redirect: `/cart`
            }
        }, 'cart/index.njk', true)


        http.route('post', '/cart/add-one/', async (params: any, body: any, _: any, query: any, session: any) => {


            const id = body.id

            const product = await productService.getProduct(id)

            const cart = new Cart()


            cart.items = session.cart.items

            cart.total = session.cart.total


            cart.add(id, product)
            session.cart = cart

            return {
                url_redirect: `/cart`
            }
        }, 'cart/index.njk', true)

        http.route('post', '/cart/remove-one/', async (params: any, body: any, _: any, query: any, session: any) => {


            const id = body.id

            const cart = new Cart()


            cart.items = session.cart.items

            cart.total = session.cart.total


            cart.remove(id)

            session.cart = cart

            return {
                url_redirect: `/cart`
            }
        }, 'cart/index.njk', true)


        http.route('post', '/cart/delete/', async (params: any, body: any, _: any, query: any, session: any) => {


            const id = body.id

            const cart = new Cart()


            cart.items = session.cart.items

            cart.total = session.cart.total


            cart.delete(id)

            session.cart = cart

            return {
                url_redirect: `/cart`
            }
        }, 'cart/index.njk', true)
    }

}