import { Injectable } from "@nestjs/common";
import { IReservationQueryRepository } from "../../domain/interfaces/reservation-query-repository.interface";

@Injectable()
export class ReservationQueryRepository implements IReservationQueryRepository {
  constructor() {}

  async findReservationById(reservationId: number) {
    // TODO: Implement this method
    return null;
  }
}
