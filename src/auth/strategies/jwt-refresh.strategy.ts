import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { type Request } from "express";
import { jwtConstants } from "@/constants/jwt.constant";
import { UsersService } from "@/users/users.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretRefresh || ""
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne({ id: payload.sub });
    if (!user) throw new UnauthorizedException();
    return {
      attributes: user,
      refreshTokenExp: new Date(payload.exp * 1_000)
    };
  }
}
