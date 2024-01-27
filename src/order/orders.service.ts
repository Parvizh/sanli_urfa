import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly userService: UserService
  ) { }

  async create(createOrderDto: CreateOrderDto, user: User) {
    try {
      const order = this.orderRepository.create({
        user,
        cart: JSON.parse(JSON.stringify(createOrderDto.cart))
      })
      const data = await this.orderRepository.save(order);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async get() {
    const orders = await this.orderRepository.find();
    if (!orders || orders.length === 0) throw new NotFoundException('No orders were found');
    return orders;
  }

  async getByUser(id: number) {
    const user = await this.userService.getById(id) as unknown;
    const orders = await this.orderRepository.findBy({ user });
    if (!orders || orders.length === 0) throw new NotFoundException('No orders were found for this user');
    return orders;
  }

  async getById(id: number) {
    const orders = await this.orderRepository.findOneBy({ id })
    if (!orders) throw new NotFoundException('Order is not found');
    return orders;
  }

  async completeOrder(id: number) {
    const updateResult: UpdateResult = await this.orderRepository.update({ id }, { isDelivered: true });
    if (!updateResult || updateResult.affected === 0) throw new BadRequestException('Could not complete the order');
    return { message: "Successfully completed the order." }
  }
}
