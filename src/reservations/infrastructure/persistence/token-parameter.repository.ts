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

  async setToken(token: string): Promise<Token> {
    // TODO: Implement this method
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
