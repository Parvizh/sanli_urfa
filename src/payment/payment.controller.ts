import { Body, Controller, Delete, Param, Post, Res, UseGuards } from "@nestjs/common";
import { PaymentService } from './payment.service';
import { AuthGuard } from "@nestjs/passport";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "../user/entities/user.entity";


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @GetUser() user: User) {
    return this.paymentService.create(createPaymentDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:token')
  delete(@Param('token') token: string) {
    return this.paymentService.deletePaymentToken(token)
  }

  @Post('/failed/:token')
  paymentFailed(@Param('token') token: string, @Res() response: any) {
    return response.redirect(`${process.env.FRONT_BASE_URL}payment-failed/${token}`);
  }

  @Post('/success/:token')
  paymentSuccess(@Param('token') token: string, @Res() response: any) {
    return response.redirect(`${process.env.FRONT_BASE_URL}cart/confirm/${token}`);
  }
}
