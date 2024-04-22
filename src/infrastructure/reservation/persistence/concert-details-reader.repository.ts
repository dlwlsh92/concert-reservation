import { Injectable } from "@nestjs/common";
import { IConcertDetailsReader } from "../../../domain/reservations/repositories/concert-details-reader.interface";
import {
  ConcertEventDetails,
  SeatDetails,
} from "../../../domain/reservations/entities/concert-event-details";
import { PrismaTxType } from "../../../database/prisma/prisma.type";
import { PrismaService } from "../../../database/prisma/prisma.service";

@Injectable()
export class ConcertDetailsReaderRepository implements IConcertDetailsReader {
  constructor(private readonly prisma: PrismaService) {}

  async getUpcomingConcertEventDetails(
    concertId: number
  ): Promise<ConcertEventDetails[]> {
    const upcomingEvents = await this.prisma.concertEvent.findMany({
      where: {
        concertId,
        startDate: {
          gte: new Date(),
        },
      },
      include: {
        seats: true,
      },
    });
    return upcomingEvents.map(
      (event) =>
        new ConcertEventDetails(
          event.id,
          event.concertId,
          event.startDate,
          event.reservationDate,
          event.maxSeatCapacity,
          event.seats.map((seat) => {
            return {
              id: seat.id,
              concertEventId: seat.concertEventId,
              seatNumber: seat.seatNumber,
              expirationDate: seat.expirationDate,
              isPaid: seat.isPaid,
              price: seat.price,
            };
          })
        )
    );
  }

  async getConcertEventDetails(
    concertEventId: number
  ): Promise<ConcertEventDetails | null> {
    const event = await this.prisma.concertEvent.findUnique({
      where: {
        id: concertEventId,
      },
      include: {
        seats: true,
      },
    });
    if (event === null) {
      return null;
    }
    return new ConcertEventDetails(
      event.id,
      event.concertId,
      event.startDate,
      event.reservationDate,
      event.maxSeatCapacity,
      event.seats.map((seat) => {
        return {
          id: seat.id,
          concertEventId: seat.concertEventId,
          seatNumber: seat.seatNumber,
          expirationDate: seat.expirationDate,
          isPaid: seat.isPaid,
          price: seat.price,
        };
      })
    );
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
