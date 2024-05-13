import { Injectable } from '@nestjs/common';
import { Order } from 'src/domain/payment/entities/order';
import { SeatDetails } from 'src/domain/reservations/entities/concert-event-details';

@Injectable()
export class DataplatformService {
  async sendPaymentData(order: Order, seatDetails: SeatDetails) {
    const data = {
      orderId: order.id,
      userId: order.userId,
      totalPrice: order.totalPrice,
      concertEventId: seatDetails.concertEventId,
      seatId: seatDetails.id,
    };
    console.log(data);
    // 데이터 플랫폼에 예약 결제 데이터 전송 mock api
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  }
}
