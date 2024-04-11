import { Injectable } from "@nestjs/common";
import { TokenManagementService } from "./token-management.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ReservationService {
  constructor(
    private readonly tokenManagementService: TokenManagementService
  ) {}

  createToken() {
    const token = uuidv4();
  }
}
