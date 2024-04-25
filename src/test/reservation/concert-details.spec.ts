import { addHoursToCurrentTime } from '../utils';
import { ConcertEventDetails } from '../../domain/reservations/entities/concert-event-details';

describe('콘서트 관련 정보 조회 테스트 로직', () => {
  it('콘서트 시작 날짜가 지난 경우 isConcertStarted는 true를 반환한다.', () => {
    const concertEventDetails = new ConcertEventDetails(
      1,
      1,
      addHoursToCurrentTime(-1),
      addHoursToCurrentTime(1),
      100,
      [],
    );
    expect(concertEventDetails.isConcertStarted()).toBe(true);
  });

  it('콘서트 예약 날짜가 아직 오지 않은 경우 isReservationStarted는 false를 반환한다.', () => {
    const concertEventDetails = new ConcertEventDetails(
      1,
      1,
      addHoursToCurrentTime(2),
      addHoursToCurrentTime(1),
      100,
      [],
    );
    expect(concertEventDetails.isReservationStarted()).toBe(false);
  });

  it('예약 가능한 콘서트 좌석은 만료 시각이 현재보다 이전이고, 결제가 완료되지 않은 좌석이다.', () => {
    const concertEventDetails = new ConcertEventDetails(
      1,
      1,
      new Date(),
      addHoursToCurrentTime(1),
      100,
      [
        {
          id: 1,
          concertEventId: 1,
          seatNumber: 1,
          expirationDate: addHoursToCurrentTime(1),
          isPaid: false,
          price: 10000,
        },
        {
          id: 2,
          concertEventId: 1,
          seatNumber: 2,
          expirationDate: addHoursToCurrentTime(-1),
          isPaid: false,
          price: 10000,
        },
        {
          id: 3,
          concertEventId: 1,
          seatNumber: 3,
          expirationDate: addHoursToCurrentTime(-1),
          isPaid: true,
          price: 10000,
        },
      ],
    );
    const availableSeats = concertEventDetails.getAvailableSeats();
    expect(availableSeats.length).toBe(1);
  });

  it('결제가 완료되지 않았더라도 좌석의 만료 시각이 현재보다 이후인 경우 다른 사람에 의해 예약되었다고 판단하여 예약이 불가능하다.', () => {
    const concertEventDetails = new ConcertEventDetails(
      1,
      1,
      new Date(),
      addHoursToCurrentTime(1),
      100,
      [
        {
          id: 1,
          concertEventId: 1,
          seatNumber: 1,
          expirationDate: addHoursToCurrentTime(1),
          isPaid: false,
          price: 10000,
        },
      ],
    );
    const availableSeats = concertEventDetails.getAvailableSeats();
    expect(availableSeats.length).toBe(0);
  });

  it('만료 시각이 현재보다 이전이지만 결제가 완료된 좌석은 예약이 불가능하다.', () => {
    const concertEventDetails = new ConcertEventDetails(
      1,
      1,
      new Date(),
      addHoursToCurrentTime(1),
      100,
      [
        {
          id: 1,
          concertEventId: 1,
          seatNumber: 1,
          expirationDate: addHoursToCurrentTime(-1),
          isPaid: true,
          price: 10000,
        },
      ],
    );
    const availableSeats = concertEventDetails.getAvailableSeats();
    expect(availableSeats.length).toBe(0);
  });
});
