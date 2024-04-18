import { PaymentController } from "./controller/payment.controller";
import { Module } from "@nestjs/common";
import { IOrderRepositoryToken } from "../../domain/payment/repositories/order-write.interface";
import { CreatePaymentUsecase } from "./usecase/create-payment.usecase";
import { PaymentValidationService } from "../../domain/reservations/application/payment-validation.service";
import { PointService } from "../../domain/points/application/point.service";
import { OrderService } from "../../domain/payment/application/order.service";
import { OrderWriteRepository } from "../../domain/payment/infrastructure/persistence/order-write.repository";
import { IReservationReaderRepositoryToken } from "../../domain/reservations/repositories/reservation-reader.interface";
import { ReservationReaderRepository } from "../../domain/reservations/infrastructure/persistence/reservation-reader.repository";
import { PrismaService } from "../../database/prisma/prisma.service";
import { IPointReaderToken } from "../../domain/points/repositories/point-reader.interface";
import { PointReaderRepository } from "../../domain/points/infrastructure/persistence/point-reader.repository";
import { IPointWriteToken } from "../../domain/points/repositories/point-write.interface";
import { PointWriteRepository } from "../../domain/points/infrastructure/persistence/point-write.repository";
import { ReservationService } from "../../domain/reservations/application/reservation.service";
import { IConcertDetailsReaderToken } from "../../domain/reservations/repositories/concert-details-reader.interface";
import { ConcertDetailsReaderRepository } from "../../domain/reservations/infrastructure/persistence/concert-details-reader.repository";
import { IReservationWriteToken } from "../../domain/reservations/repositories/reservation-write.interface";
import { ReservationWriteRepository } from "../../domain/reservations/infrastructure/persistence/reservation-write.repository";

@Module({
  controllers: [PaymentController],
  providers: [
    PrismaService,
    OrderService,
    CreatePaymentUsecase,
    PaymentValidationService,
    PointService,
    ReservationService,
    {
      provide: IReservationWriteToken,
      useClass: ReservationWriteRepository,
    },
    {
      provide: IOrderRepositoryToken,
      useClass: OrderWriteRepository,
    },
    {
      provide: IReservationReaderRepositoryToken,
      useClass: ReservationReaderRepository,
    },
    {
      provide: IPointReaderToken,
      useClass: PointReaderRepository,
    },
    {
      provide: IPointWriteToken,
      useClass: PointWriteRepository,
    },
    {
      provide: IConcertDetailsReaderToken,
      useClass: ConcertDetailsReaderRepository,
    },
  ],
})
export class PaymentModule {}
