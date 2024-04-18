import { ReservationService } from "../../../domain/reservations/application/reservation.service";
import { IConcertDetailsReader } from "../../../domain/reservations/repositories/concert-details-reader.interface";
import {
  concertEventDetailsMockData,
  seatDetailsMockData,
} from "../../test.entities";
import { addHoursToCurrentTime } from "../../utils";
import { PrismaService } from "../../../database/prisma/prisma.service";

describe("예약 관련 로직에 대한 단위 테스트", () => {
  let reservationService: ReservationService;
  let concertDetailsReaderRepository: jest.Mocked<IConcertDetailsReader>;
  let prisma: PrismaService;

  beforeEach(() => {
    concertDetailsReaderRepository = {
      getUpcomingConcertEventDetails: jest.fn(),
      getConcertEventDetails: jest.fn(),
      findSeatBySeatIdWithLock: jest.fn(),
    };
    prisma = new PrismaService();
    reservationService = new ReservationService(
      concertDetailsReaderRepository,
      prisma
    );
  });

  describe("예약 가능한 공연 일자와 좌석 정보를 반환하는 로직 테스트", () => {
    it("예약 가능한 공연 일자와 해당하는 일자의 좌석 정보를 반환한다.", async () => {
      concertDetailsReaderRepository.getUpcomingConcertEventDetails.mockResolvedValue(
        [
          {
            maxSeatCapacity: 3,
            seats: [
              seatDetailsMockData({
                expirationDate: addHoursToCurrentTime(-1),
                isPaid: false,
              }),
              seatDetailsMockData({
                expirationDate: addHoursToCurrentTime(1),
                isPaid: false,
              }),
              seatDetailsMockData({
                expirationDate: addHoursToCurrentTime(-1),
                isPaid: true,
              }),
            ],
          },
        ].map((concertEventDetail) =>
          concertEventDetailsMockData(concertEventDetail)
        )
      );
      const availableConcertDetails =
        await reservationService.getAvailableConcertDates(3);
      expect(availableConcertDetails[0].currentSeatCount).toBe(2);
    });

    it("예약 가능한 공연 날짜가 없을 경우 빈 배열을 반환한다.", async () => {
      concertDetailsReaderRepository.getUpcomingConcertEventDetails.mockResolvedValue(
        []
      );
      const availableConcertDetails =
        await reservationService.getAvailableConcertDates(3);
      expect(availableConcertDetails).toEqual([]);
    });
  });
});
