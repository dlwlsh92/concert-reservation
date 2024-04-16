import { ITokenParameterStorage } from "../../reservations/domain/interfaces/token-parameter-storage.interface";
import { Token } from "../../reservations/domain/token";

export class TokenParameterStorageStub implements ITokenParameterStorage {
  waitingCount: number = 0;
  /**
   * 실제 구현에서는 expirationDate를 redis에서 ttl로 관리하기 때문에 expirationDate를 따로 저장하지 않음.
   * 여기서는 테스트를 위해 expirationDate를 저장해서, 만료된 경우 null을 반환하도록 구현함.
   * */
  tokens: Map<
    string,
    {
      accessStartDate: Date;
      expirationDate: Date;
    }
  > = new Map();

  async getWaitingCount(): Promise<number> {
    return this.waitingCount;
  }

  async addWaitingCount(): Promise<number> {
    this.waitingCount++;
    return this.waitingCount;
  }

  async setToken(
    token: string,
    accessStartDate: Date,
    expirationDate: Date
  ): Promise<Token> {
    this.tokens.set(token, {
      accessStartDate: accessStartDate,
      expirationDate: expirationDate,
    });
    return new Token(token, accessStartDate);
  }

  async getToken(token: string): Promise<Token | null> {
    const tokenInfo = this.tokens.get(token);
    if (tokenInfo === undefined || tokenInfo.expirationDate < new Date()) {
      return null;
    }
    return new Token(token, tokenInfo.accessStartDate);
  }
}
