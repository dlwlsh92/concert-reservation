import { Module } from "@nestjs/common";
import { ReservationsController } from "./contorller/reservations.controller";
import { TokenManagementService } from "./application/token-management.service";
import { ITokenParameterStorageToken } from "./domain/interfaces/token-parameter-storage.interface";
import { TokenParameterRepository } from "./infrastructure/persistence/token-parameter.repository";

@Module({
  controllers: [ReservationsController],
  providers: [
    TokenManagementService,
    {
      provide: ITokenParameterStorageToken,
      useClass: TokenParameterRepository,
    },
  ],
})
export class ReservationModule {}
