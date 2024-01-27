import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Repository, DeleteResult } from 'typeorm';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './../user/user.service';
import { User } from 'src/user/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

export type FindAddressQuery = {
  limit?: number;
}

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private readonly addressesRepository: Repository<Address>,
    private readonly userService: UserService
  ) { }

  async create(createAddressDto: CreateAddressDto, userId: number) {
    const user: User = await this.userService.getById(userId);
    const address = this.addressesRepository.create({
      ...createAddressDto,
      user
    });
    const data = await this.addressesRepository.save(address);
    if (!data) throw new BadRequestException('Could not create an address');

    delete data.user;

    return data;
  }

  async getByUserId(userId: number) {
    const user: User = await this.userService.getById(userId);
    const options = { user } as unknown;
    const addresses: Address[] = await this.addressesRepository.findBy(options)
    if (!addresses || addresses.length === 0) throw new NotFoundException('Addresses are not found.')
    return addresses;
  }

  async get(query: FindAddressQuery) {
    const options = {}
    if (query.limit) {
      options['take'] = query.limit;
    }
    const addresses = await this.addressesRepository.find(options);
    if (!addresses || addresses.length === 0) throw new NotFoundException('Addresses are not found.')

    return addresses;
  }

  async getById(id: number) {
    const address = await this.addressesRepository.findOneBy({ id });
    if (!address) throw new NotFoundException('Addresse is not found.');
    return address;
  }

  async update(id: number, userId: number, updateAddressDto: UpdateAddressDto) {
    const user: User = await this.userService.getById(userId);
    const options = {
      id, user
    } as unknown;
    const updateResult: UpdateResult = await this.addressesRepository.update(options, updateAddressDto);
    if (!updateResult || updateResult.affected === 0) throw new BadRequestException('Could not update the address');

    return { message: 'Successfully updated the address' };
  }

  async remove(id: number, userId: number) {
    const user: User = await this.userService.getById(userId);
    const options = {
      id, user
    } as unknown;
    const deletedResult: DeleteResult = await this.addressesRepository.delete(options);
    if (!deletedResult || deletedResult.affected === 0) throw new BadRequestException('Could not delete the address');

    return { message: 'Successfully deleted the address' };
  }
}
