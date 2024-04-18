export enum StatusMessage {
  NotEnoughPoint = "NotEnoughPoint",
  Success = "Success",
}
interface Response {
  status: boolean;
  point: number;
  statusMessage: StatusMessage;
}

export class Point {
  constructor(
    public userId: number,
    public point: number,
    public version?: number
  ) {}

  add(amount: number): Response {
    this.point += amount;
    return {
      status: true,
      point: this.point,
      statusMessage: StatusMessage.Success,
    };
  }

  subtract(amount: number): Response {
    if (this.point < amount) {
      return {
        status: false,
        point: this.point,
        statusMessage: StatusMessage.NotEnoughPoint,
      };
    }
    this.point -= amount;
    return {
      status: true,
      point: this.point,
      statusMessage: StatusMessage.Success,
    };
  }
}
