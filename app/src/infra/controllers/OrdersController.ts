
import { ProductFacade } from "../../application/facades/ProductFacade";
import { getFormatItems } from "../../domain/entities/Cart";
import { Order } from "../../domain/entities/Order";
import { FileProductService } from "../../services/FileProductService";
import { OrderService } from "../../services/OrderService";
import { ProductService } from "../../services/ProductService";
import { StorageService } from "../../services/StorageService";
import { Status, StatusOrders } from "../../services/types";
import { UserService } from "../../services/UserService";
import { Http } from "../http/ExpressAdapter";

export class OrdersController {
    public productFacade: ProductFacade
    constructor(
        public http: Http,
        orderService: OrderService,
        userService: UserService,
        storageService: StorageService,
        fileProductService: FileProductService,
        productService: ProductService
    ) {
        this.productFacade = new ProductFacade(productService, fileProductService, storageService)
        this.addStoreRender(http, orderService, userService)
    }


    addStoreRender(http: Http, orderService: OrderService, userService: UserService,) {


        http.route('get', '/orders/status', async (params: any, body: any, files: any, query: any, session: any) => {

            if (session.animationError) {
                const currentError = session.animationError
                delete session.animationError
                return { animationError: currentError };
            }

            if (session.animationSuccess) {
                const success = session.animationSuccess

                delete session.animationSuccess

                return { animationSuccess: success };
            }

            const user = session.user
            const ordersSeller = await orderService.getOrdersBySeller(user.id)

            const orders = Promise.all(
                ordersSeller.map(async order => {
                    const product = await this.productFacade.productsDetails(user.id)
                    const bueyr = await userService.getUserById(user.id)
                    const status = Status[order.status]
                    return {
                        bueyr,
                        product,
                        status
                    }
                })


            )

            return {
                orders
            }
        }, 'orders/status.njk')

        http.route('get', '/orders/', async (params: any, body: any, files: any, query: any, session: any) => {

            try {
                const user = session.user
                const ordersSeller = await orderService.getOrdersBySeller(user.id)

                const orders = await Promise.all(
                    ordersSeller.map(async order => {

                        const product = await this.productFacade.productsDetailsByProductId(order.productId)
                        const bueyr = await userService.getUserById(order.buyerId)
                        const status = Status[order.status]
                        return {
                            ...order,
                            bueyr,
                            product,
                            status: order.status,
                            formattedStatus: status,
                            quantity: order.quantity
                        }
                    })


                )
                if (session.error) {
                    const currentError = session.error
                    delete session.error
                    return { error: currentError, orders };
                }

                if (session.success) {
                    const success = session.success

                    delete session.success

                    return { success, orders };
                }
                return {
                    orders
                }
            } catch (error) {

            }

        }, 'orders/index.njk')

        http.route('get', '/orders/sales', async (params: any, body: any, files: any, query: any, session: any) => {

            try {
                const user = session.user
                const ordersSeller = await orderService.getOrderByBuyer(user.id)

                const orders = await Promise.all(
                    ordersSeller.map(async order => {

                        const product = await this.productFacade.productsDetailsByProductId(order.productId)
                        const bueyr = await userService.getUserById(order.buyerId)
                        const status = Status[order.status]
                        return {
                            bueyr,
                            product,
                            status,
                            quantity: order.quantity
                        }
                    })


                )



                return {
                    orders
                }
            } catch (error) {

            }

        }, 'orders/index.njk')

        http.route('get', '/orders/:id', async (params: any, body: any, files: any, query: any, session: any) => {

            try {

                const user = session.user

                const ordersSeller = await orderService.getOrdersBySeller(user.id)
                const orderId = parseInt(params.id)

                const orders = await Promise.all(
                    ordersSeller.map(async order => {

                        const product = await this.productFacade.productsDetailsByProductId(order.productId)
                        const bueyr = await userService.getUserById(order.buyerId)
                        const status = Status[order.status]
                        return {
                            ...order,
                            bueyr,
                            product,
                            status: order.status,
                            formattedStatus: status,
                            quantity: order.quantity
                        }
                    })


                )
                const order = orders.find(order => order.id === orderId)

                return {
                    order
                }
            } catch (error) {

            }

        }, 'orders/details.njk')

        http.route('post', '/orders', async (params: any, body: any, files: any, query: any, session: any) => {

            try {

                const products = getFormatItems(session.cart) as Array<any>
                const user = session.user

                const orders = products.map(({ product, quantity }) => {

                    return new Order
                        (
                            product.userId,
                            user.id,
                            product.id,
                            product.price,
                            quantity,
                            product.price * quantity,
                            StatusOrders.open
                        )
                })


                const saveOrders = orders.map(async order => {

                    return await orderService.saveOrder(order)
                })


                await Promise.all(saveOrders)
                session.animationSuccess = {
                    message: "Pedido efetuado com sucesso!"
                }
                delete session.cart
                return {
                    url_redirect: `/orders/status`
                }

            } catch (error) {
                console.log(error)
                session.animationError = {
                    message: "Houve um erro ao gerar o pedido, por favor tente mais tarde!"
                }

                return {
                    url_redirect: `/orders/status`
                }
            }

        }, 'orders/index.njk', true)

        http.route('put', '/orders', async (params: any, body: any, files: any, query: any, session: any) => {
            const orderId = parseInt(body.orderId)
            const status = parseInt(body.status)
            try {
                const user = session.user

                const ordersSeller = await orderService.getOrdersBySeller(user.id)


                const acceptedActions = ['close', 'sold']

                const orders = await Promise.all(
                    ordersSeller.map(async order => {

                        const product = await this.productFacade.productsDetailsByProductId(order.productId)
                        const bueyr = await userService.getUserById(order.buyerId)
                        const status = Status[order.status]
                        return {
                            ...order,
                            bueyr,
                            product,
                            status: order.status,
                            formattedStatus: status,
                            quantity: order.quantity
                        }
                    })


                )

                const order = orders.find(order => order.id === orderId)


                const orderUpdate = new Order(
                    order?.sellerId as number,
                    order?.buyerId as number,
                    order?.productId as number,
                    order?.price as number,
                    order?.quantity as number,
                    order?.total as number,
                    acceptedActions[status]
                )

                orderUpdate.setId(order?.id as number)

                await orderService.updateStatus(orderUpdate)

                session.success = {
                    message: "Status atualizado com sucesso"
                }


                return {
                    url_redirect: `/orders`
                }
            } catch (error) {
                session.error = {
                    message: "Houve um erro ao atualizar o status"
                }

                return {
                    url_redirect: `/orders`
                }
            }

        }, 'orders/index.njk', true)
    }
}