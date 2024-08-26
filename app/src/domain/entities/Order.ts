export class Order {
    id?: number;
    sellerId: number;
    buyerId: number;
    productId: number;
    price: number;
    quantity: number;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        sellerId: number,
        buyerId: number,
        productId: number,
        price: number,
        quantity: number,
        total: number,
        status: string
    ) {

        this.sellerId = sellerId;
        this.buyerId = buyerId;
        this.productId = productId;
        this.price = price;
        this.quantity = quantity || 0;
        this.total = total;
        this.status = status;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    updateStatus(newStatus: string): void {
        this.status = newStatus;
        this.updatedAt = new Date();
    }

    updateOrderDetails(quantity: number, total: number): void {
        this.quantity = quantity;
        this.total = total;
        this.updatedAt = new Date();
    }
}
