import {
  Reservation,
  ReservationStatus,
  SeatStatus,
} from "../reservations/domain/reservation";
import { addHoursToCurrentTime } from "./utils";

export const reservationMockData = (
  reservation: Partial<Reservation>
): Reservation => {
  const doc = {
    id: 1,
    userId: 1,
    concertEventId: 1,
    seatNumber: 1,
    seatStatus: "reserved",
    price: 10000,
    expirationDate: addHoursToCurrentTime(1),
    concertStartDate: addHoursToCurrentTime(1),
    status: "pending",
    ...reservation,
  };
  return new Reservation(
    doc.id,
    doc.userId,
    doc.concertEventId,
    doc.seatNumber,
    doc.seatStatus as SeatStatus,
    doc.price,
    doc.expirationDate,
    doc.status as ReservationStatus
  );
};
