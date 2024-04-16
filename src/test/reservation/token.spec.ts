import { getAccessStartDate, Token } from "../../reservations/domain/token";

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

describe("예약 대기열 토큰의 시작 시간을 계산하는 로직에 대한 단위 테스트", () => {
  it("현재 대기열의 숫자가 cycle의 숫자보다 작을 경우 예약 서비스를 이용할 수 있는 시작 시간을 반환한다.", () => {
    const numberPerCycle = 50;
    const validTokenSeconds = 60;
    const waitingCount = 20;
    const currentTime = new Date();
    const accessStartDate = getAccessStartDate(
      numberPerCycle,
      validTokenSeconds,
      waitingCount
    );

    expect(currentTime.getTime()).toBeGreaterThanOrEqual(
      accessStartDate.getTime()
    );
  });

  it("현재 대기열의 숫자가 cycle의 숫자보다 클 경우 예약 서비스를 이용할 수 없는 시작 시간을 반환한다.", () => {
    const numberPerCycle = 50;
    const validTokenSeconds = 60;
    const waitingCount = 100;
    const currentTime = new Date();

    const accessStartDate = getAccessStartDate(
      numberPerCycle,
      validTokenSeconds,
      waitingCount
    );

    expect(currentTime.getTime()).toBeLessThan(accessStartDate.getTime());
  });
});
