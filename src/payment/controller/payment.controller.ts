import {Controller, Param, Post} from '@nestjs/common';

@Controller('payment')
export class PaymentController {
    @Post(':reservationId')
    async createPayment(@Param('reservationId') reservationId: number) {
        return true
    }
}
