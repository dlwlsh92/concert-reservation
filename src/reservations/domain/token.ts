enum TokenStatus {
  pending = "pending",
  available = "available",
}

type ValidationResponse = {
  status: TokenStatus;
  waitingSeconds: number;
};

export class Token {
  constructor(public token: string, public accessStartTime: Date) {}

  validateToken(currentTime: Date = new Date()): ValidationResponse {
    /**
     * 토큰 조회에 실패한 경우는 토큰이 만료된 경우로 따로 처리한다.
     * 유저가 토큰을 제시했지만 redis에 존재하지 않는 경우는 토큰이 만료되어 삭제된 경우이다.
     * */
    if (this.accessStartTime > currentTime) {
      return {
        status: TokenStatus.pending,
        waitingSeconds: Math.floor(
          (this.accessStartTime.getTime() - currentTime.getTime()) / 1000
        ),
      };
    } else {
      return {
        status: TokenStatus.available,
        waitingSeconds: 0,
      };
    }
  }
}
