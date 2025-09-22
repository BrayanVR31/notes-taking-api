import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';

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

  updateOne(userId: number, user: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: user
    });
  }

  findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

}
