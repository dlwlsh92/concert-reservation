import { TokenParameterStorageStub } from "../tokenParameterStrorageStub";
import { TokenManagementService } from "../../../domain/reservations/application/token-management.service";
import { getAccessStartDate } from "../../../domain/reservations/entities/token";

describe("예약 대기열을 관리하기 위한 토큰 관리 서비스 테스트", () => {
  let tokenManagementService: TokenManagementService;
  let tokenParameterStorage: TokenParameterStorageStub;

  beforeEach(() => {
    tokenParameterStorage = new TokenParameterStorageStub();
    tokenManagementService = new TokenManagementService(tokenParameterStorage);
    tokenManagementService.numberPerCycle = 50;
    tokenManagementService.validTokenSeconds = 300;
  });

  describe("현재 대기열 숫자와 토큰 유효 시간에 따라 예약 서비스를 이용할 수 있는 시작 시간을 반환한다.", () => {
    it("대기열 숫자가 cycle의 숫자보다 작을 경우 예약 서비스를 이용할 수 있는 시작 시간을 반환한다.", async () => {
      tokenParameterStorage.waitingCount = 20;
      const accessStartDate = await tokenManagementService.getAccessStartDate();
      const currentTime = new Date();
      expect(currentTime.getTime()).toBeGreaterThanOrEqual(
        accessStartDate.getTime()
      );
    });

    it("대기열 숫자가 cycle의 숫자보다 클 경우 예약 서비스를 이용할 수 없는 시작 시간을 반환한다.", async () => {
      tokenParameterStorage.waitingCount = 100;
      const accessStartDate = await tokenManagementService.getAccessStartDate();
      const currentTime = new Date();
      expect(currentTime.getTime()).toBeLessThan(accessStartDate.getTime());
    });

    it("대기열 숫자에 따라 정확한 사이클의 시작 시간을 반환한다.", async () => {
      tokenParameterStorage.waitingCount = 100;
      const accessStartDate = await tokenManagementService.getAccessStartDate();
      const expectedAccessStartDate = getAccessStartDate(
        tokenManagementService.numberPerCycle,
        tokenManagementService.validTokenSeconds,
        tokenParameterStorage.waitingCount
      );
      const tolerance = 1000; // milliseconds
      // Check if the actual time is within the tolerance of the expected time
      const timeDifference = Math.abs(
        accessStartDate.getTime() - expectedAccessStartDate.getTime()
      );
      expect(timeDifference).toBeLessThanOrEqual(tolerance);
    });
  });

  it("예약 서비스를 이용할 수 있는 시작 시간으로부터 유효 시간만큼 더한 시간을 만료 시간으로 반환한다.", async () => {
    const accessStartDate = new Date();
    const expirationDate = await tokenManagementService.getExpirationDate(
      accessStartDate
    );
    const expectedExpirationDate = new Date(
      accessStartDate.getTime() +
        tokenManagementService.validTokenSeconds * 1000
    );
    expect(expirationDate).toEqual(expectedExpirationDate);
  });

  it("토큰을 생성하면 대기열 숫자를 증가시키고, 생성된 토큰을 반환한다.", async () => {
    const token = "token";
    const accessStartDate = new Date();
    const expirationDate = new Date(
      accessStartDate.getTime() +
        tokenManagementService.validTokenSeconds * 1000
    );
    const createdTokenInstance = await tokenManagementService.setToken(
      token,
      accessStartDate,
      expirationDate
    );
    expect(createdTokenInstance.token).toBe(token);
    expect(createdTokenInstance.accessStartTime).toBe(accessStartDate);
    expect(tokenParameterStorage.waitingCount).toBe(1);
  });

  describe("토큰을 조회하는 로직 테스트", () => {
    it("토큰이 존재하지 않는 경우 null을 반환한다.", async () => {
      const token = await tokenManagementService.getToken("non-existing-token");
      expect(token).toBeNull();
    });

    it("토큰이 존재하는 경우 토큰을 반환한다.", async () => {
      const token = await tokenManagementService.setToken(
        "token",
        new Date(),
        new Date()
      );
      const retrievedToken = await tokenManagementService.getToken("token");
      expect(retrievedToken).toEqual(token);
    });
  });
});
