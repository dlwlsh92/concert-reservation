import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class TokenManagementService {
  constructor() {}

  async createToken() {
    const token = uuidv4();
    return token;
  }
}
