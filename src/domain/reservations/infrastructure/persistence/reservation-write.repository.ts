import { Injectable } from "@nestjs/common";
import { ReservationWrite } from "../../repositories/reservation-write.interface";
import { SeatDetails } from "../../entities/concert-event-details";

@Injectable()
export class ReservationWriteRepository implements ReservationWrite {
  constructor() {}
  async reserveSeat(seatId: number): Promise<SeatDetails | null> {
    return null;
  }
}
