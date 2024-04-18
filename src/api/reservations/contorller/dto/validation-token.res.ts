type TokenStatus = "pending" | "available";

export interface ValidationTokenRes {
  status: TokenStatus;
  waitingSeconds: number;
}
