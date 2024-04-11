import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { ReservationModule } from "./reservations/reservation.module";
import { PointModule } from "./points/point.module";
import { PaymentModule } from "./payment/payment.module";

@Module({
  imports: [DatabaseModule, ReservationModule, PointModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
