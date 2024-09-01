import { Order } from "../domain/entities/Order";
import { OrderRepository } from "../domain/repositories/OrderRepository";



export class OrderService {
    orderRepository: OrderRepository

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository
    }

    async saveOrder(order: Order) {
        await this.orderRepository.save(order)
    }


    async getOrdersBySeller(seller_id: number) {
        return this.orderRepository.getOrderBySellerId(seller_id)
    }

    async getOrderByBuyer(buyer_id: number) {
        return this.orderRepository.getOrderByBuyerId(buyer_id)
    }

    async updateStatus(order: Order) {
        await this.orderRepository.update(order)
    }
}