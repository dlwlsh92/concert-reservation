import { IReservationReaderRepository } from "../../../domain/reservations/repositories/reservation-reader.interface";
import { PaymentValidationService } from "../../../domain/reservations/application/payment-validation.service";
import { reservationMockData } from "../../test.entities";
import { addHoursToCurrentTime } from "../../utils";

describe("결제를 위한 예약을 검증하는 로직 테스트", () => {
  let reservationReaderRepository: jest.Mocked<IReservationReaderRepository>;
  let paymentValidationService: PaymentValidationService;

  beforeAll(() => {
    reservationReaderRepository = {
      findReservationById: jest.fn(),
    };
    paymentValidationService = new PaymentValidationService(
      reservationReaderRepository
    );
  });

  it("예약이 존재하지 않을 경우 404 에러를 반환한다.", async () => {
    reservationReaderRepository.findReservationById.mockResolvedValue(null);
    try {
      await paymentValidationService.validateReservationForPayment(1);
    } catch (e) {
      expect(e.message).toBe("예약이 존재하지 않습니다.");
      expect(e.status).toBe(404);
    }
  });

  it("결제 만료 시간이 지난 경우 410 에러를 반환한다.", async () => {
    reservationReaderRepository.findReservationById.mockResolvedValue(
      reservationMockData({
        expirationDate: addHoursToCurrentTime(-1),
      })
    );
    try {
      await paymentValidationService.validateReservationForPayment(1);
    } catch (e) {
      expect(e.message).toBe("Reservation expired");
      expect(e.status).toBe(410);
    }
  });

  it("이미 결제가 완료된 경우 409 에러를 반환한다.", async () => {
    reservationReaderRepository.findReservationById.mockResolvedValue(
      reservationMockData({
        status: "confirmed",
      })
    );
    try {
      await paymentValidationService.validateReservationForPayment(1);
    } catch (e) {
      expect(e.message).toBe("Reservation already confirmed");
      expect(e.status).toBe(409);
    }
  });

  it("유효한 예약인 경우 예약 정보를 반환한다.", async () => {
    const reservation = reservationMockData({});
    reservationReaderRepository.findReservationById.mockResolvedValue(
      reservation
    );
    const result = await paymentValidationService.validateReservationForPayment(
      1
    );
    expect(result).toBe(reservation);
  });
});
