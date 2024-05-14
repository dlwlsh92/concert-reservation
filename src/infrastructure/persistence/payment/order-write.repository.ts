import { Injectable } from '@nestjs/common';
import { IOrderWriteRepository } from '../../../domain/payment/repositories/order-write.interface';
import { Order } from '../../../domain/payment/entities/order';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PrismaTxType } from '../../../database/prisma/prisma.type';

@Injectable()
export class OrderWriteRepository implements IOrderWriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    userId: number,
    reservationId: number,
    totalPrice: number,
    orderDate: Date,
    tx?: PrismaTxType,
  ): Promise<Order> {
    return (tx ?? this.prisma).order.create({
      data: {
        userId: userId,
        reservationId: reservationId,
        totalPrice: totalPrice,
        orderDate: orderDate,
      },
    });
  }
}
