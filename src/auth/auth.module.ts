import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { jwtConstants } from "./conctants";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { Role } from "./entities/role.entity";
import { MailModule } from './../mail/mail.module';
import { ConfirmationToken } from './entities/confirmation-token.entity';
import { ForgotPasswordToken } from './entities/forgot-password-token.entity';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, Role, ConfirmationToken, ForgotPasswordToken]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' }
    }),
    UserModule,
    ConfigModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtStrategy, AuthService]
})
export class AuthModule { }
