import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from '@/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [JwtService, TokenService, PrismaService]
})
export class TokenModule { }
