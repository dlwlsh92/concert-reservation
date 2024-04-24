import { AuthenticationService } from '../../../domain/reservations/application/authentication.service';
import { TokenParameterStorageStub } from '../tokenParameterStrorageStub';
import { TokenManagementService } from '../../../domain/reservations/application/token-management.service';

describe('예약 서비스를 이용하기 위한 토큰 인증 서비스에 대한 단위 테스트', () => {
  let authenticationService: AuthenticationService;
  let tokenParameterStorage: TokenParameterStorageStub;
  let tokenManagementService: TokenManagementService;

  beforeAll(() => {
    tokenParameterStorage = new TokenParameterStorageStub();
    tokenManagementService = new TokenManagementService(tokenParameterStorage);
    tokenManagementService.numberPerCycle = 50;
    tokenManagementService.validTokenSeconds = 300;
    authenticationService = new AuthenticationService(tokenManagementService);
  });

  describe('토큰 생성 로직 테스트', () => {
    it('토큰을 생성하면 생성된 토큰이 반환된다.', async () => {
      const token = await authenticationService.createToken();
      expect(token).toBeDefined();
    });
  });

  describe('토큰 유효성 검사 로직 테스트', () => {
    it('토큰이 유효한 경우 토큰의 상태는 available 대기 시간은 0을 반환한다.', async () => {
      tokenParameterStorage.waitingCount = 0;
      const token = await authenticationService.createToken();
      const result = await authenticationService.validateToken(token);
      expect(result.status).toBe('available');
      expect(result.waitingSeconds).toEqual(0);
    });

    it('토큰이 아직 예약 서비스를 이용할 수 없는 경우 토큰의 상태는 pending 대기 시간은 0보다 큰 값을 반환한다.', async () => {
      tokenParameterStorage.waitingCount = 100;
      const token = await authenticationService.createToken();
      const result = await authenticationService.validateToken(token);
      expect(result.status).toBe('pending');
      expect(result.waitingSeconds).toBeGreaterThan(0);
    });
  });
});
