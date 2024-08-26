import { Order } from "../../../domain/entities/Order";
import { OrderRepository } from "../../../domain/repositories/OrderRepository";
import { OrderOutPut } from "../../../services/types";
import { db } from "../../database/db";





export class OrderRepositoryDatabase implements OrderRepository {
    getAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    async get(idOrder: number): Promise<Order> {
        const getOrder = await db.query<OrderOutPut>('SELECT * FROM Ordes WHERE id = $1', [idOrder])

        const order = getOrder.rows[0]
        return new Order(
            order.sellerId,
            order.buyerId,
            order.productId,
            order.price,
            order.quantity,
            order.total,
            order.status
        )
    }
    save(order: Order): Promise<Order> {
        throw new Error("Method not implemented.");
    }
    update(order: Order): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delte(idOrder: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

} 