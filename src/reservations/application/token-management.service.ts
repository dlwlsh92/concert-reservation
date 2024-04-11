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

  async getExpirationMilliSeconds() {
    const waitingCount = await this.tokenParameterStorage.getWaitingCount();
    const expirationDate = getAccessStartDate(
      this.numberPerCycle,
      this.validTokenSeconds,
      waitingCount
    );
    return expirationDate.getTime();
  }
}
