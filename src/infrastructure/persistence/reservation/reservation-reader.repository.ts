import { Injectable } from '@nestjs/common';
import { IReservationReaderRepository } from '../../../domain/reservations/repositories/reservation-reader.interface';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { Reservation } from '../../../domain/reservations/entities/reservation';

@Injectable()
export class ReservationReaderRepository
  implements IReservationReaderRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findReservationById(reservationId: number) {
    return this.prisma.reservation
      .findUnique({
        where: {
          id: reservationId,
        },
      })
      .then((reservation) => {
        if (reservation === null) {
          return null;
        }
        return new Reservation(
          reservation.id,
          reservation.userId,
          reservation.concertEventId,
          reservation.seatId,
          reservation.price,
          reservation.expirationDate,
          reservation.status,
        );
      });
  }
}
