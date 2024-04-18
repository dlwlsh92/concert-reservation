import { HttpException, Inject, Injectable } from "@nestjs/common";
import {
  IReservationReaderRepository,
  IReservationReaderRepositoryToken,
} from "../repositories/reservation-reader.interface";
import { PaymentEligibilityStatus } from "../entities/reservation";

@Injectable()
export class PaymentValidationService {
  constructor(
    @Inject(IReservationReaderRepositoryToken)
    private readonly reservationReaderRepository: IReservationReaderRepository
  ) {}

  async validateReservationForPayment(reservationId: number) {
    const reservation =
      await this.reservationReaderRepository.findReservationById(reservationId);
    if (reservation === null) {
      throw new HttpException("예약이 존재하지 않습니다.", 404);
    }
    const paymentEligibleStatus = reservation.isPaymentEligible();
    switch (paymentEligibleStatus) {
      case PaymentEligibilityStatus.ReservationExpired:
        throw new HttpException("Reservation expired", 410);
      case PaymentEligibilityStatus.ReservationConfirmed:
        throw new HttpException("Reservation already confirmed", 409);
      default:
        return reservation;
    }
  }
}
