import { IS_PUBLIC_KEY } from '@/constants/jwt.constant';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// TODO: Solve the issue when the access token is passed into the refresh cookie token, it has valid access even when both are different secret keys
@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard("jwt-refresh") {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) throw new UnauthorizedException({
      message: "Expired session, log in again",
      statusCode: 401
    });
    return user;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }

}
