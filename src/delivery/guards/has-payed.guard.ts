import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { PaymentToken } from "../../payment/entities/payment-token.entity";

@Injectable()
export class HasPayedGuard implements CanActivate {
  constructor(private readonly connection: Connection) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.body.paymentType) {
      throw new ForbiddenException("Please provide paymentType.")
    }

    const user = req.user;
    const paymentToken = await this.connection.getRepository(PaymentToken).findOneBy({ user });

    return paymentToken && paymentToken.token === req.body.paymentToken;
  }
}