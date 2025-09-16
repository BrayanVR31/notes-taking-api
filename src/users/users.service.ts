import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';

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

  async create(user: CreateUserDto) {
    const hashedPass = await bcrypt.hash(user.password, 10);
    return this.prisma.user.create({
      data: {
        ...user,
        password: hashedPass,
      }
    });
  }

}
