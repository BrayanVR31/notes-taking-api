import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from "bcrypt";
import { Payload } from "@/interfaces/payload";
import { PrismaService } from '@/prisma.service';
import { User } from '@prisma/client';
import { jwtConstants } from '@/constants/jwt.constant';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService, private prismaService: PrismaService) { }

  async insertRefreshToken(user: User): Promise<string> {
    const expiresMs = BigInt(Date.now() + jwtConstants.refreshExpiration);
    const payload: Payload = { sub: user.id, username: user.username ?? "" };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: `${jwtConstants.refreshExpiration}ms`,
      secret: jwtConstants.secretRefresh
    });
    const hashedToken = await bcrypt.hash(token, 10);
    await this.prismaService.token.create({
      data: {
        token: hashedToken,
        expiresAt: expiresMs,
        userId: user.id
      }
    });
    return token;
  }

  async insertAccessToken(user: User): Promise<string> {
    const payload: Payload = { sub: user.id, username: user.username! }
    return await this.jwtService.signAsync(payload, {
      expiresIn: `${jwtConstants.accessExpiration}ms`,
      secret: jwtConstants.secretAccess
    })
  }

  async createRefreshToken(userId: number, refreshToken?: string, refreshTokenExp?: Date) {
    const generatedToken = await this.jwtService.signAsync({
      sub: userId
    }, {
      secret: jwtConstants.secretRefresh,
      expiresIn: '7d'
    });

    // Save an jwt token in database
    if (refreshToken && refreshTokenExp) {
      if (await this.findRefreshToken(refreshToken, userId)) throw new UnauthorizedException("Invalid token");
      await this.prismaService.token.create({
        data: {
          token: refreshToken,
          expiresAt: refreshTokenExp.getMilliseconds()! ?? null,
          userId
        }
      })
    }
    return generatedToken;
  }

  private findRefreshToken(token: string, userId: number) {
    return this.prismaService.token.findMany({
      where: {
        token,
        userId
      }
    });
  }

  async createTokens(user: User, refreshToken?: string, refreshTokenExp?: Date) {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secretAccess,
        expiresIn: '15m'
      }),
      refresh_token: await this.createRefreshToken(user.id, refreshToken, refreshTokenExp)
    }
  }

  // TODO: Create a session table to syncronize incoming refresh token and delete it
  async removeRefreshToken(token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    const foundToken = await this.prismaService.token.findUnique({
      where: {
        token: hashedToken
      }
    });
    await this.prismaService.token.deleteMany({
      where: { id: foundToken?.id ?? 0 }
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async clearExpiredToken() {
    await this.prismaService.token.deleteMany({
      where: {
        expiresAt: {
          lte: new Date().getMilliseconds()
        }
      }
    })
  }
}
