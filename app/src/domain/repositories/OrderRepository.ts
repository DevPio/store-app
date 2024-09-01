import { Order } from "../entities/Order";


export interface OrderRepository {

    getAll(): Promise<Order[]>;
    get(idOrder: number): Promise<Order>;
    save(order: Order): Promise<void>;
    update(order: Order): Promise<void>;
    delte(idOrder: number): Promise<void>;
    getOrderByBuyerId(buyer_id: number): Promise<Order[]>
    getOrderBySellerId(seller_id: number): Promise<Order[]>
}