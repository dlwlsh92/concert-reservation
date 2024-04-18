export type ReservationStatus = "pending" | "confirmed";

export enum PaymentEligibilityStatus {
  Eligible = "Eligible",
  SeatExpired = "SeatExpired",
  ConcertAlreadyStarted = "ConcertAlreadyStarted",
  ReservationExpired = "ReservationExpired",
  ReservationConfirmed = "ReservationConfirmed",
}

export class Reservation {
  private readonly currentTime: Date;
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly concertEventId: number,
    public readonly seatNumber: number,
    public readonly seatExpirationDate: Date,
    public readonly price: number,
    public readonly expirationDate: Date,
    public readonly status: ReservationStatus
  ) {
    this.currentTime = new Date();
  }

  isPaymentEligible(): PaymentEligibilityStatus {
    if (this.isExpired()) return PaymentEligibilityStatus.ReservationExpired;

    if (this.isConfirmed())
      return PaymentEligibilityStatus.ReservationConfirmed;

    if (this.isExpiredSeat()) return PaymentEligibilityStatus.SeatExpired;

    return PaymentEligibilityStatus.Eligible;
  }

  isExpired(): boolean {
    // 예약 만료 여부 확인
    return this.currentTime > this.expirationDate;
  }

  isConfirmed(): boolean {
    // 이미 결제가 완료된 예약인지 확인
    return this.status === "confirmed";
  }

  isExpiredSeat(): boolean {
    // 좌석의 expire 여부 확인
    return this.currentTime > this.seatExpirationDate;
  }
}
