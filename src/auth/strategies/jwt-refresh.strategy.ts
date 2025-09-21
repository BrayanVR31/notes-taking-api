import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtConstants } from "@/constants/jwt.constant";
import { UsersService } from "@/users/users.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly userService: UsersService;

  constructor(userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretRefresh || ""
    });
    this.userService = userService;
  }

  async validate(payload: any) {
    console.log("refresh")
    const user = await this.userService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();
    return {
      attributes: user,
      refreshTokenExp: new Date(payload.exp * 1_000)
    };
  }
}

