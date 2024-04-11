import { Injectable } from "@nestjs/common";
import { IOrder, Order } from "../../domain/interfaces/order.interface";

@Injectable()
export class OrderRepository implements IOrder {
  constructor() {}

  async createOrder(orderId: number): Promise<Order> {
    // TODO: Implement this method
    return {
      id: 1,
      userId: 1,
      reservationId: 1,
      totalPrice: 100,
      orderDate: new Date(),
    };
  }
}
