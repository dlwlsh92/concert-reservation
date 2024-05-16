import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ReservationModule } from './api/reservations/reservation.module';
import { PointModule } from './api/points/point.module';
import { PaymentModule } from './api/payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { DataplatformModule } from './infrastructure/external/dataplatform/dataplatform.module';
import { EventsModule } from './domain/events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

console.log('=>(app.module.ts:26) process.env.NODE_ENV', process.env.NODE_ENV);

@Module({
  imports: [
    DatabaseModule,
    ReservationModule,
    PointModule,
    PaymentModule,
    DataplatformModule,
    EventsModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
