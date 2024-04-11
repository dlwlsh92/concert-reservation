import { HttpException, Inject, Injectable } from "@nestjs/common";
import {
  IReservationDetails,
  IReservationDetailsRepositoryToken,
} from "../domain/interfaces/reservation-details.interface";
import { PaymentEligibilityStatus, Reservation } from "../domain/reservation";

@Injectable()
export class ValidationReservationService {
  constructor(
    @Inject(IReservationDetailsRepositoryToken)
    private readonly reservationDetailsRepository: IReservationDetails
  ) {}

  async validateReservation(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationDetailsRepository.getReservation(
      reservationId
    );
    const paymentEligibleStatus = reservation.isPaymentEligible();
    switch (paymentEligibleStatus) {
      case PaymentEligibilityStatus.ReservationExpired:
        throw new HttpException("Reservation expired", 410);
      case PaymentEligibilityStatus.ReservationConfirmed:
        throw new HttpException("Reservation already confirmed", 409);
      case PaymentEligibilityStatus.SeatNotReserved:
        throw new HttpException("Seat not reserved", 403);
      default:
        return reservation;
    }
  }
}
