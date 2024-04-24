import { SeatDetails } from '../entities/concert-event-details';
import { PrismaTxType } from '../../../database/prisma/prisma.type';
import { Reservation } from '../entities/reservation';

export const IReservationWriteToken = Symbol('IReservationWrite');

export interface IReservationWrite {
  reserveSeat(
    seatId: number,
    reservationExpirationDate: Date,
    tx?: PrismaTxType
  ): Promise<SeatDetails | null>;
  createReservation(
    reservation: Reservation,
    tx?: PrismaTxType
  ): Promise<Reservation>;
  updateSeatPaidStatus(
    seatId: number,
    isPaid: boolean,
    tx?: PrismaTxType
  ): Promise<SeatDetails>;
}
