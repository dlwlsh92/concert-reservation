import { IPaymentReservation } from "../../domain/interfaces/payment-reservation.interface";
import { ReservationValidator } from "../../domain/reservation-validator";

export class PaymentReservationRepository implements IPaymentReservation {
  constructor() {}

  getReservationForPayment(
    reservationId: number
  ): Promise<ReservationValidator> {
    // TODO: Implement this method
    return new Promise((resolve) => {
      resolve(
        new ReservationValidator(
          1,
          1,
          1,
          1,
          new Date(),
          500,
          new Date(),
          "pending"
        )
      );
    });
  }
}
