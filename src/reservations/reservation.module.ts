import { Module } from "@nestjs/common";
import { ReservationsController } from "./contorller/reservations.controller";
import { TokenManagementService } from "./application/token-management.service";
import { ITokenParameterStorageToken } from "./domain/interfaces/token-parameter-storage.interface";
import { TokenParameterRepository } from "./infrastructure/persistence/token-parameter.repository";
import { ReservationService } from "./application/reservation.service";
import { IConcertDetailsToken } from "./domain/interfaces/concert-details.interface";
import { ConcertDetailsRepository } from "./infrastructure/persistence/concert-details.repository";
import { ValidationReservationService } from "./application/validation-reservation.service";
import { IReservationDetailsRepositoryToken } from "./domain/interfaces/reservation-details.interface";
import { ReservationDetailsRepository } from "./infrastructure/persistence/reservation-details.repository";

@Module({
  controllers: [ReservationsController],
  providers: [
    TokenManagementService,
    ReservationService,
    ValidationReservationService,
    {
      provide: ITokenParameterStorageToken,
      useClass: TokenParameterRepository,
    },
    {
      provide: IConcertDetailsToken,
      useClass: ConcertDetailsRepository,
    },
    {
      provide: IReservationDetailsRepositoryToken,
      useClass: ReservationDetailsRepository,
    },
  ],
  exports: [ValidationReservationService],
})
export class ReservationModule {}
