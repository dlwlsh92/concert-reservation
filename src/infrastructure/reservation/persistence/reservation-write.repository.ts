import { Injectable } from '@nestjs/common';
import { IReservationWrite } from '../../../domain/reservations/repositories/reservation-write.interface';
import { SeatDetails } from '../../../domain/reservations/entities/concert-event-details';
import { PrismaTxType } from '../../../database/prisma/prisma.type';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { Reservation } from '../../../domain/reservations/entities/reservation';

@Injectable()
export class ReservationWriteRepository implements IReservationWrite {
  constructor(private prisma: PrismaService) {}
  async reserveSeatWithVersion(
    seatId: number,
    reservationExpirationDate: Date,
    version: number,
    tx?: PrismaTxType,
  ): Promise<SeatDetails> {
    return (tx ?? this.prisma).seat
      .update({
        where: { id: seatId, version: version },
        data: {
          expirationDate: reservationExpirationDate,
          version: { increment: 1 },
        },
      })
      .then((updatedSeat) => {
        return {
          id: updatedSeat.id,
          concertEventId: updatedSeat.concertEventId,
          seatNumber: updatedSeat.seatNumber,
          expirationDate: updatedSeat.expirationDate,
          isPaid: updatedSeat.isPaid,
          price: updatedSeat.price,
          version: updatedSeat.version,
        };
      });
  }

  async createReservation(
    reservation: Reservation,
    tx?: PrismaTxType,
  ): Promise<Reservation> {
    return (tx ?? this.prisma).reservation
      .create({
        data: {
          userId: reservation.userId,
          concertEventId: reservation.concertEventId,
          seatId: reservation.seatId,
          price: reservation.price,
          expirationDate: reservation.expirationDate,
          status: reservation.status,
        },
      })
      .then(
        (createdReservation) =>
          new Reservation(
            createdReservation.id,
            createdReservation.userId,
            createdReservation.concertEventId,
            createdReservation.seatId,
            createdReservation.price,
            createdReservation.expirationDate,
            createdReservation.status,
          ),
      );
  }

  async updateSeatPaidStatus(
    seatId: number,
    isPaid: boolean,
    tx?: PrismaTxType,
  ): Promise<SeatDetails> {
    return (tx ?? this.prisma).seat
      .update({
        where: { id: seatId },
        data: {
          isPaid: isPaid,
        },
      })
      .then((updatedSeat) => {
        return {
          id: updatedSeat.id,
          concertEventId: updatedSeat.concertEventId,
          seatNumber: updatedSeat.seatNumber,
          expirationDate: updatedSeat.expirationDate,
          isPaid: updatedSeat.isPaid,
          price: updatedSeat.price,
          version: updatedSeat.version,
        };
      });
  }
}
