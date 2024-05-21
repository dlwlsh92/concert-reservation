import { SeatDetails } from '../entities/concert-event-details';
import { PrismaTxType } from '../../../database/prisma/prisma.type';
import { Reservation } from '../entities/reservation';

export const IReservationWriteToken = Symbol('IReservationWrite');

export interface IReservationWrite {
  reserveSeatWithVersion(
    seatId: number,
    reservationExpirationDate: Date,
    version: number,
    tx?: PrismaTxType,
  ): Promise<SeatDetails>;
  createReservation(
    reservation: Reservation,
    tx?: PrismaTxType,
  ): Promise<Reservation>;
  updateSeatPaidStatus(
    seatId: number,
    isPaid: boolean,
    tx?: PrismaTxType,
  ): Promise<SeatDetails>;
  updateReservationStatus(
    reservationId: number,
    status: string,
    tx?: PrismaTxType,
  ): Promise<Reservation>;
}
