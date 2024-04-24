import { Injectable } from '@nestjs/common';
import { PointService } from '../../../domain/points/application/point.service';

@Injectable()
export class GetPointUsecase {
  constructor(private readonly pointService: PointService) {}

  async execute(userId: number) {
    return this.pointService.getPoints(userId);
  }
}
