import { Inject, Injectable } from "@nestjs/common";
import {
  ITokenParameterStorage,
  ITokenParameterStorageToken,
} from "../domain/interfaces/token-parameter-storage.interface";
import { getAccessStartDate } from "../domain/token";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class TokenManagementService {
  numberPerCycle: number = 50;
  validTokenSeconds: number = 300;
  constructor(
    @Inject(ITokenParameterStorageToken)
    private readonly tokenParameterStorage: ITokenParameterStorage
  ) {}

  async getAccessStartMilliSeconds() {
    const waitingCount = await this.tokenParameterStorage.getWaitingCount();
    const accesssStartDate = getAccessStartDate(
      this.numberPerCycle,
      this.validTokenSeconds,
      waitingCount
    );
    return accesssStartDate.getTime();
  }

  async createToken() {
    const token = uuidv4();
  }
}
