import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentController } from './payment/controller/payment.controller';
import { PointsController } from './points/controller/points.controller';
import { ReservationsController } from './reservations/contorller/reservations.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController, PaymentController, PointsController, ReservationsController],
  providers: [AppService],
})
export class AppModule {}
