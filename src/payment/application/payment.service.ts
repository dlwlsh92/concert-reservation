import { Inject, Injectable } from "@nestjs/common";
import {
  IOrder,
  IOrderRepositoryToken,
} from "../domain/interfaces/order.interface";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(IOrderRepositoryToken)
    private readonly orderRepository: IOrder
  ) {}

  async payReservation(reservationId: number): Promise<boolean> {
    // TODO: Implement this method
    // const reservation =
    //   await this.validationReservationService.validateReservation(
    //     reservationId
    //   );
    // TODO: point 정보 불러와서 잔액 검증하고 결제하는 코드 추가

    return true;
  }
}
