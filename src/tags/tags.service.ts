import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma.service';
import { Tag, Prisma } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) { }

  create(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: createTagDto,
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TagWhereUniqueInput;
    where?: Prisma.TagWhereInput;
    orderBy?:
    | Prisma.TagOrderByWithRelationInput
    | Prisma.TagOrderByWithRelationInput[];
  }): Promise<Tag[]> {
    return this.prisma.tag.findMany({ ...params });
  }

  findOne(id: number) {
    return this.prisma.tag.findUnique({
      where: { id }
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto
    });
  }

  remove(id: number) {
    return this.prisma.tag.delete({
      where: { id }
    });
  }
}
