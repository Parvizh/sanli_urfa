import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CartToken = createParamDecorator(
    (_data, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        const token = req.headers.cart_token || "INVALID_TOKEN"
        // NOTE: INVALID_TOKEN is only for ParseUUIDPipe recognize 
        // an error and does not let the request start if token is not provided
        return token;
    }
);