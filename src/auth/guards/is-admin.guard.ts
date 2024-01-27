import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    return req.user.role.name === 'admin';
  }
}