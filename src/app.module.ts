import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { ReservationModule } from "./api/reservations/reservation.module";
import { PointModule } from "./api/points/point.module";
import { PaymentModule } from "./api/payment/payment.module";

@Module({
  imports: [DatabaseModule, ReservationModule, PointModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
