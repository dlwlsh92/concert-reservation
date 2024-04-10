export type ReservationStatus = "pending" | "confirmed" | "expired";
export type SeatStatus = "reserved" | "available";

export enum PaymentEligibilityStatus {
  Eligible = "Eligible",
  SeatNotReserved = "SeatNotReserved",
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
    public readonly seatStatus: SeatStatus,
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

    if (!this.isReservedSeat()) return PaymentEligibilityStatus.SeatNotReserved;

    return PaymentEligibilityStatus.Eligible;
  }

  isExpired(): boolean {
    // 예약 만료 여부 확인
    return this.currentTime > this.expirationDate || this.status === "expired";
  }

  isConfirmed(): boolean {
    // 이미 결제가 완료된 예약인지 확인
    return this.status === "confirmed";
  }

  isReservedSeat(): boolean {
    // 기본적으로 결제 단계에 넘어갈 수 있는 조건은 좌석이 예약되어 선점된 상태여야 한다.
    return this.seatStatus === "reserved";
  }
}
