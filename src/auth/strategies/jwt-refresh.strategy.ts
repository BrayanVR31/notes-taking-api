import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { type Request } from "express";
import { jwtConstants } from "@/constants/jwt.constant";
import { UsersService } from "@/users/users.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies["refresh"]
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretRefresh || ""
    });
  }

  async validate(payload: any) {
    const { password, ...user } = await this.usersService.findOne({
      id: payload.sub
    }) ?? {};
    if (!user) throw new UnauthorizedException("Invalid token");
    return user;
  }
}
