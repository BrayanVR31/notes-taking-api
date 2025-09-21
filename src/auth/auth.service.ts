import { Injectable } from '@nestjs/common';
import bcrypt from "bcrypt";
import { UsersService } from '@/users/users.service';
import { User } from '@prisma/client';
import { TokenService } from '@/token/token.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private tokenService: TokenService) { }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    // When the user credentials are matched
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...results } = user;
      return results;
    }
    return null;
  }

  async login(user: User): Promise<Record<"access_token" | "refresh_token", string>> {
    return {
      access_token: await this.tokenService.insertAccessToken(user),
      refresh_token: await this.tokenService.insertRefreshToken(user)
    };
  }



}
