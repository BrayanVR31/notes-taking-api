import { IS_PUBLIC_KEY } from '@/constants/jwt.constant';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard("jwt-refresh") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    console.log({ isPublic, jwtRefreshAuthGuard: true })

    if (isPublic) return true;
    return super.canActivate(context);
  }

}
