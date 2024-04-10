import { reservationMockData } from "./test.entity";
import { addHoursToCurrentTime } from "./utils";
import { PaymentEligibilityStatus } from "../reservations/domain/reservation";
import { Token } from "../reservations/domain/token";

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

    it("예약과 연결된 좌석의 상태가 reserved가 아닌 경우 SeatNotReserved를 반환한다.", () => {
      const reservation = reservationMockData({ seatStatus: "available" });
      const result = reservation.isPaymentEligible();
      expect(result).toBe(PaymentEligibilityStatus.SeatNotReserved);
    });

    it("유효한 예약인 경우 Eligible를 반환한다.", () => {
      const reservation = reservationMockData({});
      const result = reservation.isPaymentEligible();
      expect(result).toBe(PaymentEligibilityStatus.Eligible);
    });
  });

  describe("예약 대기열을 관리하기 위한 토큰에 대한 단위 테스트", () => {
    it("예약 서비스를 이용할 수 있는 시간에 도달하지 않은 경우 status는 pending이고, 대기 시간을 반환한다.", () => {
      const currentTime = new Date();
      const accessStartTime = new Date(currentTime.getTime() + 1000 * 60 * 10);
      const token = new Token("token", accessStartTime);
      const result = token.validateToken(currentTime);

      expect(result.status).toBe("pending");
      expect(result.waitingSeconds).toBe(
        Math.floor((accessStartTime.getTime() - currentTime.getTime()) / 1000)
      );
    });

    it("예약 서비스를 이용할 수 있는 시간에 도달한 경우 status는 available이고, 대기 시간은 0이다.", () => {
      const currentTime = new Date();
      const accessStartTime = new Date(currentTime.getTime() - 1000 * 60 * 3);
      const token = new Token("token", accessStartTime);
      const result = token.validateToken(currentTime);

      expect(result.status).toBe("available");
      expect(result.waitingSeconds).toBe(0);
    });
  });
});
