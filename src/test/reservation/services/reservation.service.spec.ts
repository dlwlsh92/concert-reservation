import { ReservationService } from '../../../domain/reservations/application/reservation.service';
import { IConcertDetailsReader } from '../../../domain/reservations/repositories/concert-details-reader.interface';
import {
  concertEventDetailsMockData,
  seatDetailsMockData,
} from '../../test.entities';
import { addHoursToCurrentTime } from '../../utils';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { IReservationWrite } from '../../../domain/reservations/repositories/reservation-write.interface';
import { Reservation } from '../../../domain/reservations/entities/reservation';

describe('예약 관련 로직에 대한 단위 테스트', () => {
  let reservationService: ReservationService;
  let concertDetailsReaderRepository: jest.Mocked<IConcertDetailsReader>;
  let reservationWriteRepository: jest.Mocked<IReservationWrite>;
  let prisma: PrismaService;

  beforeAll(() => {
    concertDetailsReaderRepository = {
      getUpcomingConcertEventDetails: jest.fn(),
      getConcertEventDetails: jest.fn(),
      findSeatBySeatId: jest.fn(),
    };
    reservationWriteRepository = {
      reserveSeatWithVersion: jest.fn(),
      createReservation: jest.fn(),
      updateSeatPaidStatus: jest.fn(),
    };
    prisma = new PrismaService();
    reservationService = new ReservationService(
      concertDetailsReaderRepository,
      reservationWriteRepository,
      prisma,
    );
  });

  describe('예약 가능한 공연 일자와 좌석 정보를 반환하는 로직 테스트', () => {
    it('예약 가능한 공연 일자와 해당하는 일자의 좌석 정보를 반환한다.', async () => {
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
          concertEventDetailsMockData(concertEventDetail),
        ),
      );
      const availableConcertDetails =
        await reservationService.getAvailableConcertDates(3);
      expect(availableConcertDetails[0].currentSeatCount).toBe(2);
    });

    it('예약 가능한 공연 날짜가 없을 경우 빈 배열을 반환한다.', async () => {
      concertDetailsReaderRepository.getUpcomingConcertEventDetails.mockResolvedValue(
        [],
      );
      const availableConcertDetails =
        await reservationService.getAvailableConcertDates(3);
      expect(availableConcertDetails).toEqual([]);
    });
  });

  describe('좌석 예약에 대한 테스트 코드 작성', () => {
    it('좌석 조회에 실패한 경우 404 에러를 발생시킨다.', async () => {
      concertDetailsReaderRepository.findSeatBySeatId.mockResolvedValue(null);
      try {
        await reservationService.reserveSeat(1, 100, 10);
      } catch (e) {
        expect(e.message).toBe('좌석이 존재하지 않습니다.');
        expect(e.status).toBe(404);
      }
    });

    it('이미 예약된 좌석일 경우 409 에러를 발생시킨다.', async () => {
      /**
       * 좌석 예약 시 expirationDate를 5분 후로 지정하기 때문에 만일 현재 시점보다 만료 시각이 미래일 경우 누군가에 의해 점유된 것이다.
       * */
      concertDetailsReaderRepository.findSeatBySeatId.mockResolvedValue(
        seatDetailsMockData({
          expirationDate: addHoursToCurrentTime(1),
          isPaid: false,
        }),
      );
      try {
        await reservationService.reserveSeat(1, 100, 10);
      } catch (e) {
        expect(e.message).toBe('이미 예약된 좌석입니다.');
        expect(e.status).toBe(409);
      }
    });

    it('이미 결제된 좌석일 경우 409 에러를 발생시킨다.', async () => {
      concertDetailsReaderRepository.findSeatBySeatId.mockResolvedValue(
        seatDetailsMockData({
          expirationDate: addHoursToCurrentTime(-1),
          isPaid: true,
        }),
      );
      try {
        await reservationService.reserveSeat(1, 100, 10);
      } catch (e) {
        expect(e.message).toBe('이미 결제된 좌석입니다.');
        expect(e.status).toBe(409);
      }
    });

    it('좌석 업데이트에 실패했을 경우 500 에러를 발생시킨다.', async () => {
      concertDetailsReaderRepository.findSeatBySeatId.mockResolvedValue(
        seatDetailsMockData({
          expirationDate: addHoursToCurrentTime(-1),
          isPaid: false,
        }),
      );
      reservationWriteRepository.reserveSeatWithVersion.mockRejectedValue(
        new Error('테이블 업데이트 실패'),
      );
      try {
        await reservationService.reserveSeat(1, 100, 10);
      } catch (e) {
        expect(e.message).toBe('좌석 예약에 실패했습니다.');
        expect(e.status).toBe(500);
      }
    });

    it('좌석 예약에 성공했을 경우 예약 정보를 반환한다.', async () => {
      concertDetailsReaderRepository.findSeatBySeatId.mockResolvedValue(
        seatDetailsMockData({
          expirationDate: addHoursToCurrentTime(-1),
          isPaid: false,
        }),
      );
      reservationWriteRepository.reserveSeatWithVersion.mockResolvedValue(
        seatDetailsMockData({
          expirationDate: addHoursToCurrentTime(1),
          isPaid: false,
        }),
      );
      reservationWriteRepository.createReservation.mockResolvedValue(
        new Reservation(
          1,
          10,
          100,
          1,
          10000,
          addHoursToCurrentTime(1),
          'pending',
        ),
      );
      const reservation = await reservationService.reserveSeat(1, 100, 10);
      expect(reservation.userId).toBe(10);
      expect(reservation.concertEventId).toBe(100);
      expect(reservation.seatId).toBe(1);
      expect(reservation.price).toBe(10000);
      expect(reservation.status).toBe('pending');
    });
  });
});
