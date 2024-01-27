import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentToken } from "./entities/payment-token.entity";

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([PaymentToken]),
    HttpModule
  ],
  exports: [PaymentService]
})
export class PaymentModule {}
