import { PointService } from '../../domain/points/application/point.service';
import { Test, TestingModule } from '@nestjs/testing';
import { IPointReaderToken } from '../../domain/points/repositories/point-reader.interface';
import { PointReaderRepository } from '../../infrastructure/point/persistence/point-reader.repository';
import { IPointWriteToken } from '../../domain/points/repositories/point-write.interface';
import { PointWriteRepository } from '../../infrastructure/point/persistence/point-write.repository';
import { PrismaService } from '../../database/prisma/prisma.service';
import { TestUtil } from './util';
import { Point } from '../../domain/points/entities/point';

describe('포인트 사용/차감에 대한 결과 계산이 정확하다.', () => {
  let pointService: PointService;
  let testUtil: TestUtil;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointService,
        PrismaService,
        TestUtil,
        {
          provide: IPointReaderToken,
          useClass: PointReaderRepository,
        },
        {
          provide: IPointWriteToken,
          useClass: PointWriteRepository,
        },
      ],
    }).compile();
    pointService = module.get<PointService>(PointService);
    testUtil = module.get<TestUtil>(TestUtil);
  });

  it('포인트 충전, 차감이 정상적으로 작동한다.', async () => {
    const user = await testUtil.createUser();

    // allSettled를 사용하여 Promise.allSettled의 결과를 확인합니다.
    const allSettled = await Promise.allSettled([
      pointService.addPoints(user.id, 10000),
      pointService.subtractPoints(user.id, 5000),
      pointService.subtractPoints(user.id, 1000),
      pointService.subtractPoints(user.id, 3000),
    ]);

    const points: Point[] = [];
    allSettled.map((result) => {
      if (result.status === 'fulfilled') {
        points.push(result.value);
      }
    });

    const result = await pointService.getPoints(user.id);
    const target = points.find((point) => point.version === result.version);
    expect(result.point).toEqual(target?.point);
  });
});
