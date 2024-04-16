import { HttpException, Inject, Injectable } from "@nestjs/common";
import {
  IOrder,
  IOrderRepositoryToken,
} from "../domain/interfaces/order.interface";
import {
  PaymentEligibilityStatus,
  ReservationValidator,
} from "../domain/reservation-validator";
import { IPaymentReservationToken } from "../domain/interfaces/payment-reservation.interface";
import { PaymentReservationRepository } from "../infrastructure/persistence/payment-reservation.repository";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(IOrderRepositoryToken)
    private readonly orderRepository: IOrder,
    @Inject(IPaymentReservationToken)
    private readonly reservationDetailsRepository: PaymentReservationRepository
  ) {}

  async payReservation(reservationId: number): Promise<boolean> {
    // TODO: Implement this method
    // const reservation =
    //   await this.validationReservationService.validateReservation(
    //     reservationId
    //   );
    // TODO: point 정보 불러와서 잔액 검증하고 결제하는 코드 추가

    return true;
  }

  async validateReservation(
    reservationId: number
  ): Promise<ReservationValidator> {
    const reservation =
      await this.reservationDetailsRepository.getReservationForPayment(
        reservationId
      );
    const paymentEligibleStatus = reservation.isPaymentEligible();
    switch (paymentEligibleStatus) {
      case PaymentEligibilityStatus.ReservationExpired:
        throw new HttpException("Reservation expired", 410);
      case PaymentEligibilityStatus.ReservationConfirmed:
        throw new HttpException("Reservation already confirmed", 409);
      case PaymentEligibilityStatus.SeatExpired:
        throw new HttpException("Seat expired", 403);
      default:
        return reservation;
    }
  }
}
