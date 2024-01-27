import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AddressService, FindAddressQuery } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createAddressDto: CreateAddressDto, @GetUser('id') userId: number) {
    return this.addressService.create(createAddressDto, userId);
  }

  @Get()
  get(@Query() query: FindAddressQuery) {
    return this.addressService.get(query);
  }

  @Get('one-address/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('current-user')
  getByUserId(@GetUser('id') userId: number) {
    return this.addressService.getByUserId(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
    @Body() updateAddressDto: UpdateAddressDto
  ) {
    return this.addressService.update(id, userId, updateAddressDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number
  ) {
    return this.addressService.remove(id, userId);
  }
}
