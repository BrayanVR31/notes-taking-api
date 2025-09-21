import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { jwtConstants } from "@/constants/jwt.constant";
import { UsersService } from "@/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userService: UsersService;

  constructor(userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretAccess || ""
    });
    this.userService = userService;
  }

  async validate(payload: any) {
    console.log("normal token")
    const user = await this.userService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException("error");
    return user;
  }
}
