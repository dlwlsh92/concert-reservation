import { Injectable } from '@nestjs/common';
import { PaymentSuccessEvent } from '../../../domain/events/entities/payment-success-event';
import { DataplatformServiceInterface } from '../../../domain/events/application/listener/payment-event-listener.service';

@Injectable()
export class DataplatformService implements DataplatformServiceInterface {
  async sendPaymentData(
    paymentSuccessEvent: PaymentSuccessEvent,
  ): Promise<boolean> {
    // 데이터 플랫폼에 예약 결제 데이터 전송 mock api
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }
}
