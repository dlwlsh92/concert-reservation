import { reservationMockData } from "../test.entities";
import { addHoursToCurrentTime } from "../utils";
import { PaymentEligibilityStatus } from "../../reservations/domain/reservation";

describe("예약 관련 로직에 대한 단위 테스트", () => {
  describe("결제 전 예약이 유효한지 확인하는 로직에 대한 단위 테스트", () => {
    it("결제 만료 시간이 지난 경우 ReservationExpired를 반환한다.", () => {
      const reservation = reservationMockData({
        expirationDate: addHoursToCurrentTime(-1),
      });
      const result = reservation.isPaymentEligible();
      expect(result).toBe(PaymentEligibilityStatus.ReservationExpired);
    });

    it("이미 결제가 완료된 예약인 경우 ReservationConfirmed를 반환한다.", () => {
      const reservation = reservationMockData({ status: "confirmed" });
      const result = reservation.isPaymentEligible();
      expect(result).toBe(PaymentEligibilityStatus.ReservationConfirmed);
    });

    it("예약과 연결된 좌석의 상태가 만료되었을 경우 ", () => {
      const reservation = reservationMockData({
        seatExpirationDate: addHoursToCurrentTime(-1),
      });
      const result = reservation.isPaymentEligible();
      expect(result).toBe(PaymentEligibilityStatus.SeatExpired);
    });

    it("유효한 예약인 경우 Eligible를 반환한다.", () => {
      const reservation = reservationMockData({});
      const result = reservation.isPaymentEligible();
      expect(result).toBe(PaymentEligibilityStatus.Eligible);
    });
  });
});
