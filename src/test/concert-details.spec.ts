import {
  ConcertEventDetails,
  SeatStatus,
} from "../reservations/domain/concert-event-details";

describe("콘서트 관련 정보 조회 테스트 로직", () => {
  it("이용가능한 콘서트 좌석은 seat의 status가 available인 것이다.", () => {
    const concertEventDetails = new ConcertEventDetails(1, 1, new Date(), 100, [
      {
        id: 1,
        concertEventId: 1,
        seatNumber: 1,
        seatStatus: SeatStatus.Available,
        price: 10000,
      },
      {
        id: 2,
        concertEventId: 1,
        seatNumber: 2,
        seatStatus: SeatStatus.Reserved,
        price: 10000,
      },
      {
        id: 3,
        concertEventId: 1,
        seatNumber: 3,
        seatStatus: SeatStatus.Available,
        price: 10000,
      },
    ]);
    const availableSeats = concertEventDetails.getAvailableSeats();
    expect(availableSeats.length).toBe(2);
    expect(availableSeats[0].seatStatus).toBe(SeatStatus.Available);
    expect(availableSeats[1].seatStatus).toBe(SeatStatus.Available);
  });
});
