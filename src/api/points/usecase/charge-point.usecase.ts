import { Injectable } from '@nestjs/common';
import { PointService } from '../../../domain/points/application/point.service';

@Injectable()
export class ChargePointUsecase {
  constructor(private readonly pointService: PointService) {}

  async execute(userId: number, point: number) {
    return this.pointService.addPoints(userId, point);
  }
}
