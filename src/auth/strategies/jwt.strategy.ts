import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtConstants } from "@/constants/jwt.constant";
import { UsersService } from "@/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretAccess || "",
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
