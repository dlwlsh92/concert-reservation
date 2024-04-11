import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PaymentController } from "./payment/controller/payment.controller";
import { DatabaseModule } from "./database/database.module";
import { ReservationModule } from "./reservations/reservation.module";
import { PointModule } from "./points/point.module";

@Module({
  imports: [DatabaseModule, ReservationModule, PointModule],
  controllers: [AppController, PaymentController],
  providers: [AppService],
})
export class AppModule {}
