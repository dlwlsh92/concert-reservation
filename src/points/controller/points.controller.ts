import { Controller, Get, Post } from "@nestjs/common";
import { TypedBody, TypedParam } from "@nestia/core";

@Controller("points")
export class PointsController {
  @Get("users/:userId")
  async getPoints(@TypedParam("userId") userId: number) {
    return 100;
  }

  @Post("users/:userId/charge")
  async chargePoints(
    @TypedParam("userId") userId: number,
    @TypedBody() amount: number
  ) {
    return 5000;
  }
}
