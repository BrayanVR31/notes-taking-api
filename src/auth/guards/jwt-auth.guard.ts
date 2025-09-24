import { IS_PUBLIC_KEY, IS_ONLY_REFRESH_KEY } from "@/constants/jwt.constant";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) throw new UnauthorizedException({
      message: "Expired session, try it again",
      statusCode: 401
    });
    return user;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    const isOnlyRefresh = this.reflector.getAllAndOverride<boolean>(IS_ONLY_REFRESH_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic || isOnlyRefresh) return true;
    return super.canActivate(context);
  }
}
