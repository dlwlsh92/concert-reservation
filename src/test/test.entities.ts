import { addHoursToCurrentTime } from './utils';
import {
  ConcertEventDetails,
  SeatDetails,
} from '../domain/reservations/entities/concert-event-details';
import {
  Reservation,
  ReservationStatus,
} from '../domain/reservations/entities/reservation';

export const reservationMockData = (
  reservation: Partial<Reservation>,
): Reservation => {
  const doc = {
    id: 1,
    userId: 1,
    concertEventId: 1,
    seatNumber: 1,
    price: 10000,
    expirationDate: addHoursToCurrentTime(1),
    concertStartDate: addHoursToCurrentTime(1),
    status: 'pending',
    ...reservation,
  };
  return new Reservation(
    doc.id,
    doc.userId,
    doc.concertEventId,
    doc.seatNumber,
    doc.price,
    doc.expirationDate,
    doc.status as ReservationStatus,
  );
};

export const concertEventDetailsMockData = (
  concertEventDetails: Partial<ConcertEventDetails>,
): ConcertEventDetails => {
  const doc = {
    id: 1,
    concertId: 1,
    startDate: addHoursToCurrentTime(1),
    reservationDate: addHoursToCurrentTime(-1),
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
    doc.seats,
  );
};

export const seatDetailsMockData = (
  seatDetails: Partial<SeatDetails>,
): SeatDetails => {
  const doc = {
    id: 1,
    concertEventId: 1,
    seatNumber: 1,
    expirationDate: addHoursToCurrentTime(1),
    isPaid: false,
    price: 10000,
    version: 1,
    ...seatDetails,
  };
  return {
    id: doc.id,
    concertEventId: doc.concertEventId,
    seatNumber: doc.seatNumber,
    expirationDate: doc.expirationDate,
    isPaid: doc.isPaid,
    price: doc.price,
    version: doc.version,
  };
};
