import { Injectable } from "@nestjs/common";
import { TokenManagementService } from "./token-management.service";

@Injectable()
export class ReservationService {
  constructor(
    private readonly tokenManagementService: TokenManagementService
  ) {}
}
