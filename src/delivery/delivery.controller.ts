import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { CartToken } from "src/carts/decorators/cart-token.decorator";
import { User } from "../user/entities/user.entity";
import { DeliveryService } from "./delivery.service";
import { CreateDeliveryDto } from "./dto/create-delivery.dto";
import { HasPayedGuard } from "./guards/has-payed.guard";

@UseGuards(AuthGuard('jwt'))
@Controller('delivery')
export class DeliveryController {
    constructor(private readonly deliverService: DeliveryService) { }

    @Post()
    @UseGuards(HasPayedGuard)
    create(@GetUser() user: User, @CartToken() cartToken: string, @Body() createDeliveryDto: CreateDeliveryDto) {
        return this.deliverService.create(user, cartToken, createDeliveryDto);
    }
} 