import { Injectable } from '@nestjs/common';
import { PointWriteInterface } from '../../../domain/points/repositories/point-write.interface';
import { Point } from '../../../domain/points/entities/point';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PrismaTxType } from '../../../database/prisma/prisma.type';

@Injectable()
export class PointWriteRepository implements PointWriteInterface {
  constructor(private prisma: PrismaService) {}

  async addPoint(
    userId: number,
    point: number,
    version: number,
    tx?: PrismaTxType,
  ) {
    return (tx ?? this.prisma).user
      .update({
        where: {
          id: userId,
          version: version,
        },
        data: {
          point: point,
          version: { increment: 1 },
        },
      })
      .then(({ id, point, version }) => {
        return new Point(id, point, version);
      });
  }

  async subtractPoint(
    userId: number,
    point: number,
    version: number,
    tx?: PrismaTxType,
  ) {
    return (tx ?? this.prisma).user
      .update({
        where: {
          id: userId,
          version: version,
        },
        data: {
          point: point,
          version: { increment: 1 },
        },
      })
      .then(({ id, point, version }) => new Point(id, point, version));
  }
}
