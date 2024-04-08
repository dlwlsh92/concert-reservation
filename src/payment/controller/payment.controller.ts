import { Controller, Post } from "@nestjs/common";
import { TypedParam } from "@nestia/core";

@Controller("payment")
export class PaymentController {
  @Post(":reservationId")
  async createPayment(@TypedParam("reservationId") reservationId: number) {
    return true;
  }
}
