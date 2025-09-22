import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { type Response, type Request } from "express";
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { jwtConstants, SkipAuth } from '@/constants/jwt.constant';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, refresh_token } = await this.authService.login((req as any).user);
    res.cookie("refresh", refresh_token, {
      httpOnly: true,
      secure: false, // Enable on https protocol
      sameSite: "lax",
      maxAge: jwtConstants.refreshExpiration
    });
    return { access_token }
  }

  @UseGuards(LocalAuthGuard)
  @Post("/logout")
  async logout(@Req() req: Request) {
    return (req as any).logout();
  }

}
