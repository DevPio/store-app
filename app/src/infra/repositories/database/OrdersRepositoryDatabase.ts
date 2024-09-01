import { Order } from "../../../domain/entities/Order";
import { OrderRepository } from "../../../domain/repositories/OrderRepository";
import { OrderOutPut } from "../../../services/types";
import { db } from "../../database/db";





export class OrderRepositoryDatabase implements OrderRepository {
    getAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }

    async getOrderBySellerId(seller_id: number) {
        const getOrder = await db.query<OrderOutPut>('SELECT * FROM "Orders" WHERE seller_id = $1', [seller_id])

        const orders = getOrder.rows.map(order => {
            const orderInstance = new Order(
                order.seller_id,
                order.buyer_id,
                order.product_id,
                order.price,
                order.quantity,
                order.total,
                order.status
            )

            orderInstance.id = order.id
            return orderInstance
        })

        return orders
    }

    async getOrderByBuyerId(buyer_id: number) {
        const getOrder = await db.query<OrderOutPut>('SELECT * FROM "Orders" WHERE buyer_id = $1', [buyer_id])

        const orders = getOrder.rows.map(order => {
            return new Order(
                order.seller_id,
                order.buyer_id,
                order.product_id,
                order.price,
                order.quantity,
                order.total,
                order.status
            )
        })

        return orders
    }


    async get(idOrder: number): Promise<Order> {
        const getOrder = await db.query<OrderOutPut>('SELECT * FROM "Orders" WHERE id = $1', [idOrder])

        const order = getOrder.rows[0]
        return new Order(
            order.seller_id,
            order.buyer_id,
            order.product_id,
            order.price,
            order.quantity,
            order.total,
            order.status
        )
    }
    async save(order: Order): Promise<void> {
        const { rows } = await db.query(`
            INSERT INTO "Orders" 
            (
                seller_id,
                buyer_id,
                product_id,
                price,
                quantity,
                total,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            )
            RETURNING *
        `,
            [
                order.sellerId,
                order.buyerId,
                order.productId,
                order.price,
                order.quantity,
                order.total,
                order.status
            ]
        )

        return rows[0]
    }
    async update(order: Order): Promise<void> {
        await db.query<OrderOutPut>(`
            UPDATE "Orders" 
            
            SET status = $1
            
            WHERE id = $2

            RETURNING *
        `,
            [
                order.status,
                order.id,

            ]

        )

    }
    delte(idOrder: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

} 