import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private prismaService: PrismaService) { }

  create(createSessionDto: CreateSessionDto) {
    const token = createSessionDto.token ?? "";
    return this.prismaService.session.create({
      data: {
        ...createSessionDto,
        token
      },
    });
  }

  update(sessionId: string, data: Partial<Session>) {
    return this.prismaService.session.update({
      where: { id: sessionId },
      data
    });
  }

  findUnique(sessionId: string) {
    return this.prismaService.session.findUnique({
      where: {
        id: sessionId
      }
    });
  }
}
