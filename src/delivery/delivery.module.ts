import { Module } from "@nestjs/common";
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { CartsModule } from "../carts/carts.module";
import { HttpModule } from "@nestjs/axios";
import { AddressModule } from "src/address/address.module";
import { OrdersModule } from "src/order/orders.module";
import { PaymentModule } from "../payment/payment.module";

@Module({
    providers: [DeliveryService],
    controllers: [DeliveryController],
    imports: [CartsModule, HttpModule, AddressModule, OrdersModule, PaymentModule]
})

export class DeliveryModule { }