import { PointReaderInterface } from '../../../domain/points/repositories/point-reader.interface';
import { PointWriteInterface } from '../../../domain/points/repositories/point-write.interface';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { PointService } from '../../../domain/points/application/point.service';
import { Point } from '../../../domain/points/entities/point';

describe('포인트 관련 로직 테스트', () => {
  let pointService: PointService;
  let pointReaderRepository: jest.Mocked<PointReaderInterface>;
  let pointWriteRepository: jest.Mocked<PointWriteInterface>;
  let prisma: PrismaService;

  beforeAll(() => {
    pointReaderRepository = {
      getPoint: jest.fn(),
    };
    pointWriteRepository = {
      addPoint: jest.fn(),
      subtractPoint: jest.fn(),
    };
    prisma = new PrismaService();

    pointService = new PointService(
      pointReaderRepository,
      pointWriteRepository,
      prisma
    );
  });

  it('포인트 정보가 없을 경우 404 에러를 반환한다.', async () => {
    pointReaderRepository.getPoint.mockResolvedValue(null);

    try {
      await pointService.getPoints(1);
    } catch (e) {
      expect(e.message).toBe('포인트 정보를 찾을 수 없습니다.');
      expect(e.status).toBe(404);
    }
  });

  it('포인트를 추가한다.', async () => {
    pointReaderRepository.getPoint.mockResolvedValue(new Point(1, 0, 1));
    pointWriteRepository.addPoint.mockResolvedValue(new Point(1, 100, 1));

    const result = await pointService.addPoints(1, 100);
    expect(result.point).toBe(100);
  });

  it('포인트 차감 시 잔액이 부족할 경우 402 에러를 반환한다.', async () => {
    pointReaderRepository.getPoint.mockResolvedValue(new Point(1, 100, 1));
    try {
      await pointService.subtractPoints(1, 101);
    } catch (e) {
      expect(e.message).toBe('잔액이 부족합니다.');
      expect(e.status).toBe(402);
    }
  });

  it('포인트를 차감한다.', async () => {
    pointReaderRepository.getPoint.mockResolvedValue(new Point(1, 100, 1));
    pointWriteRepository.subtractPoint.mockResolvedValue(new Point(1, 50, 1));

    const result = await pointService.subtractPoints(1, 50);
    expect(result.point).toBe(50);
  });
});
