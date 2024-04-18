import { Injectable } from "@nestjs/common";

@Injectable()
export class ReserveSeatsUsecase {
  constructor() {}

  execute(userId: number, concertEventId: number, seatId: number) {
    /**
     * seat에 대한 예약을 진행한다.
     * 해당 seat에 대한 비관적 락을 걸고, 만일 seat의 expirationDate가 현재보다 이후라면 누군가에 의해 점유되었다고 판단하고 409에러를 던진다.
     * */
  }
}
