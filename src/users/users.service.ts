import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?:
    | Prisma.UserOrderByWithRelationInput
    | Prisma.UserOrderByWithRelationInput[];
  }): Promise<User[] | null> {
    return this.prisma.user.findMany(params);
  }

  create(user: CreateUserDto) {
    return this.prisma.user.create({
      data: user
    });
  }

}
