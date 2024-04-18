import { ITokenParameterStorage } from "../../domain/reservations/repositories/token-parameter-storage.interface";
import { TokenManagementService } from "../../domain/reservations/application/token-management.service";
import { TokenParameterRepository } from "../../domain/reservations/infrastructure/persistence/token-parameter.repository";
import { RedisService } from "../../database/redis/redis.service";

describe("예약 서비스를 이용할 수 있는 대기열이 정상적으로 작동하는지 확인함.", () => {
  let tokenParameterStorage: ITokenParameterStorage;
  let tokenManagementService: TokenManagementService;
  beforeEach(() => {
    tokenParameterStorage = new TokenParameterRepository(new RedisService());
    tokenManagementService = new TokenManagementService(tokenParameterStorage);

    tokenManagementService.validTokenSeconds = 300;
    tokenManagementService.numberPerCycle = 20;
  });

  it("test", () => {
    expect(1).toBe(1);
  });
});
