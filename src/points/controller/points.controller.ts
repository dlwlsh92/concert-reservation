import { Controller, Get, Post } from "@nestjs/common";
import { TypedBody, TypedParam } from "@nestia/core";

@Controller("points")
export class PointsController {
  /**
   * 포인트 조회.
   * @param userId 유저 ID
   * @tag point
   * @return 업데이트된 포인트
   * */
  @Get("users/:userId")
  async getPoints(@TypedParam("userId") userId: number) {
    return 100;
  }

  /**
   * 포인트 충전.
   * @param userId 유저 ID
   * @param amount 충전할 포인트
   * @tag point
   * @return 업데이트된 포인트
   * */
  @Post("users/:userId/charge")
  async chargePoints(
    @TypedParam("userId") userId: number,
    @TypedBody() amount: number
  ) {
    return 5000;
  }
}
