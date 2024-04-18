import { Module } from "@nestjs/common";
import { PointsController } from "./controller/points.controller";
import { PointService } from "../../domain/points/application/point.service";
import { IPointReaderToken } from "../../domain/points/repositories/point-reader.interface";
import { PointReaderRepository } from "../../domain/points/infrastructure/persistence/point-reader.repository";
import { IPointWriteToken } from "../../domain/points/repositories/point-write.interface";
import { PointWriteRepository } from "../../domain/points/infrastructure/persistence/point-write.repository";
import { GetPointUsecase } from "./usecase/get-point.usecase";
import { ChargePointUsecase } from "./usecase/charge-point.usecase";
import { PrismaService } from "../../database/prisma/prisma.service";

@Module({
  controllers: [PointsController],
  providers: [
    PointService,
    GetPointUsecase,
    ChargePointUsecase,
    PrismaService,
    {
      provide: IPointReaderToken,
      useClass: PointReaderRepository,
    },
    {
      provide: IPointWriteToken,
      useClass: PointWriteRepository,
    },
  ],
})
export class PointModule {}
