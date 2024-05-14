import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  IConcertDetailsReader,
  IConcertDetailsReaderToken,
} from '../repositories/concert-details-reader.interface';
import { PrismaService } from '../../../database/prisma/prisma.service';
import {
  getReservationExpirationDate,
  Reservation,
} from '../entities/reservation';
import {
  IReservationWrite,
  IReservationWriteToken,
} from '../repositories/reservation-write.interface';
import { SeatDetails } from '../entities/concert-event-details';
import { PrismaTxType } from '../../../database/prisma/prisma.type';

@Injectable()
export class ReservationService {
  constructor(
    @Inject(IConcertDetailsReaderToken)
    private readonly concertDetailsReaderRepository: IConcertDetailsReader,
    @Inject(IReservationWriteToken)
    private readonly reservationWriteRepository: IReservationWrite,
    private readonly prisma: PrismaService,
  ) {}

  async getAvailableConcertDates(concertId: number) {
    const upcomingConcertEventDetails =
      await this.concertDetailsReaderRepository.getUpcomingConcertEventDetails(
        concertId,
      );

    return upcomingConcertEventDetails
      .filter(
        (concertEventDetail) =>
          !concertEventDetail.isConcertStarted() &&
          concertEventDetail.isReservationStarted(),
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

  async updateSeatPaidStatus(
    seatId: number,
    isPaid: boolean,
    tx?: PrismaTxType,
  ) {
    return this.reservationWriteRepository.updateSeatPaidStatus(
      seatId,
      isPaid,
      tx,
    );
  }

  async getAvailableSeats(concertEventId: number) {
    const concertEventDetails =
      await this.concertDetailsReaderRepository.getConcertEventDetails(
        concertEventId,
      );
    if (concertEventDetails === null) {
      throw new HttpException('콘서트 이벤트가 존재하지 않습니다.', 404);
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
        await this.concertDetailsReaderRepository.findSeatBySeatId(seatId, tx);
      if (seatDetails === null) {
        throw new HttpException('좌석이 존재하지 않습니다.', 404);
      }

      if (seatDetails.expirationDate > new Date()) {
        throw new HttpException('이미 예약된 좌석입니다.', 409);
      }

      if (seatDetails.isPaid === true) {
        throw new HttpException('이미 결제된 좌석입니다.', 409);
      }

      // 만료 일자는 현재 시각으로부터 5분 후이다.
      const reservationExpirationDate = getReservationExpirationDate();
      let updatedSeat: SeatDetails;
      // update에 실패했을 경우 누군가에 의해 좌석이 선점되었다고 판단하고, 예약을 진행하지 않는다.
      try {
        updatedSeat =
          await this.reservationWriteRepository.reserveSeatWithVersion(
            seatId,
            reservationExpirationDate,
            seatDetails.version,
            tx,
          );
      } catch (error) {
        throw new HttpException('좌석 예약에 실패했습니다.', 500);
      }

      const reservation =
        await this.reservationWriteRepository.createReservation(
          new Reservation(
            null,
            userId,
            concertEventId,
            seatId,
            updatedSeat.price,
            reservationExpirationDate,
            'pending',
          ),
          tx,
        );
      return reservation;
    });
  }
}
