import { Injectable } from "@nestjs/common";
import { IPointRepository } from "../../repositories/point.interface";
import { Point } from "../../entities/point";

@Injectable()
export class PointRepository implements IPointRepository {
  constructor() {}

  async getPoints(userId: number): Promise<Point> {
    // TODO: Implement this method
    return new Point(1, 100);
  }

  async addPoints(userId: number, amount: number): Promise<Point> {
    // TODO: Implement this method
    return new Point(1, 100);
  }

  async subtractPoints(userId: number, amount: number): Promise<Point> {
    // TODO: Implement this method
    return new Point(1, 100);
  }
}
