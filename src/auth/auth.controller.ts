import { Body, Controller, Get, Param, Post, ParseUUIDPipe, Res, Patch } from "@nestjs/common";
import { AuthService } from './auth.service';
import { LoginDto } from "./dto/login.dto";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto, 2);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // @Get('confirm-email/:token')
  // async confirmMail(@Param('token', ParseUUIDPipe) token: string, @Res() response: any) {
  //   try {
  //     await this.authService.confirmMail(token);
  //     return response.redirect(process.env.FRONT_BASE_URL);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('confirm-password/:token')
  async confirmPassword(@Param('token', ParseUUIDPipe) token: string, @Res() response: any) {
    try {
      await this.authService.confirmPassword(token);
      return response.redirect(`${process.env.FRONT_BASE_URL}reset-password/${token}`);
    } catch (error) {
      throw error;
    }
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
