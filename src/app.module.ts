import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PaymentController } from "./payment/controller/payment.controller";
import { PointsController } from "./points/controller/points.controller";
import { DatabaseModule } from "./database/database.module";
import { ReservationModule } from "./reservations/reservation.module";

@Module({
  imports: [DatabaseModule, ReservationModule],
  controllers: [AppController, PaymentController, PointsController],
  providers: [AppService],
})
export class AppModule {}
