import { Controller, Post, Get, Delete, Patch, ParseUUIDPipe, Param, Body } from "@nestjs/common";
import { CartsService } from './carts.service';
import { CartToken } from "./decorators/cart-token.decorator";
import { UpdateCartDto } from './dto/update-cart.dto';
@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Get()
    get() {
        return this.cartsService.get();
    }

    @Get('single')
    getByToken(@CartToken(ParseUUIDPipe) cartToken: string) {
        return this.cartsService.getByToken(cartToken);
    }

    @Post()
    create() {
        return this.cartsService.create();
    }

    @Patch()
    update(@CartToken(ParseUUIDPipe) cartToken: string, @Body() updateCartDto: UpdateCartDto) {
        return this.cartsService.update(cartToken, updateCartDto);
    }

    @Delete()
    delete(@CartToken(ParseUUIDPipe) cartToken: string) {
        return this.cartsService.delete(cartToken);
    }
}