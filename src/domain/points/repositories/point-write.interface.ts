import { Point } from '../entities/point';
import { PrismaTxType } from '../../../database/prisma/prisma.type';

export const IPointWriteToken = Symbol('IPointWrite');

export interface PointWriteInterface {
  addPoint(
    userId: number,
    points: number,
    version: number,
    tx?: PrismaTxType
  ): Promise<Point>;
  subtractPoint(
    userId: number,
    points: number,
    version: number,
    tx?: PrismaTxType
  ): Promise<Point>;
}
