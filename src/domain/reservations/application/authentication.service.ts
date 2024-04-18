import { HttpException, Injectable } from "@nestjs/common";
import { TokenManagementService } from "./token-management.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthenticationService {
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
    const createdTokenInstance = await this.tokenManagementService.setToken(
      token,
      accessStartDate,
      expirationDate
    );
    return createdTokenInstance.token;
  }

  async validateToken(token: string) {
    const tokenInstance = await this.tokenManagementService.getToken(token);
    if (tokenInstance === null) {
      throw new HttpException("토큰이 만료되었습니다.", 410);
    }
    return tokenInstance.validateToken(new Date());
  }
}
