import { Controller } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypedRoute } from "@nestia/core";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * @ignore
   * */
  @TypedRoute.Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
