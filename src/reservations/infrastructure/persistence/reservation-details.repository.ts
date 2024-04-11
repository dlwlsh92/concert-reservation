import { Injectable } from "@nestjs/common";
import { IReservationDetails } from "../../domain/interfaces/reservation-details.interface";
import { Reservation } from "../../domain/reservation";

@Injectable()
export class ReservationDetailsRepository implements IReservationDetails {
  constructor() {}

  async getReservation(reservationId: number): Promise<Reservation> {
    // TODO: Implement this method
    return new Reservation(1, 1, 1, 1, "reserved", 500, new Date(), "pending");
  }
}
