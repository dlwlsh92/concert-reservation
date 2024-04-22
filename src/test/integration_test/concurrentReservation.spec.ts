import { Test, TestingModule } from "@nestjs/testing";
import { ReservationService } from "../../domain/reservations/application/reservation.service";
import { IConcertDetailsReaderToken } from "../../domain/reservations/repositories/concert-details-reader.interface";
import { ConcertDetailsReaderRepository } from "../../infrastructure/reservation/persistence/concert-details-reader.repository";
import { IReservationWriteToken } from "../../domain/reservations/repositories/reservation-write.interface";
import { ReservationWriteRepository } from "../../infrastructure/reservation/persistence/reservation-write.repository";
import { PrismaService } from "../../database/prisma/prisma.service";
import { TestUtil } from "./util";

describe("좌석 예약 관련 테스트", () => {
  let reservationService: ReservationService;
  let testUtil: TestUtil;

  beforeAll(async () => {
    let module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: IConcertDetailsReaderToken,
          useClass: ConcertDetailsReaderRepository,
        },
        {
          provide: IReservationWriteToken,
          useClass: ReservationWriteRepository,
        },
        PrismaService,
        TestUtil,
      ],
    }).compile();
    reservationService = module.get<ReservationService>(ReservationService);
    testUtil = module.get<TestUtil>(TestUtil);
  });

  it("동일한 좌석은 한 사람만 예약할 수 있다.", async () => {
    const concert = await testUtil.createConcert();
    const concertEvent = await testUtil.createConcertEvent(concert.id, 3);

    const tenUsers = Array.from({ length: 10 }).map(async (_, index) => {
      return testUtil.createUser();
    });
    const users = await Promise.all(tenUsers);
    const seatsPromise = Array.from({
      length: concertEvent.maxSeatCapacity,
    }).map(async (_, index) => {
      return testUtil.createSeat(concertEvent.id, index + 1);
    });
    const seats = await Promise.all(seatsPromise);
    const reservationSeatPromise = users.map(async (user, index) => {
      return reservationService.reserveSeat(
        seats[0].id,
        concertEvent.id,
        user.id
      );
    });
    const reservationSeats = await Promise.allSettled(reservationSeatPromise);
    const successReservations = reservationSeats.filter(
      (result) => result.status === "fulfilled"
    );
    expect(successReservations.length).toBe(1);
  });
});
