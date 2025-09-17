import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from "bcrypt";
import { UsersService } from '../users/users.service';
import { SignInDto } from "./dto/SignIn.dto";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) { }

  async signIn({ email, password }: SignInDto): Promise<{
    access_token: string;
  }> {
    const existingUser = await this.userService.findByEmail(email);
    if (!existingUser) throw new UnauthorizedException();
    // Match the current password with bcrypt
    const matchedPass = await bcrypt.compare(password, existingUser.password);
    if (!matchedPass) throw new UnauthorizedException();
    // Signing and creating JWT token
    const payload = { sub: existingUser.id, email: existingUser.email };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
