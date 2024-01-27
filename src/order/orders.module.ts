import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Order])
  ],
  exports: [OrdersService]
})
export class OrdersModule { }
