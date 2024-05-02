import {
  ConcertEventDetails,
  SeatDetails,
} from '../entities/concert-event-details';
import { PrismaTxType } from '../../../database/prisma/prisma.type';

export const IConcertDetailsReaderToken = Symbol('IConcertDetailsReader');

export interface IConcertDetailsReader {
  getUpcomingConcertEventDetails(
    concertId: number,
  ): Promise<ConcertEventDetails[]>;
  getConcertEventDetails(
    concertEventId: number,
  ): Promise<ConcertEventDetails | null>;
  findSeatBySeatId(
    seatId: number,
    tx?: PrismaTxType,
  ): Promise<SeatDetails | null>;
}
