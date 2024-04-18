import { Reservation } from "../reservation";

export const IReservationQueryRepositoryToken = Symbol(
  "IReservationQueryRepository"
);

export interface IReservationQueryRepository {
  findReservationById(reservationId: number): Promise<Reservation | null>;
}
