import { Inject, Injectable } from "@nestjs/common";
import {
  ITokenParameterStorage,
  ITokenParameterStorageToken,
} from "../domain/interfaces/token-parameter-storage.interface";
import { getAccessStartDate } from "../domain/token";

@Injectable()
export class TokenManagementService {
  numberPerCycle: number = 50;
  validTokenSeconds: number = 300;
  constructor(
    @Inject(ITokenParameterStorageToken)
    private readonly tokenParameterStorage: ITokenParameterStorage
  ) {}

  async getAccessStartDate() {
    const waitingCount = await this.tokenParameterStorage.getWaitingCount();
    return getAccessStartDate(
      this.numberPerCycle,
      this.validTokenSeconds,
      waitingCount
    );
  }

  async getExpirationDate(accesssStartDate: Date) {
    return new Date(accesssStartDate.getTime() + this.validTokenSeconds * 1000);
  }

  async setToken(token: string, accessStartDate: Date, expirationDate: Date) {
    return this.tokenParameterStorage.setToken(
      token,
      accessStartDate,
      expirationDate
    );
  }
}
