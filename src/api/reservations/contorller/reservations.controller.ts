import { Controller, Get, Post } from "@nestjs/common";
import { TypedBody, TypedParam, TypedQuery } from "@nestia/core";
import { ValidationTokenRes } from "./dto/validation-token.res";
import { AvailableDateRes } from "./dto/available-date.res";
import { AvailableSeatRes } from "./dto/available-seats.res";
import { ValidationTokenReq } from "./dto/validation-token.req";
import { ReserveSeatReq } from "./dto/reserve-seat.req";
import { ReservationService } from "../../../domain/reservations/application/reservation.service";
import { ValidateTokenUsecase } from "../usecase/validate-token.usecase";
import { CreateTokenUsecase } from "../usecase/create-token.usecase";
import { GetAvailableConcertResourcesUsecase } from "../usecase/get-available-concert-resources.usecase";

@Controller("reservations")
export class ReservationsController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly validationTokenUsecase: ValidateTokenUsecase,
    private readonly createTokenUsecase: CreateTokenUsecase,
    private readonly getAvailableConcertResourcesUsecase: GetAvailableConcertResourcesUsecase
  ) {}

  /**
   * 대기열 토큰 발급 요청.
   * @tag reservation
   * @return 대기열 검증 토큰
   * */
  @Post("token")
  async createToken() {
    return this.createTokenUsecase.execute();
  }

  /**
   * 대기열 토큰 검증.
   * @tag reservation
   * @param reservationToken 대기열 토큰
   * @return 대기열 토큰 검증 결과
   * @throws 410 대기열 토큰이 만료됨.
   * */
  @Get("token/validation")
  async validateToken(
    @TypedQuery() reservationToken: ValidationTokenReq
  ): Promise<ValidationTokenRes> {
    return this.validationTokenUsecase.execute(reservationToken.token);
  }

  /**
   * 예약 가능한 콘서트 날짜 조회.
   * @param concertId 콘서트 ID
   * @tag reservation
   * @return 예약 가능한 콘서트 날짜 목록
   * */
  @Get(":concertId/available-dates")
  async getAvailableDates(
    @TypedParam("concertId") concertId: number
  ): Promise<AvailableDateRes[]> {
    return this.getAvailableConcertResourcesUsecase.getAvailableConcertDates(
      concertId
    );
  }

  /**
   * 예약 가능한 좌석 조회.
   * @param concertEventId 콘서트 이벤트 ID
   * @tag reservation
   * @return 예약 가능한 좌석 목록
   * */
  @Get(":concertEventId/avaliable-seats")
  async getAvailableSeats(
    @TypedParam("concertEventId") concertEventId: number
  ): Promise<AvailableSeatRes[]> {
    return this.getAvailableConcertResourcesUsecase.getAvailableConcertSeats(
      concertEventId
    );
  }

  /**
   * 좌석 예약 요청.
   * @param seatsId 좌석 ID
   * @param concertEventId 콘서트 이벤트 ID
   * @tag reservation
   * @return 좌석 예약 성공 여부
   * @throws 409 좌석이 이미 예약된 경우
   * */
  @Post("seats/:seatsId/assign")
  async reserveSeat(
    @TypedParam("seatsId") seatsId: number,
    @TypedBody() reserveSeatReq: ReserveSeatReq
  ) {
    return this.reservationService.reserveSeat(
      seatsId,
      reserveSeatReq.concertEventId,
      reserveSeatReq.userId
    );
  }
}
