import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentUsecase } from '../../api/payment/usecase/create-payment.usecase';
import { PrismaService } from '../../database/prisma/prisma.service';
import { OrderService } from '../../domain/payment/application/order.service';
import { PaymentValidationService } from '../../domain/reservations/application/payment-validation.service';
import { PointService } from '../../domain/points/application/point.service';
import { IOrderRepositoryToken } from '../../domain/payment/repositories/order-write.interface';
import { OrderWriteRepository } from '../../infrastructure/persistence/payment/order-write.repository';
import { IReservationReaderRepositoryToken } from '../../domain/reservations/repositories/reservation-reader.interface';
import { ReservationReaderRepository } from '../../infrastructure/persistence/reservation/reservation-reader.repository';
import { IPointReaderToken } from '../../domain/points/repositories/point-reader.interface';
import { PointReaderRepository } from '../../infrastructure/persistence/point/point-reader.repository';
import { IPointWriteToken } from '../../domain/points/repositories/point-write.interface';
import { PointWriteRepository } from '../../infrastructure/persistence/point/point-write.repository';
import { IConcertDetailsReaderToken } from '../../domain/reservations/repositories/concert-details-reader.interface';
import { ConcertDetailsReaderRepository } from '../../infrastructure/persistence/reservation/concert-details-reader.repository';
import { IReservationWriteToken } from '../../domain/reservations/repositories/reservation-write.interface';
import { ReservationWriteRepository } from '../../infrastructure/persistence/reservation/reservation-write.repository';
import { ReservationService } from '../../domain/reservations/application/reservation.service';
import { TestUtil } from './util';

describe('결제 usecase 테스트', () => {
  let createPaymentUsecase: CreatePaymentUsecase;
  let reservationService: ReservationService;
  let testUtil: TestUtil;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestUtil,
        PrismaService,
        OrderService,
        CreatePaymentUsecase,
        PaymentValidationService,
        PointService,
        ReservationService,
        {
          provide: IOrderRepositoryToken,
          useClass: OrderWriteRepository,
        },
        {
          provide: IReservationReaderRepositoryToken,
          useClass: ReservationReaderRepository,
        },
        {
          provide: IPointReaderToken,
          useClass: PointReaderRepository,
        },
        {
          provide: IPointWriteToken,
          useClass: PointWriteRepository,
        },
        {
          provide: IConcertDetailsReaderToken,
          useClass: ConcertDetailsReaderRepository,
        },
        {
          provide: IReservationWriteToken,
          useClass: ReservationWriteRepository,
        },
      ],
    }).compile();
    reservationService = module.get<ReservationService>(ReservationService);
    createPaymentUsecase =
      module.get<CreatePaymentUsecase>(CreatePaymentUsecase);
    testUtil = module.get<TestUtil>(TestUtil);
  });

  it('유효한 결제 요청이 들어왔을 때, 결제가 정상적으로 이루어져야 함.', async () => {
    const concert = await testUtil.createConcert();
    const concertEvent = await testUtil.createConcertEvent(concert.id, 3);
    const user = await testUtil.createUserWithPoint(10000);
    const seatsPromise = Array.from({
      length: concertEvent.maxSeatCapacity,
    }).map(async (_, index) => {
      return testUtil.createSeat(concertEvent.id, index + 1);
    });
    const seats = await Promise.all(seatsPromise);
    const reservation = await reservationService.reserveSeat(
      seats[0].id,
      concertEvent.id,
      user.id,
    );
    const order = await createPaymentUsecase.execute(reservation.id!);
    const seat = await testUtil.getSeatById(seats[0].id);

    expect(order).toBeDefined();
    expect(order.userId).toBe(user.id);
    expect(order.reservationId).toBe(reservation.id);
    expect(seat?.isPaid).toBe(true);
  });
});
