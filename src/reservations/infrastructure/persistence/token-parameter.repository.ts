import { Injectable } from "@nestjs/common";
import { ITokenParameterStorage } from "../../domain/interfaces/token-parameter-storage.interface";
import { Token } from "../../domain/token";

@Injectable()
export class TokenParameterRepository implements ITokenParameterStorage {
  constructor() {}
  async getToken(token: string): Promise<Token> {
    // TODO: Implement this method
    return new Token("token", new Date());
  }

  async setToken(
    token: string,
    accessStartDate: Date,
    expirationDate: Date
  ): Promise<Token> {
    // TODO: Implement this method
    // 인자로 받은 Date 객체를 unix milliseconds로 변환하여 Token과 함께 저장하고 만료시간을 ttl로 설정
    return new Token("token", new Date());
  }

  async getWaitingCount() {
    // TODO: Implement this method
    return 100;
  }

  async addWaitingCount() {
    // TODO: Implement this method
    return 100;
  }
}
