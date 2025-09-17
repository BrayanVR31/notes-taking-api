import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService]
})
export class AuthModule { }
