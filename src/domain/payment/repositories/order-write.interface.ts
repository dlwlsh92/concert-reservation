import { Order } from "../entities/order";

export const IOrderRepositoryToken = Symbol("IOrderRepository");

export interface IOrderWriteRepository {
  createOrder(
    userId: number,
    reservationId: number,
    totalPrice: number,
    orderDate: Date
  ): Promise<Order>;
}
