import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Payload } from "@/interfaces/payload";
import { PrismaService } from '@/prisma.service';
import { User } from '@prisma/client';
import { jwtConstants } from '@/constants/jwt.constant';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionData } from '@/interfaces/session';
import { SessionService } from '@/session/session.service';
import { decode } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService, private prismaService: PrismaService, private sessionService: SessionService) { }

  /**
   *  This method will create an refresh token saved on db and
   *  also it will add new user session with token ref
   * **/
  async insertRefreshToken(user: User, { ipAddress, userAgent }: SessionData): Promise<string> {
    const sessionId = uuidv4();
    const expiresMs = BigInt(Date.now() + jwtConstants.refreshExpiration);
    const payload: Payload = { sub: user.id, username: user.username ?? "", sid: sessionId };
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

    await this.sessionService.create({
      id: sessionId,
      token: hashedToken,
      userId: user.id,
      ipAddress,
      userAgent
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
    const decodedToken = decode(token) as any as Payload;
    const currentSession = await this.sessionService.findUnique(decodedToken.sid ?? "");
    const foundToken = await this.prismaService.token.findUnique({
      where: {
        token: currentSession?.token
      }
    });
    await this.sessionService.update(currentSession?.id ?? "", {
      token: ""
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
