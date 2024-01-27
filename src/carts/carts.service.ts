import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable, NotFoundException } from "@nestjs/common";
import Redis from 'ioredis';
import { v4 } from "uuid";
import { UpdateCartDto } from './dto/update-cart.dto';

export type Cart = {
    items: CartItem[];
    totalAmount: number;
    totalPrice: number;
    addressId: number | null;
}

export type Meal = {
    name: string;
    image: string;
    description: string;
    additions: Addition[];
}

export type CartItem = {
    meal: Meal;
    amount: number;
    price: number;
    itemId: string;
    itemDescription: string;
}

export type Addition = {
    productId: string;
    amount: number;
    name: string;
    price: number | null;
}

@Injectable()
export class CartsService {
    constructor(@InjectRedis() private readonly redis: Redis) { }

    async get() {
        const cartsData = await this.redis.get('carts');
        const carts = await JSON.parse(cartsData);
        if (!carts) throw new NotFoundException('Carts are not found.')
        return carts;
    }

    async getByToken(token: string) {
        try {
            const carts = await this.get();
            const cart = carts[token];
            if (!cart) throw new NotFoundException('Cart is not found.');
            return cart;
        } catch (error) {
            throw error;
        }

    }

    async create() {
        try {
            const token: string = v4();
            const carts = await this.get();
            carts[token] = {}
            await this.redis.set('carts', JSON.stringify(carts))

            return { cart_token: token }
        } catch (error) {
            throw error;
        }
    }

    async update(token: string, updatedCartDto: UpdateCartDto) {
        try {
            const carts = await this.get();
            if (!carts[token]) throw new NotFoundException();

            carts[token] = updatedCartDto;
            await this.redis.set('carts', JSON.stringify(carts))
            return { message: 'Successfully updated the cart' }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Cart is not found, could not update the cart');
            } else {
                throw error;
            }
        }
    }

    async delete(token: string) {
        try {
            const carts = await this.get();
            if (!carts[token]) throw new NotFoundException();

            delete carts[token];
            await this.redis.set('carts', JSON.stringify(carts))
            return { message: 'Successfully deleted the cart' }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Cart is not found, could not delete the cart');
            } else {
                throw error;
            }
        }
    }
}