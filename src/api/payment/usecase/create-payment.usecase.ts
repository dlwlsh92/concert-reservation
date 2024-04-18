import { Injectable } from "@nestjs/common";
import { PaymentValidationService } from "../../../domain/reservations/application/payment-validation.service";
import { PointService } from "../../../domain/points/application/point.service";
import { OrderService } from "../../../domain/payment/application/order.service";

@Injectable()
export class CreatePaymentUsecase {
  constructor(
    private readonly paymentValidationService: PaymentValidationService,
    private readonly pointService: PointService,
    private readonly orderService: OrderService
  ) {}

  async execute(reservationId: number) {
    const reservation =
      await this.paymentValidationService.validateReservationForPayment(
        reservationId
      );
    const userId = reservation.userId;
    const price = reservation.price;
    await this.pointService.subtractPoints(userId, price);
    return this.orderService.createOrder(userId, reservationId, price);
  }
}
