import { Module } from "@nestjs/common";
import { ReservationsController } from "./contorller/reservations.controller";
import { ReservationReaderRepository } from "../../domain/reservations/infrastructure/persistence/reservation-reader.repository";
import { TokenManagementService } from "../../domain/reservations/application/token-management.service";
import { ReservationService } from "../../domain/reservations/application/reservation.service";
import { ITokenParameterStorageToken } from "../../domain/reservations/repositories/token-parameter-storage.interface";
import { TokenParameterRepository } from "../../domain/reservations/infrastructure/persistence/token-parameter.repository";
import { IConcertDetailsReaderToken } from "../../domain/reservations/repositories/concert-details-reader.interface";
import { ConcertDetailsReaderRepository } from "../../domain/reservations/infrastructure/persistence/concert-details-reader.repository";
import { IReservationReaderRepositoryToken } from "../../domain/reservations/repositories/reservation-reader.interface";
import { ValidateTokenUsecase } from "./usecase/validate-token.usecase";
import { CreateTokenUsecase } from "./usecase/create-token.usecase";
import { AuthenticationService } from "../../domain/reservations/application/authentication.service";
import { GetAvailableConcertResourcesUsecase } from "./usecase/get-available-concert-resources.usecase";
import { PrismaService } from "../../database/prisma/prisma.service";
import { IReservationWriteToken } from "../../domain/reservations/repositories/reservation-write.interface";
import { ReservationWriteRepository } from "../../domain/reservations/infrastructure/persistence/reservation-write.repository";

@Module({
  controllers: [ReservationsController],
  providers: [
    PrismaService,
    TokenManagementService,
    ReservationService,
    ValidateTokenUsecase,
    CreateTokenUsecase,
    AuthenticationService,
    GetAvailableConcertResourcesUsecase,
    {
      provide: ITokenParameterStorageToken,
      useClass: TokenParameterRepository,
    },
    {
      provide: IConcertDetailsReaderToken,
      useClass: ConcertDetailsReaderRepository,
    },
    {
      provide: IReservationReaderRepositoryToken,
      useClass: ReservationReaderRepository,
    },
    {
      provide: IReservationWriteToken,
      useClass: ReservationWriteRepository,
    },
  ],
})
export class ReservationModule {}
