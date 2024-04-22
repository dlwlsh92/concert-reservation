import { Injectable } from "@nestjs/common";
import { PointReaderInterface } from "../../../domain/points/repositories/point-reader.interface";
import { PrismaService } from "../../../database/prisma/prisma.service";
import { PrismaTxType } from "../../../database/prisma/prisma.type";
import { Point } from "../../../domain/points/entities/point";

@Injectable()
export class PointReaderRepository implements PointReaderInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getPoint(userId: number, tx?: PrismaTxType) {
    const user = await (tx ?? this.prisma).user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return null;
    }
    return new Point(user.id, user.point, user.version);
  }
}
