import { Injectable } from "@nestjs/common";
import { IReservationReaderRepository } from "../../repositories/reservation-reader.interface";

@Injectable()
export class ReservationReaderRepository
  implements IReservationReaderRepository
{
  constructor() {}

  async findReservationById(reservationId: number) {
    // TODO: Implement this method
    return null;
  }
}
