import {
  ITokenParameterStorage,
  ITokenParameterStorageToken,
} from '../../domain/reservations/repositories/token-parameter-storage.interface';
import { TokenManagementService } from '../../domain/reservations/application/token-management.service';
import { TokenParameterRepository } from '../../infrastructure/persistence/reservation/token-parameter.repository';
import { RedisService } from '../../database/redis/redis.service';
import { TestUtil } from './util';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticationService } from '../../domain/reservations/application/authentication.service';
import { ConfigService } from '@nestjs/config';

describe('예약 서비스를 이용할 수 있는 대기열이 정상적으로 작동하는지 확인함.', () => {
  let tokenParameterStorage: ITokenParameterStorage;
  let tokenManagementService: TokenManagementService;
  let authenticationService: AuthenticationService;
  let testUtil: TestUtil;
  let redisService: RedisService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        PrismaService,
        TokenManagementService,
        AuthenticationService,
        {
          provide: ITokenParameterStorageToken,
          useClass: TokenParameterRepository,
        },
        RedisService,
        TestUtil,
      ],
    }).compile();
    tokenManagementService = module.get<TokenManagementService>(
      TokenManagementService,
    );
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    tokenManagementService.numberPerCycle = 3;
    tokenManagementService.validTokenSeconds = 300;

    testUtil = module.get<TestUtil>(TestUtil);
    redisService = module.get<RedisService>(RedisService);
  });

  afterAll(async () => {
    const redis = await redisService.getClient();
    await redis.flushall();
  });

  it('대기열 토큰의 status가 사이클 계산에 따라 정확히 반환되는지 확인함.', async () => {
    const tokens: string[] = [];
    // 4개의 토큰을 생성
    for (let i = 0; i < 4; i++) {
      const token = await authenticationService.createToken();
      tokens.push(token);
    }
    /**
     * 현재 사이클을 3으로 설정하였으므로, 3개의 토큰은 사용 가능한 상태이고, 4번째 토큰은 대기열에 들어가야 합니다.
     * */
    const firstToken = tokens[0];
    const lastToken = tokens[3];

    const result1 = await authenticationService.validateToken(firstToken);
    const result2 = await authenticationService.validateToken(lastToken);
    expect(result1.status).toBe('available');
    expect(result2.status).toBe('pending');
  });

  it('마지막 토큰의 만료 시각까지 대기열 토큰이 생성되지 않으면 대기열 카운트가 초기화되는지 확인', async () => {
    tokenManagementService.validTokenSeconds = 3;

    for (let i = 0; i < 3; i++) {
      await authenticationService.createToken();
    }
    /**
     * 테스트를 위해 설정한 토큰 만료 시간인 3초 이후에 토큰을 생성하여 대기열 카운트가 초기화되는지 확인함.
     * 만일 대기열 카운트가 초기화되지 않았다면 lastToken의 status는 pending이 되어야 합니다.
     * */
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const lastToken = await authenticationService.createToken();
    const result = await authenticationService.validateToken(lastToken);
    expect(result.status).toBe('available');
  });
});
