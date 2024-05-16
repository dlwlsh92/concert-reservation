import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order } from '../../../payment/entities/order';
import { SeatDetails } from '../../../reservations/entities/concert-event-details';

@Injectable()
export class PaymentEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async success(order: Order, seatDetails: SeatDetails) {
    this.eventEmitter.emit('success', order, seatDetails);
  }
}
