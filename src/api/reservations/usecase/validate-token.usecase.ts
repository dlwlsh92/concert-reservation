import { Injectable } from "@nestjs/common";
import { AuthenticationService } from "../../../domain/reservations/application/authentication.service";

@Injectable()
export class ValidateTokenUsecase {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async execute(token: string) {
    return this.authenticationService.validateToken(token);
  }
}
