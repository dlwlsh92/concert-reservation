import {
  dataplatformServiceInterfaceSymbol,
  PaymentEventListener,
} from './application/listener/payment-event-listener.service';
import { Module } from '@nestjs/common';
import { DataplatformService } from '../../infrastructure/external/dataplatform/dataplatform.service';

@Module({
  providers: [
    PaymentEventListener,
    {
      provide: dataplatformServiceInterfaceSymbol,
      useClass: DataplatformService,
    },
  ],
})
export class EventsModule {}
