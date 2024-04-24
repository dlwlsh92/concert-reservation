import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../entities/order';
import {
  IOrderRepositoryToken,
  IOrderWriteRepository,
} from '../repositories/order-write.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject(IOrderRepositoryToken)
    private readonly orderRepository: IOrderWriteRepository
  ) {}

  async createOrder(
    userId: number,
    reservationId: number,
    totalPrice: number
  ): Promise<Order> {
    return this.orderRepository.createOrder(
      userId,
      reservationId,
      totalPrice,
      new Date()
    );
  }
}
