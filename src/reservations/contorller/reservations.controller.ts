import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';

@Controller('reservations')
export class ReservationsController {

    @Post('token')
    async createToken(
        @Body('userId') userId: number,
        @Body('concertId') concertId: number
    ) {
        return 'token'
    }

    @Get('token/validation')
    async validateToken(
        @Query('reservationToken') reservationToken: string
    ) {
        return {
            status: 'available',
            waitingTime: null,
        }
    }

    @Get(':concertId/avaliable-dates')
    async getAvailableDates(
        @Param('concertId') concertId: number
    ) {
        return [
            {
                concertEventId: 1,
                startDate: new Date(),
                maxSeatCapacity: 50,
                currentSeatCount: 10,
            }
        ]
    }

    @Get(':concertEventId/avaliable-seats')
    async getAvailableSeats(
        @Param('concertEventId') concertEventId: number
    ) {
        return [
            {
                seatsId: 1,
                seatNumber: 1,
            },
            {
                seatsId: 2,
                seatNumber: 2,
            }
        ]
    }

    @Post('seats/:seatsId/assign')
    async assignSeat(
        @Param('seatsId') seatsId: number,
        @Body('concertEventId') concertEventId: string
    ) {
        return true
    }
}
