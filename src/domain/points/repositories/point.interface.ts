import { Point } from "../entities/point";

export const IPointRepositoryToken = Symbol("IPointRepository");

export interface IPointRepository {
  getPoints(userId: number): Promise<Point>;
  addPoints(userId: number, amount: number): Promise<Point>;
  subtractPoints(userId: number, amount: number): Promise<Point>;
}
