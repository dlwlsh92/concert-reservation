import { Module } from "@nestjs/common";
import { PointsController } from "./controller/points.controller";
import { IPointRepositoryToken } from "./domain/interfaces/point.interface";
import { PointRepository } from "./infrastructure/persistence/point.repository";
import { PointService } from "./application/point.service";

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
