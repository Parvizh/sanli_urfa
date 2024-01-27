import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../../user/entities/user.entity";

export const GetUser = createParamDecorator(
  (_data, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    return _data ? user[_data] : user;
  }
);