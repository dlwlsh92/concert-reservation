import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    private readonly prisma: PrismaService,
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
      const maxAttempts = 3;
      let attempts = 0;
      while (attempts < maxAttempts) {
        const point = await this.pointReaderRepository.getPoint(userId, tx);
        if (!point) {
          throw new HttpException('포인트 정보를 찾을 수 없습니다.', 404);
        }
        const updatedPoint = point.add(amount).point;
        try {
          return await this.pointWriteRepository.addPoint(
            userId,
            updatedPoint,
            point.version ?? 1,
            tx,
          );
        } catch (e) {
          attempts++;
        }
      }
      throw new InternalServerErrorException('포인트 충전에 실패했습니다.');
    });
  }

  async subtractPoints(userId: number, amount: number): Promise<Point> {
    return this.prisma.$transaction(async (tx) => {
      const maxAttempts = 3;
      let attempts = 0;
      while (attempts < maxAttempts) {
        console.log('=>(point.service.ts:67) attempts', attempts);
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
        try {
          const updatedPoint = await this.pointWriteRepository.subtractPoint(
            userId,
            result.point,
            point.version ?? 1,
            tx,
          );
          return updatedPoint;
        } catch (e) {
          attempts++;
        }
      }
      throw new InternalServerErrorException('포인트 충전에 실패했습니다.');
    });
  }
}
