import { Injectable } from "@nestjs/common";
import { IConcertDetailsReader } from "../../repositories/concert-details-reader.interface";
import {
  ConcertEventDetails,
  SeatDetails,
} from "../../entities/concert-event-details";
import { PrismaTxType } from "../../../../database/prisma/prisma.type";
import { PrismaService } from "../../../../database/prisma/prisma.service";

@Injectable()
export class ConcertDetailsReaderRepository implements IConcertDetailsReader {
  constructor(private readonly prisma: PrismaService) {}

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
    return new ConcertEventDetails(1, 1, new Date(), new Date(), 40, []);
  }

  async findSeatBySeatIdWithLock(
    seatId: number,
    tx?: PrismaTxType
  ): Promise<SeatDetails | null> {
    const result: SeatDetails[] = await (tx ?? this.prisma)
      .$queryRaw`SELECT * FROM "Seat" WHERE id = ${seatId} FOR UPDATE`;
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }
}
