type TokenStatus = "pending" | "available";

export interface ValidationTokenRes {
  status: TokenStatus;
  waitingTime: number;
}
