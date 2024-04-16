import {
  ReservationStatus,
  ReservationValidator,
} from "../payment/domain/reservation-validator";
import { addHoursToCurrentTime } from "./utils";
import {
  ConcertEventDetails,
  SeatDetails,
} from "../reservations/domain/concert-event-details";

export const reservationMockData = (
  reservation: Partial<ReservationValidator>
): ReservationValidator => {
  const doc = {
    id: 1,
    userId: 1,
    concertEventId: 1,
    seatNumber: 1,
    seatExpirationDate: new Date(),
    price: 10000,
    expirationDate: addHoursToCurrentTime(1),
    concertStartDate: addHoursToCurrentTime(1),
    status: "pending",
    ...reservation,
  };
  return new ReservationValidator(
    doc.id,
    doc.userId,
    doc.concertEventId,
    doc.seatNumber,
    doc.seatExpirationDate,
    doc.price,
    doc.expirationDate,
    doc.status as ReservationStatus
  );
};

export const concertEventDetailsMockData = (
  concertEventDetails: Partial<ConcertEventDetails>
): ConcertEventDetails => {
  const doc = {
    id: 1,
    concertId: 1,
    startDate: addHoursToCurrentTime(1),
    reservationDate: addHoursToCurrentTime(1),
    maxSeatCapacity: 50,
    seats: [],
    ...concertEventDetails,
  };
  return new ConcertEventDetails(
    doc.id,
    doc.concertId,
    doc.startDate,
    doc.reservationDate,
    doc.maxSeatCapacity,
    doc.seats
  );
};

export const seatDetailsMockData = (
  seatDetails: Partial<SeatDetails>
): SeatDetails => {
  const doc = {
    id: 1,
    concertEventId: 1,
    seatNumber: 1,
    expirationDate: addHoursToCurrentTime(1),
    isPaid: false,
    price: 10000,
    ...seatDetails,
  };
  return {
    id: doc.id,
    concertEventId: doc.concertEventId,
    seatNumber: doc.seatNumber,
    expirationDate: doc.expirationDate,
    isPaid: doc.isPaid,
    price: doc.price,
  };
};
