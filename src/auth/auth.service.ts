import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import * as bcrypt from "bcryptjs"
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult, UpdateResult } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from './../user/dto/create-user.dto';
import { MailService } from './../mail/mail.service';
import { v4 } from 'uuid';
import { ConfirmationToken } from './entities/confirmation-token.entity';
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ForgotPasswordToken } from "./entities/forgot-password-token.entity";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @InjectRepository(ConfirmationToken) private readonly confirmationTokenRepository: Repository<ConfirmationToken>,
    @InjectRepository(ForgotPasswordToken) private readonly forgotPasswordTokenRepository: Repository<ForgotPasswordToken>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new BadRequestException('Email or password is incorrect!');
    }

    const access_token = this.jwtSignToken(user.email);

    return { access_token };
  }

  async register(craeteUserDto: CreateUserDto, roleId: number) {
    try {
      const user = await this.userService.create(craeteUserDto, roleId);
      const confirmationToken = await this.createConfirmationToken(user);

      return await this.mailService.sendEmailConfirmationMail({
        email: user.email,
        firstName: user.firstname,
        token: confirmationToken.token,
      })
    } catch (error) {
      throw error;
    }
  }

  async confirmMail(token: string) {
    const confirmationToken = await this.confirmationTokenRepository.findOne({
      where: { token },
      relations: {
        user: true
      }
    });
    if (!confirmationToken) throw new NotFoundException('Comfirmation token is not found');

    const userId: number = confirmationToken.user.id;
    const updateResult: UpdateResult = await this.userRepository.update({ id: userId }, { isConfirmed: true });
    if (!updateResult || updateResult.affected === 0) throw new BadRequestException('Could not confirm user');

    const options = { token, user: confirmationToken.user } as unknown;
    const deleteResult: DeleteResult = await this.confirmationTokenRepository.delete(options);
    if (deleteResult && deleteResult.affected === 0) throw new BadRequestException('Could not delete confirmation token.');

    return this.jwtSignToken(confirmationToken.user.email);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPasswordDto.email, true);
    if (!user) throw new NotFoundException('User does not exist');

    try {
      const forgotPasswordToken = await this.createForgotPasswordToken(user);
      return await this.mailService.sendPasswordConfirmationMail({
        token: forgotPasswordToken.token,
        email: user.email,
        firstName: user.firstname
      });
    } catch (error) {
      throw error;
    }
  }

  async confirmPassword(token: string) {
    const updateResult: UpdateResult = await this.forgotPasswordTokenRepository.update({ token }, { isConfirmed: true });
    if (!updateResult || updateResult.affected === 0) throw new BadRequestException('Could not confirm password change.');

    return { message: 'Successfully confirmed password change.' }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const forgotPasswordToken = await this.forgotPasswordTokenRepository.findOne({
      where: {
        token: resetPasswordDto.token,
        isConfirmed: true
      },
      relations: { user: true }
    });
    if (!forgotPasswordToken) new ForbiddenException('Token for resetting password is not found or confirmed.');

    const userId = forgotPasswordToken.user.id;
    const hashedPassword: string = await bcrypt.hash(resetPasswordDto.password, 12);
    const updateResult: UpdateResult = await this.userRepository.update({ id: userId }, { password: hashedPassword });
    if (!updateResult || updateResult.affected === 0) throw new BadRequestException('Could not change the password');

    const deleteResult: DeleteResult = await this.forgotPasswordTokenRepository.delete({ token: forgotPasswordToken.token });
    if (!deleteResult || deleteResult.affected === 0) throw new BadRequestException('Could not delete the token');

    return { message: "Successfully changed the password." }
  }

  private async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userService.findByEmail(loginDto.email, true);

    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      delete user.password;

      return user;
    }

    return null;
  }

  private jwtSignToken(email: string) {
    const payload: JwtPayloadDto = { email };

    return this.jwtService.sign(payload);
  }

  private async createConfirmationToken(user: User) {
    const token: string = v4();
    const confirmationToken = this.confirmationTokenRepository.create({ token, user });
    if (!confirmationToken) throw new BadRequestException('Could not create a confirmation token');
    return await this.confirmationTokenRepository.save(confirmationToken);
  }

  private async createForgotPasswordToken(user: User) {
    const token: string = v4();
    const forgotPasswordToken = this.forgotPasswordTokenRepository.create({ token, user });
    if (!forgotPasswordToken) throw new BadRequestException('Could not create a confirmation token');
    return await this.forgotPasswordTokenRepository.save(forgotPasswordToken);
  }
}
