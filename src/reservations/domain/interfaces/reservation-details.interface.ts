import { Reservation } from "../reservation";

export const IReservationDetailsRepositoryToken = Symbol(
  "IReservationDetailsRepository"
);

export interface IReservationDetails {
  getReservation(reservationId: number): Promise<Reservation>;
}
