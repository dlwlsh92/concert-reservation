import { Point, StatusMessage } from "../../domain/points/entities/point";

describe("포인트 관련 로직에 대한 단위 테스트", () => {
  it("포인트를 충전하는 경우 충전된 포인트를 반환한다.", () => {
    const point = new Point(1, 100);
    const result = point.add(100);
    expect(result.point).toBe(200);
    expect(result.status).toBe(true);
  });

  it("포인트를 차감하는 경우 차감된 포인트를 반환한다.", () => {
    const point = new Point(1, 100);
    const result = point.subtract(50);
    expect(result.point).toBe(50);
    expect(result.status).toBe(true);
  });

  it("포인트를 차감하는데 차감할 포인트가 현재 포인트보다 큰 경우 차감에 실패한다.", () => {
    const point = new Point(1, 100);
    const result = point.subtract(200);
    expect(result.point).toBe(100);
    expect(result.status).toBe(false);
    expect(result.statusMessage).toBe(StatusMessage.NotEnoughPoint);
  });
});
