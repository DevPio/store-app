import { Order } from "../entities/Order";


export interface OrderRepository {
    getAll(): Promise<Order[]>;
    get(idOrder: number): Promise<Order>;
    save(order: Order): Promise<Order>;
    update(order: Order): Promise<void>;
    delte(idOrder: number): Promise<void>;
}