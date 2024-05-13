import { Injectable } from '@nestjs/common';
import { PaymentValidationService } from '../../../domain/reservations/application/payment-validation.service';
import { PointService } from '../../../domain/points/application/point.service';
import { OrderService } from '../../../domain/payment/application/order.service';
import { ReservationService } from '../../../domain/reservations/application/reservation.service';
import { DataplatformService } from '../../../infrastructure/external/dataplatform/dataplatform.service';

@Injectable()
export class CreatePaymentUsecase {
  constructor(
    private readonly paymentValidationService: PaymentValidationService,
    private readonly pointService: PointService,
    private readonly orderService: OrderService,
    private readonly reservationService: ReservationService,
    private readonly dataplatformService: DataplatformService,
  ) {}

  async execute(reservationId: number) {
    const reservation =
      await this.paymentValidationService.validateReservationForPayment(
        reservationId,
      );
    const userId = reservation.userId;
    const price = reservation.price;
    await this.pointService.subtractPoints(userId, price);

    // 좌석 확정 처리
    const seatDetails = await this.reservationService.updateSeatPaidStatus(
      reservation.seatId,
      true,
    );
    const order = await this.orderService.createOrder(
      userId,
      reservationId,
      price,
    );
    await this.dataplatformService.sendPaymentData(order, seatDetails);
    return order;
  }
}
