import { Module } from "@nestjs/common";
import { ReservationsController } from "./contorller/reservations.controller";
import { TokenManagementService } from "./application/token-management.service";

@Module({
  controllers: [ReservationsController],
  providers: [TokenManagementService],
})
export class ReservationModule {}
