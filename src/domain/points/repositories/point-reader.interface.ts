import { Point } from '../entities/point';
import { PrismaTxType } from '../../../database/prisma/prisma.type';

export const IPointReaderToken = Symbol('IPointReader');

export interface PointReaderInterface {
  getPoint(userId: number, tx?: PrismaTxType): Promise<Point | null>;
}
