import { SeatDetails } from "../entities/concert-event-details";

export interface ReservationWrite {
  reserveSeat(seatId: number): Promise<SeatDetails | null>;
}
