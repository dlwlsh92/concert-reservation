import { Injectable } from "@nestjs/common";
import { ITokenParameterStorage } from "../../../domain/reservations/repositories/token-parameter-storage.interface";
import { Token } from "../../../domain/reservations/entities/token";
import { RedisService } from "../../../database/redis/redis.service";

@Injectable()
export class TokenParameterRepository implements ITokenParameterStorage {
  constructor(private redisService: RedisService) {}
  async getToken(token: string): Promise<Token | null> {
    const accessStartMS = await this.redisService.get(token);
    if (!accessStartMS) return null;
    const milliseconds = parseInt(accessStartMS);
    if (isNaN(milliseconds)) return null;
    return new Token(token, new Date(milliseconds));
  }

  async setToken(
    token: string,
    accessStartDate: Date,
    expirationDate: Date
  ): Promise<Token> {
    const ttlMilliseconds = expirationDate.getTime() - new Date().getTime();
    await this.redisService.set(
      token,
      accessStartDate.getTime().toString(),
      ttlMilliseconds
    );
    return new Token(token, accessStartDate);
  }

  async getWaitingCount() {
    // redis에 저장된 waitingCount를 조회하여 반환한다.
    const waitingCount = await this.redisService.get("waitingCount");
    if (!waitingCount) return 0;
    return parseInt(waitingCount) || 0;
  }

  async addWaitingCount() {
    // redis에 저장된 waitingCount를 1 증가시킨다.
    // 만일 redis에 waitingCount가 없다면 1로 초기화 한다.
    // addWaitingCount가 호출될때마다 ttl을 지금으로부터 5분으로 설정한다.
    const redis = await this.redisService.getClient();
    await redis.incr("waitingCount");
    await redis.expire("waitingCount", 300);
    const newCount = await this.redisService.get("waitingCount");
    return newCount ? parseInt(newCount) : 1;
  }
}
