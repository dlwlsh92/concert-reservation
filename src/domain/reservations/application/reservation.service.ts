import { HttpException, Inject, Injectable } from "@nestjs/common";
import {
  IConcertDetailsReader,
  IConcertDetailsReaderToken,
} from "../repositories/concert-details-reader.interface";
import { PrismaService } from "../../../database/prisma/prisma.service";

@Injectable()
export class ReservationService {
  constructor(
    @Inject(IConcertDetailsReaderToken)
    private readonly concertDetailsReaderRepository: IConcertDetailsReader,
    private readonly prisma: PrismaService
  ) {}

  async getAvailableConcertDates(concertId: number) {
    const upcomingConcertEventDetails =
      await this.concertDetailsReaderRepository.getUpcomingConcertEventDetails(
        concertId
      );

    return upcomingConcertEventDetails
      .filter(
        (concertEventDetail) =>
          !concertEventDetail.isConcertStarted() &&
          concertEventDetail.isReservationStarted()
      )
      .map((filteredConcertEventDetail) => {
        const availableSeats = filteredConcertEventDetail.getAvailableSeats();
        return {
          concertEventId: filteredConcertEventDetail.id,
          startDate: filteredConcertEventDetail.startDate,
          maxSeatCapacity: filteredConcertEventDetail.maxSeatCapacity,
          currentSeatCount:
            filteredConcertEventDetail.maxSeatCapacity - availableSeats.length,
        };
      });
  }

  async getAvailableSeats(concertEventId: number) {
    const concertEventDetails =
      await this.concertDetailsReaderRepository.getConcertEventDetails(
        concertEventId
      );
    if (concertEventDetails === null) {
      throw new HttpException("콘서트 이벤트가 존재하지 않습니다.", 404);
    }
    return concertEventDetails.getAvailableSeats().map((seat) => {
      return {
        seatId: seat.id,
        seatNumber: seat.seatNumber,
      };
    });
  }

  async reserveSeat(seatId: number, concertEventId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const seatDetails =
        await this.concertDetailsReaderRepository.findSeatBySeatIdWithLock(
          seatId,
          tx
        );
      if (seatDetails === null) {
        throw new HttpException("좌석이 존재하지 않습니다.", 404);
      }

      if (seatDetails.expirationDate > new Date()) {
        throw new HttpException("이미 예약된 좌석입니다.", 409);
      }

      if (seatDetails.isPaid === true) {
        throw new HttpException("이미 결제된 좌석입니다.", 409);
      }

      // 만료 일자는 현분재 시각으로부터 5분 후이다.
    });
  }
}
