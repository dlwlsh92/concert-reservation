import { Injectable } from "@nestjs/common";
import { IReservationWrite } from "../../repositories/reservation-write.interface";
import { SeatDetails } from "../../entities/concert-event-details";
import { PrismaTxType } from "../../../../database/prisma/prisma.type";
import { PrismaService } from "../../../../database/prisma/prisma.service";
import { Reservation } from "../../entities/reservation";

@Injectable()
export class ReservationWriteRepository implements IReservationWrite {
  constructor(private prisma: PrismaService) {}
  async reserveSeat(
    seatId: number,
    reservationExpirationDate: Date,
    tx?: PrismaTxType
  ): Promise<SeatDetails | null> {
    const updatedSeat = await (tx ?? this.prisma).seat.update({
      where: { id: seatId },
      data: {
        expirationDate: reservationExpirationDate,
      },
    });
    if (updatedSeat) {
      return {
        id: updatedSeat.id,
        concertEventId: updatedSeat.concertEventId,
        seatNumber: updatedSeat.seatNumber,
        expirationDate: updatedSeat.expirationDate,
        isPaid: updatedSeat.isPaid,
        price: updatedSeat.price,
      };
    }
    return null;
  }

  async createReservation(
    reservation: Reservation,
    tx?: PrismaTxType
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
            createdReservation.status
          )
      );
  }
}
