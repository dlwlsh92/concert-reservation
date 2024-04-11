import { ConcertEventDetails } from "../concert-event-details";

export const IConcertDetailsToken = Symbol("IConcertDetails");

export interface IConcertDetails {
  getUpcomingConcertEventDetails(
    concertId: number
  ): Promise<ConcertEventDetails[]>;
  getConcertEventDetails(
    concertEventId: number
  ): Promise<ConcertEventDetails | null>;
  reserveSeat(seatId: number, concertEventId: number): Promise<boolean>;
}
