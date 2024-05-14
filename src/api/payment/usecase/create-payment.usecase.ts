import { Injectable } from '@nestjs/common';
import { PaymentValidationService } from '../../../domain/reservations/application/payment-validation.service';
import { PointService } from '../../../domain/points/application/point.service';
import { OrderService } from '../../../domain/payment/application/order.service';
import { ReservationService } from '../../../domain/reservations/application/reservation.service';
import { DataplatformService } from '../../../infrastructure/external/dataplatform/dataplatform.service';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class CreatePaymentUsecase {
  constructor(
    private readonly paymentValidationService: PaymentValidationService,
    private readonly pointService: PointService,
    private readonly orderService: OrderService,
    private readonly reservationService: ReservationService,
    private readonly dataplatformService: DataplatformService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(reservationId: number) {
    const reservation =
      await this.paymentValidationService.validateReservationForPayment(
        reservationId,
      );

    const { order, seatDetails } = await this.prisma.$transaction(
      async (tx) => {
        const userId = reservation.userId;
        const price = reservation.price;
        await this.pointService.subtractPoints(userId, price, tx);

        const seatDetails = await this.reservationService.updateSeatPaidStatus(
          reservation.seatId,
          true,
          tx,
        );

        const order = await this.orderService.createOrder(
          userId,
          reservationId,
          price,
          tx,
        );

        await this.dataplatformService.sendPaymentData(order, seatDetails);
        return { order, seatDetails };
      },
    );
    return order;
  }
}
