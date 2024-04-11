import { Injectable } from "@nestjs/common";
import { TokenManagementService } from "./token-management.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ReservationService {
  constructor(
    private readonly tokenManagementService: TokenManagementService
  ) {}

  async createToken() {
    const token = uuidv4();
    const accessStartDate =
      await this.tokenManagementService.getAccessStartDate();
    const expirationDate = await this.tokenManagementService.getExpirationDate(
      accessStartDate
    );
  }
}
