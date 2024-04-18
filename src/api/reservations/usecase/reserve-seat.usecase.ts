import { Injectable } from "@nestjs/common";
import { ReservationService } from "../../../domain/reservations/application/reservation.service";

@Injectable()
export class ReserveSeatUsecase {
  constructor(private readonly reservationService: ReservationService) {}

  async execute(seatId: number, concertEventId: number, userId: number) {
    const reservation = await this.reservationService.reserveSeat(
      seatId,
      concertEventId,
      userId
    );
    return reservation;
  }
}
