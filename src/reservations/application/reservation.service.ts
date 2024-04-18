import { HttpException, Inject, Injectable } from "@nestjs/common";
import { TokenManagementService } from "./token-management.service";
import { v4 as uuidv4 } from "uuid";
import {
  IConcertDetails,
  IConcertDetailsToken,
} from "../domain/interfaces/concert-details.interface";
import {
  IReservationQueryRepository,
  IReservationQueryRepositoryToken,
} from "../domain/interfaces/reservation-query-repository.interface";
import { PaymentEligibilityStatus } from "../domain/reservation";

@Injectable()
export class ReservationService {
  constructor(
    private readonly tokenManagementService: TokenManagementService,
    @Inject(IConcertDetailsToken)
    private readonly concertDetailsRepository: IConcertDetails,
    @Inject(IReservationQueryRepositoryToken)
    private readonly reservationQueryRepository: IReservationQueryRepository
  ) {}

  async createToken() {
    const token = uuidv4();
    const accessStartDate =
      await this.tokenManagementService.getAccessStartDate();
    const expirationDate = await this.tokenManagementService.getExpirationDate(
      accessStartDate
    );
    const createdTokenInstance = await this.tokenManagementService.setToken(
      token,
      accessStartDate,
      expirationDate
    );
    return createdTokenInstance.token;
  }

  async validateToken(token: string) {
    const tokenInstance = await this.tokenManagementService.getToken(token);
    if (tokenInstance === null) {
      throw new HttpException("토큰이 만료되었습니다.", 410);
    }
    return tokenInstance.validateToken(new Date());
  }

  async getAvailableConcertDates(concertId: number) {
    const upcomingConcertEventDetails =
      await this.concertDetailsRepository.getUpcomingConcertEventDetails(
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

  async validateReservationForPayment(reservationId: number) {
    const reservation =
      await this.reservationQueryRepository.findReservationById(reservationId);
    if (reservation === null) {
      throw new HttpException("예약이 존재하지 않습니다.", 404);
    }
    const paymentEligibleStatus = reservation.isPaymentEligible();
    switch (paymentEligibleStatus) {
      case PaymentEligibilityStatus.ReservationExpired:
        throw new HttpException("Reservation expired", 410);
      case PaymentEligibilityStatus.ReservationConfirmed:
        throw new HttpException("Reservation already confirmed", 409);
      case PaymentEligibilityStatus.SeatExpired:
        throw new HttpException("Seat expired", 403);
      default:
        return reservation;
    }
  }

  async getAvailableSeats(concertEventId: number) {
    const concertEventDetails =
      await this.concertDetailsRepository.getConcertEventDetails(
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

  async reserveSeat(seatId: number, concertEventId: number) {
    return this.concertDetailsRepository.reserveSeat(seatId, concertEventId);
  }
}
