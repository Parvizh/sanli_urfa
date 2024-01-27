import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException, UnauthorizedException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { Role } from "../auth/entities/role.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UnprocessableEntityException } from "@nestjs/common";
import { deleteImage } from 'src/helpers/file-helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) { }

  async create(createUserDto: CreateUserDto, roleId: number): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    delete createUserDto.password;

    const role = await this.roleRepository.findOneBy({ id: roleId });
    let user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role
    });

    if (roleId === 1) {
      user.isConfirmed = true;
    }

    try {
      const data = await this.userRepository.save(user);
      return data;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        let repeatedValue;

        if (await this.userRepository.findOneBy({ email: createUserDto.email })) repeatedValue = 'Email';
        else repeatedValue = 'Phone Number';

        throw new ConflictException(`${repeatedValue} already exists`);
      } else {
        console.log(err);

        throw new BadRequestException('Something went wrong');
      }
    }

    delete user.password;

    return user;
  }

  async get(role: string): Promise<User[]> {
    let options: Object = {};
    if (role) options = {
      where: { role: { name: role } },
      relations: ['role']
    };

    return await this.userRepository.find(options);
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        role: true,
        orders: true,
        addresses: true,
      }
    });

    if (user) return user;
    else throw new NotFoundException('User not found!');
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Object> {
    const user = await this.getById(id);
    const oldEmail = user.email;
    Object.assign(user, updateUserDto);

    try {
      await this.userRepository.save(user);
      return { message: 'Successfully updated user' };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        let repeatedValue;

        if (
          await this.userRepository.findOneBy({ email: updateUserDto.email }) && updateUserDto.email !== oldEmail
        ) repeatedValue = 'Email';
        else repeatedValue = 'Phone Number';

        throw new ConflictException(`${repeatedValue} already exists`);
      } else {
        throw new BadRequestException('Something went wrong');
      }
    }
  }

  async delete(id: number, userId: number) {
    if (id === userId) throw new UnauthorizedException('You cannot delete yourself');

    const user = await this.getById(id);

    if (await this.userRepository.remove(user)) return { message: 'Successfully deleted user' };
    else throw new NotImplementedException('Could not delete news');
  }

  async findByEmail(email: string, isConfirmed: boolean = false): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email,
        isConfirmed
      },
      select: ['id', 'email', 'password', 'firstname', 'lastname', 'phone_number', 'imageUrl'],
      relations: ['role']
    });
  }

  async uploadAvatar(filename: string, id: number, imageUrl: string) {
    if (!filename) throw new UnprocessableEntityException('Could not upload image, please provide image with .jpg, .jpeg, .png extensions');
    if (imageUrl !== null) {
      deleteImage(imageUrl);
    }
    const updatedResult: UpdateResult = await this.userRepository.update({ id }, { imageUrl: `images/avatars/${filename}` });
    return { message: 'Successfully updated the avatar' };
  }

  async deletAvatar(id: number, imageUrl: string) {
    if (imageUrl == null) throw new BadRequestException('User does not have avatar');
    deleteImage(imageUrl);
    const updateResult: UpdateResult = await this.userRepository.update({ id }, { imageUrl: "" });
    return { message: "Avatar was successfully deleted" }
  }
}
