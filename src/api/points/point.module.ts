import { Module } from "@nestjs/common";
import { PointsController } from "./controller/points.controller";
import { PointService } from "../../domain/points/application/point.service";
import { IPointRepositoryToken } from "../../domain/points/repositories/point.interface";
import { PointRepository } from "../../domain/points/infrastructure/persistence/point.repository";

@Module({
  controllers: [PointsController],
  providers: [
    PointService,
    {
      provide: IPointRepositoryToken,
      useClass: PointRepository,
    },
  ],
})
export class PointModule {}
