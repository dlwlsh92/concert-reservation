export enum SeatStatus {
  Available = "available",
  Reserved = "reserved",
}

export interface SeatDetails {
  id: number;
  concertEventId: number;
  seatNumber: number;
  seatStatus: SeatStatus;
  price: number;
}

export class ConcertEventDetails {
  constructor(
    public readonly id: number,
    public readonly concertId: number,
    public readonly startDate: Date,
    public maxSeatCapacity: number,
    public seats: SeatDetails[]
  ) {}

  getAvailableSeats(): SeatDetails[] {
    return this.seats.filter(
      (seat) => seat.seatStatus === SeatStatus.Available
    );
  }
}
