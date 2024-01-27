import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/entities/user.entity";
import { Repository } from "typeorm";
import { jwtConstants } from "../conctants";
import { JwtPayloadDto } from "../dto/jwt-payload.dto";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(jwtPayloadDto: JwtPayloadDto) {
    const user = await this.userService.findByEmail(jwtPayloadDto.email, true);

    if (!user) throw new UnauthorizedException();

    delete user.password;

    return user;
  }
}