import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  IPointReaderToken,
  PointReaderInterface,
} from '../repositories/point-reader.interface';
import {
  IPointWriteToken,
  PointWriteInterface,
} from '../repositories/point-write.interface';
import { Point } from '../entities/point';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class PointService {
  constructor(
    @Inject(IPointReaderToken)
    private readonly pointReaderRepository: PointReaderInterface,
    @Inject(IPointWriteToken)
    private readonly pointWriteRepository: PointWriteInterface,
    private readonly prisma: PrismaService
  ) {}

  async getPoints(userId: number): Promise<Point> {
    const point = await this.pointReaderRepository.getPoint(userId);
    if (!point) {
      throw new HttpException('포인트 정보를 찾을 수 없습니다.', 404);
    }
    return point;
  }

  async addPoints(userId: number, amount: number): Promise<Point> {
    return this.prisma.$transaction(async (tx) => {
      const point = await this.pointReaderRepository.getPoint(userId, tx);
      if (!point) {
        throw new HttpException('포인트 정보를 찾을 수 없습니다.', 404);
      }
      const updatedPoint = point.add(amount).point;
      return this.pointWriteRepository.addPoint(
        userId,
        updatedPoint,
        point.version ?? 1,
        tx
      );
    });
  }

  async subtractPoints(userId: number, amount: number): Promise<Point> {
    return this.prisma.$transaction(async (tx) => {
      const point = await this.pointReaderRepository.getPoint(userId, tx);
      if (!point) {
        throw new HttpException('포인트 정보를 찾을 수 없습니다.', 404);
      }
      const result = point.subtract(amount);
      if (
        result.status === false &&
        result.statusMessage === 'NotEnoughPoint'
      ) {
        throw new HttpException('잔액이 부족합니다.', 402);
      }
      return this.pointWriteRepository.subtractPoint(
        userId,
        result.point,
        point.version ?? 1,
        tx
      );
    });
  }
}
