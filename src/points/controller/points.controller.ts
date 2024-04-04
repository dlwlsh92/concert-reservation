import {Body, Controller, Get, Param, Post} from '@nestjs/common';

@Controller('points')
export class PointsController {
    @Get('users/:userId')
    async getPoints(@Param('userId') userId: number) {
        return 100
    }

    @Post('users/:userId/charge')
    async chargePoints(
        @Param('userId') userId: number,
        @Body('amount') amount: number) {
        return 5000
    }
}
