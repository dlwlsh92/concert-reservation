import { Order } from '../entities/order';
import { PrismaTxType } from '../../../database/prisma/prisma.type';

export const IOrderRepositoryToken = Symbol('IOrderRepository');

export interface IOrderWriteRepository {
  createOrder(
    userId: number,
    reservationId: number,
    totalPrice: number,
    orderDate: Date,
    tx?: PrismaTxType,
  ): Promise<Order>;
}
