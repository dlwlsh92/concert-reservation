export interface SeatDetails {
  id: number;
  concertEventId: number;
  seatNumber: number;
  expirationDate: Date;
  isPaid: boolean;
  price: number;
}

export class ConcertEventDetails {
  private readonly currentTime: Date;
  constructor(
    public readonly id: number,
    public readonly concertId: number,
    public readonly startDate: Date,
    public readonly reservationDate: Date,
    public maxSeatCapacity: number,
    public seats: SeatDetails[]
  ) {
    this.currentTime = new Date();
  }

  isReservationStarted(): boolean {
    return this.currentTime > this.reservationDate;
  }

  isConcertStarted(): boolean {
    return this.currentTime > this.startDate;
  }

  getAvailableSeats(): SeatDetails[] {
    return this.seats.filter((seat) => {
      return seat.expirationDate < this.currentTime && !seat.isPaid;
    });
  }
}
