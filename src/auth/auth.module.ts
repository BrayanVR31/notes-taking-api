import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from '@/token/token.service';
import { PrismaService } from '@/prisma.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { jwtConstants } from '@/constants/jwt.constant';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secretAccess,
      signOptions: {
        expiresIn: "15m"
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService]
})
export class AuthModule { }
