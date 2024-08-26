import { Product } from "./Product";


export class Cart {
    items = {};
    total = 0
    totalItems = 0;
    constructor() {
        this.items = new Map()
    }

    countTotal() {
        this.total = 0;
        this.totalItems = Object.keys(this.items).length
        for (const productKey in this.items) {
            const totalItems = this.items[productKey]?.quantity
            const product = this.items[productKey].product
            const productPrice = product.price as number
            this.total += totalItems * productPrice
            this.totalItems += totalItems
        }
    }
    add(id: string, product: Product) {

        if (!this.items[id]) {
            this.items[id] = {
                product,
                quantity: 1
            }
            return this.countTotal()
        }
        const getProduct = this.items[id]

        getProduct.quantity++

        return this.countTotal()
    }

    remove(id: string) {
        const products = this.items[id]

        if (products?.quantity <= 1) {
            delete this.items[id]
            return this.countTotal()
        }

        const getProduct = this.items[id]

        getProduct.quantity--

        return this.countTotal()
    }

    delete(id) {
        delete this.items[id]
        return this.countTotal()
    }
}


export const countTotal = (cart: Cart) => {
    let total = 0
    for (const key in cart.items) {
        const product = cart.items[key]
        total += product.quantity
    }

    return total
}

export const getFormatItems = (cart: Cart) => {

    const productsResult: Array<any> = []


    for (const key in cart.items) {
        const products = cart.items[key] as Array<any>

        productsResult.push(products)
    }


    return productsResult
}