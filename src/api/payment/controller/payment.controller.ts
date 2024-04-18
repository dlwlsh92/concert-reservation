import { Controller, Post } from "@nestjs/common";
import { TypedParam } from "@nestia/core";
import { PaymentService } from "../../../domain/payment/application/payment.service";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  /**
   * 좌석 결제 요청.
   * @param reservationId 예약 ID
   * @tag payment
   * @return 좌석 결제 성공 여부
   * @throws 409 이미 결제된 좌석
   * @throws 403 좌석의 status가 reserved가 아님
   * @throws 404 예약 ID에 해당하는 좌석이 존재하지 않음
   * @throws 410 예약이 만료된 경우
   * @throws 402 잔액 부족
   * */
  @Post(":reservationId")
  async createPayment(@TypedParam("reservationId") reservationId: number) {
    // TODO: Implement this method
    return this.paymentService.payReservation(reservationId);
  }
}
