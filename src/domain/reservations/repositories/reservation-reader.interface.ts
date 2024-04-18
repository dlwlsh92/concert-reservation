import { Reservation } from "../entities/reservation";

export const IReservationReaderRepositoryToken = Symbol(
  "IReservationReaderRepository"
);

export interface IReservationReaderRepository {
  findReservationById(reservationId: number): Promise<Reservation | null>;
}
