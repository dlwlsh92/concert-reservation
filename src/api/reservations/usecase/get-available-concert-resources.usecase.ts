import { Injectable } from '@nestjs/common';
import { ReservationService } from '../../../domain/reservations/application/reservation.service';

@Injectable()
export class GetAvailableConcertResourcesUsecase {
  constructor(private readonly reservationService: ReservationService) {}

  async getAvailableConcertDates(concertId: number) {
    return this.reservationService.getAvailableConcertDates(concertId);
  }

  async getAvailableConcertSeats(concertEventId: number) {
    return this.reservationService.getAvailableSeats(concertEventId);
  }
}
