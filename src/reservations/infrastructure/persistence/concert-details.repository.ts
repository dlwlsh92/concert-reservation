import { Injectable } from "@nestjs/common";
import { IConcertDetails } from "../../domain/interfaces/concert-details.interface";
import { ConcertEventDetails } from "../../domain/concert-event-details";

@Injectable()
export class ConcertDetailsRepository implements IConcertDetails {
  constructor() {}

  async getUpcomingConcertEventDetails(
    concertId: number
  ): Promise<ConcertEventDetails[]> {
    // TODO: Implement this method
    return [];
  }

  async getConcertEventDetails(
    concertEventId: number
  ): Promise<ConcertEventDetails> {
    // TODO: Implement this method
    return new ConcertEventDetails(1, 1, new Date(), 40, []);
  }

  async reserveSeat(seatId: number, concertEventId: number): Promise<boolean> {
    // TODO: Implement this method
    return true;
  }
}
