import { Controller, Get, Post } from "@nestjs/common";
import { TypedBody, TypedParam, TypedQuery } from "@nestia/core";
import { ValidationTokenRes } from "./dto/validation-token.res";
import { AvailableDateRes } from "./dto/available-date.res";
import { AvailableSeatRes } from "./dto/available-seats.res";
import { Token, TokenRes } from "./dto/token.res";

@Controller("reservations")
export class ReservationsController {
  @Post("token")
  async createToken(@TypedBody() token: Token) {
    return "token";
  }

  @Get("token/validation")
  async validateToken(
    @TypedQuery() reservationToken: TokenRes
  ): Promise<ValidationTokenRes> {
    console.log(
      "=>(reservations.controller.ts:23) reservationToken",
      reservationToken
    );
    console.log(
      "=>(reservations.controller.ts:27) reservationToken.token",
      reservationToken.token
    );
    return {
      status: "available",
      waitingTime: null,
    };
  }

  @Get(":concertId/available-dates")
  async getAvailableDates(
    @TypedParam("concertId") concertId: number
  ): Promise<AvailableDateRes[]> {
    return [
      {
        concertEventId: 1,
        startDate: new Date(),
        maxSeatCapacity: 50,
        currentSeatCount: 10,
      },
    ];
  }

  @Get(":concertEventId/avaliable-seats")
  async getAvailableSeats(
    @TypedParam("concertEventId") concertEventId: number
  ): Promise<AvailableSeatRes[]> {
    return [
      {
        seatId: 1,
        seatNumber: 1,
      },
      {
        seatId: 2,
        seatNumber: 2,
      },
    ];
  }

  @Post("seats/:seatsId/assign")
  async assignSeat(
    @TypedParam("seatsId") seatsId: number,
    @TypedBody() concertEventId: string
  ) {
    return true;
  }
}
