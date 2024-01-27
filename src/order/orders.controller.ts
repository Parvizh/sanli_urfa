import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { IsAdminGuard } from 'src/auth/guards/is-admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  get() {
    return this.ordersService.get();
  }

  @Get('one-order/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('current-user')
  getByUser(@GetUser('id') userId: number) {
    return this.ordersService.getByUser(userId);
  }

  // @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @Patch('complete/:id')
  completeOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.completeOrder(id);
  }

}
