import { PaymentController } from "./controller/payment.controller";
import { Module } from "@nestjs/common";
import { PaymentService } from "../../domain/payment/application/payment.service";
import { IOrderRepositoryToken } from "../../domain/payment/repositories/order.interface";
import { OrderRepository } from "../../domain/payment/infrastructure/persistence/order.repository";
import { ReservationModule } from "../reservations/reservation.module";

@Module({
  imports: [ReservationModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: IOrderRepositoryToken,
      useClass: OrderRepository,
    },
  ],
})
export class PaymentModule {}
