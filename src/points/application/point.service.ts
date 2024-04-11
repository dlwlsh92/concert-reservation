import { HttpException, Inject, Injectable } from "@nestjs/common";
import {
  IPointRepository,
  IPointRepositoryToken,
} from "../domain/interfaces/point.interface";

@Injectable()
export class PointService {
  constructor(
    @Inject(IPointRepositoryToken)
    private readonly pointRepository: IPointRepository
  ) {}

  async getPoints(userId: number): Promise<number> {
    const point = await this.pointRepository.getPoints(userId);
    return point.point;
  }

  async addPoints(userId: number, amount: number): Promise<number> {
    const point = await this.pointRepository.addPoints(userId, amount);
    return point.add(amount).point;
  }

  async subtractPoints(userId: number, amount: number): Promise<number> {
    const point = await this.pointRepository.subtractPoints(userId, amount);
    const result = point.subtract(amount);
    if (result.status === false && result.statusMessage === "NotEnoughPoint") {
      throw new HttpException("잔액이 부족합니다.", 402);
    }
    return result.point;
  }
}
