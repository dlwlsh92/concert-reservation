import { PrismaService } from '../../database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { addHoursToCurrentTime } from '../utils';

@Injectable()
export class TestUtil {
  constructor(private readonly prisma: PrismaService) {}

  async createUser() {
    return this.prisma.user.create({
      data: {
        name: 'test',
        point: 0,
        version: 0,
      },
    });
  }

  async getSeatById(seatId: number) {
    return this.prisma.seat.findUnique({
      where: {
        id: seatId,
      },
    });
  }

  async createUserWithPoint(point: number) {
    return this.prisma.user.create({
      data: {
        name: 'test',
        point: point,
        version: 1,
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

  async createConcert() {
    return this.prisma.concert.create({
      data: {
        concertName: 'test',
      },
    });
  }

  async createConcertEvent(concertId: number, maxSeatCapacity: number) {
    return this.prisma.concertEvent.create({
      data: {
        concertId: concertId,
        startDate: addHoursToCurrentTime(10),
        reservationDate: addHoursToCurrentTime(-1),
        maxSeatCapacity: maxSeatCapacity,
      },
    });
  }

  async createSeats(concertEventId: number, maxCapacity: number) {
    return this.prisma.seat.createMany({
      data: Array.from({ length: maxCapacity }).map((_, index) => ({
        concertEventId: concertEventId,
        seatNumber: index + 1,
        expirationDate: addHoursToCurrentTime(-1),
        isPaid: false,
        price: 10000,
        version: 1,
      })),
    });
  }

  async createSeat(concertEventId: number, seatNumber: number) {
    return this.prisma.seat.create({
      data: {
        concertEventId: concertEventId,
        seatNumber: seatNumber,
        expirationDate: addHoursToCurrentTime(-1),
        isPaid: false,
        price: 10000,
        version: 1,
      },
    });
  }
}
