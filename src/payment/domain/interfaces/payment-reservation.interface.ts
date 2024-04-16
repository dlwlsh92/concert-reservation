import { ReservationValidator } from "../reservation-validator";

export const IPaymentReservationToken = Symbol("IPaymentReservation");

export interface IPaymentReservation {
  getReservationForPayment(
    reservationId: number
  ): Promise<ReservationValidator>;
}
