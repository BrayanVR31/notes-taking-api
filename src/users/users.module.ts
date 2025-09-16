import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { IsUserAlreadyExistConstraint } from '../validators/user.validator';

@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService, IsUserAlreadyExistConstraint],
})
export class UsersModule { }
