import { Module } from "@nestjs/common";
import { ReservationsController } from "./contorller/reservations.controller";
import { TokenManagementService } from "./application/token-management.service";
import { ITokenParameterStorageToken } from "./domain/interfaces/token-parameter-storage.interface";
import { TokenParameterRepository } from "./infrastructure/persistence/token-parameter.repository";
import { ReservationService } from "./application/reservation.service";
import { IConcertDetailsToken } from "./domain/interfaces/concert-details.interface";
import { ConcertDetailsRepository } from "./infrastructure/persistence/concert-details.repository";
import { IReservationQueryRepositoryToken } from "./domain/interfaces/reservation-query-repository.interface";
import { ReservationQueryRepository } from "./infrastructure/persistence/reservation-query.repository";

@Module({
  controllers: [ReservationsController],
  providers: [
    TokenManagementService,
    ReservationService,
    {
      provide: ITokenParameterStorageToken,
      useClass: TokenParameterRepository,
    },
    {
      provide: IConcertDetailsToken,
      useClass: ConcertDetailsRepository,
    },
    {
      provide: IReservationQueryRepositoryToken,
      useClass: ReservationQueryRepository,
    },
  ],
})
export class ReservationModule {}
