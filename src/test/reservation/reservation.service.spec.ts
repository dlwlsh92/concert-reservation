import { TokenParameterStorageStub } from "./tokenParameterStrorageStub";
import { TokenManagementService } from "../../reservations/application/token-management.service";
import { IConcertDetails } from "../../reservations/domain/interfaces/concert-details.interface";
import { ReservationService } from "../../reservations/application/reservation.service";
import { ConcertDetailsRepository } from "../../reservations/infrastructure/persistence/concert-details.repository";
import {
  concertEventDetailsMockData,
  seatDetailsMockData,
} from "../test.entities";
import { addHoursToCurrentTime } from "../utils";

describe("예약 관련 로직에 대한 단위 테스트", () => {
  let tokenManagementService: TokenManagementService;
  let tokenParameterStorage: TokenParameterStorageStub;
  let concertDetailsRepository: IConcertDetails;
  let reservationService: ReservationService;
  beforeEach(() => {
    tokenParameterStorage = new TokenParameterStorageStub();
    tokenManagementService = new TokenManagementService(tokenParameterStorage);
    tokenManagementService.numberPerCycle = 50;
    tokenManagementService.validTokenSeconds = 300;
    concertDetailsRepository = new ConcertDetailsRepository();
    reservationService = new ReservationService(
      tokenManagementService,
      concertDetailsRepository
    );
  });

  it("토큰을 생성하면 생성된 토큰을 반환한다.", async () => {
    const token = await reservationService.createToken();
    expect(token).not.toBeNull();
  });

  describe("토큰을 검증하는 로직 테스트", () => {
    it("토큰이 만료되었을 경우 http status code 410 에러를 반환한다.", async () => {
      try {
        await reservationService.validateToken("expiredToken");
      } catch (e) {
        expect(e.message).toBe("토큰이 만료되었습니다.");
        expect(e.status).toBe(410);
      }
    });

    it("토큰이 유효한 경우 토큰의 상태는 available 대기 시간은 0을 반환한다.", async () => {
      tokenParameterStorage.waitingCount = 0;
      const token = await reservationService.createToken();
      const result = await reservationService.validateToken(token);
      expect(result.status).toBe("available");
      expect(result.waitingSeconds).toEqual(0);
    });

    it("토큰이 아직 예약 서비스를 이용할 수 없는 경우 토큰의 상태는 pending 대기 시간은 0보다 큰 값을 반환한다.", async () => {
      tokenParameterStorage.waitingCount = 100;
      const token = await reservationService.createToken();
      const result = await reservationService.validateToken(token);
      expect(result.status).toBe("pending");
      expect(result.waitingSeconds).toBeGreaterThan(0);
    });
  });

  describe("예약 가능한 공연 일자와 좌석 정보를 반환하는 로직 테스트", () => {
    it("예약 가능한 공연 일자와 해당하는 일자의 좌석 정보를 반환한다.", async () => {
      jest
        .spyOn(concertDetailsRepository, "getUpcomingConcertEventDetails")
        .mockResolvedValue(
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
      jest
        .spyOn(concertDetailsRepository, "getUpcomingConcertEventDetails")
        .mockResolvedValue([]);
      const availableConcertDetails =
        await reservationService.getAvailableConcertDates(3);
      expect(availableConcertDetails).toEqual([]);
    });
  });
});
