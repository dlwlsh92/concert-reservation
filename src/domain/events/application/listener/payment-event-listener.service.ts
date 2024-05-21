import { Inject, Injectable } from '@nestjs/common';
import { OnEventSafe } from '../../on-event-safe.decorator';
import { Order } from '../../../payment/entities/order';
import { SeatDetails } from '../../../reservations/entities/concert-event-details';
import { PaymentSuccessEvent } from '../../entities/payment-success-event';

export const dataplatformServiceInterfaceSymbol = Symbol(
  'DataplatformServiceInterface',
);

export interface DataplatformServiceInterface {
  sendPaymentData(event: PaymentSuccessEvent): Promise<boolean>;
}

@Injectable()
export class PaymentEventListener {
  constructor(
    @Inject(dataplatformServiceInterfaceSymbol)
    private readonly dataplatformService: DataplatformServiceInterface,
  ) {}

  @OnEventSafe('success')
  async paymentSuccessHandler(order: Order, seatDetails: SeatDetails) {
    await this.dataplatformService.sendPaymentData(
      new PaymentSuccessEvent(
        order.id,
        order.userId,
        order.totalPrice,
        seatDetails.concertEventId,
        seatDetails.id,
      ),
    );
  }
}
