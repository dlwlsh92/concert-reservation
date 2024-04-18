import { PrismaService } from "../../database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TestUtil {
  constructor(private readonly prisma: PrismaService) {}

  async createUser() {
    return this.prisma.user.create({
      data: {
        name: "test",
        point: 0,
        version: 0,
      },
    });
  }

  async deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
