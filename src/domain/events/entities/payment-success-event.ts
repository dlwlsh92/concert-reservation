export class PaymentSuccessEvent {
  constructor(
    public readonly orderId: number,
    public readonly userId: number,
    public readonly totalPrice: number,
    public readonly concertEventId: number,
    public readonly seatId: number,
  ) {}
}
