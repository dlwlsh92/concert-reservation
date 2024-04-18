import { Injectable } from "@nestjs/common";
import { AuthenticationService } from "../../../domain/reservations/application/authentication.service";

@Injectable()
export class CreateTokenUsecase {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async execute() {
    return this.authenticationService.createToken();
  }
}
