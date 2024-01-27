import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Address])
  ],
  exports: [AddressService]
})
export class AddressModule { }
