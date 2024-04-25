import { Injectable } from '@nestjs/common';
import { IOrderWriteRepository } from '../../../domain/payment/repositories/order-write.interface';
import { Order } from '../../../domain/payment/entities/order';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class OrderWriteRepository implements IOrderWriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    userId: number,
    reservationId: number,
    totalPrice: number,
    orderDate: Date
  ): Promise<Order> {
    return this.prisma.order.create({
      data: {
        userId: userId,
        reservationId: reservationId,
        totalPrice: totalPrice,
        orderDate: orderDate,
      },
    });
  }
}
