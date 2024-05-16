import { Injectable } from '@nestjs/common';
import { PaymentValidationService } from '../../../domain/reservations/application/payment-validation.service';
import { PointService } from '../../../domain/points/application/point.service';
import { OrderService } from '../../../domain/payment/application/order.service';
import { ReservationService } from '../../../domain/reservations/application/reservation.service';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PaymentEventPublisher } from '../../../domain/events/application/publisher/payment-event-publisher.service';

@Injectable()
export class CreatePaymentUsecase {
  constructor(
    private readonly paymentValidationService: PaymentValidationService,
    private readonly pointService: PointService,
    private readonly orderService: OrderService,
    private readonly reservationService: ReservationService,
    private readonly paymentEventPublisher: PaymentEventPublisher,
    private readonly prisma: PrismaService,
  ) {}

  async execute(reservationId: number) {
    const { order, seatDetails } = await this.prisma.$transaction(
      async (tx) => {
        const reservation =
          await this.paymentValidationService.validateReservationForPayment(
            reservationId,
          );
        const userId = reservation.userId;
        const price = reservation.price;
        await this.pointService.subtractPoints(userId, price, tx);

        const seatDetails = await this.reservationService.updateSeatPaidStatus(
          reservation.seatId,
          true,
          tx,
        );

        await this.reservationService.updateReservationStatus(
          reservationId,
          'confirmed',
          tx,
        );

        const order = await this.orderService.createOrder(
          userId,
          reservationId,
          price,
          tx,
        );
        return { order, seatDetails };
      },
    );
    this.paymentEventPublisher.success(order, seatDetails);
    return order;
  }
}
