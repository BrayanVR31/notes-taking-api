import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from '@/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SessionModule } from '@/session/session.module';

@Module({
  imports: [SessionModule],
  providers: [JwtService, TokenService, PrismaService],
  exports: [TokenService]
})
export class TokenModule { }
