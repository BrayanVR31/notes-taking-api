import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from "bcrypt";
import { UsersService } from '../users/users.service';
import { SignInDto } from "./dto/SignIn.dto";

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) { }

  // TODO: Implement JWT authentication
  async signIn({ email, password }: SignInDto): Promise<string> {
    const existingUser = await this.userService.findByEmail(email);
    if (!existingUser) throw new UnauthorizedException();
    // Match the current password with bcrypt
    const matchedPass = await bcrypt.compare(password, existingUser.password);
    if (!matchedPass) throw new UnauthorizedException();
    return "token_simulation";
  }
}
